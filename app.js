const AmbientWeatherApi = require('ambient-weather-api')

const mqtt = require('mqtt')
const mClient = mqtt.connect(process.env.MQTT_BROKER_ADDRESS, {
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD,
    keepalive: 10000,
    connectTimeout: 120000,
    reconnectPeriod: 500
})

const api = new AmbientWeatherApi({
    apiKey: process.env.API_KEY,
    applicationKey: process.env.APP_KEY
})

let ts = () => new Date()

const handleClientError = function(e){
    console.log('connection error to broker, exiting')
    setTimeout(()=>{
        process.exit()
    }, 10000)
}

mClient.on('error', handleClientError)

mClient.on('offline', function () {
    console.log(`${ts()} - BROKER OFFLINE`)
})

let publishHandler = function (e) {
    if (e) {
        return console.error(e)
    }
    // console.log(`${ts()} - mqtt publish`)
}

// connect to cloud once mqtt is up:
mClient.on('connect', function () {
    console.log(`${ts()} - mqtt connected`)
    mClient.publish('aw/alive', null, publishHandler)
})


api.on('error', e => {
    console.error('API Error:', e)
})

api.on('connect', () => {
    console.log(`${ts()} - connected`)
    mClient.publish('aw/connect', null, publishHandler)
    api.subscribe(process.env.API_KEY)
})

api.on('subscribed', data => {
    console.log(`${ts()} - subscribed`)
    mClient.publish('aw/subscribe', JSON.stringify(data))
    // publish lastdata as data to avoid update interval blackout:
    var lastData = data['devices'][0]['lastData']
    // loop through properties and publish each one as it's own topic
    for (var prop in lastData) {
        if (lastData.hasOwnProperty(prop)) {
            mClient.publish('aw/data/' + prop, JSON.stringify(lastData[prop]), publishHandler)
        }
    }
})

api.on('data', data => {
    console.log(`${ts()} - aw data`)
    // delete device node to prevent topic spamming
    delete data.device
    // loop through properties and publish each one as it's own topic
    for (var prop in data) {
        if (data.hasOwnProperty(prop)) {
            mClient.publish('aw/data/' + prop, JSON.stringify(data[prop]), publishHandler)
        }
    }
})

api.connect()