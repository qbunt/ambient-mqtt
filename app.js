const AmbientWeatherApi = require('ambient-weather-api')

const mqtt = require('mqtt')
const mClient = mqtt.connect(process.env.MQTT_BROKER_ADDRESS, {
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD,
})

const api = new AmbientWeatherApi({
    apiKey: process.env.API_KEY,
    applicationKey: process.env.APP_KEY
})

let ts = () => new Date()
const conn = process.env.MQTT_CONNECT_TOPIC | 'aw/connect'
const subscribe = process.env.MQTT_SUBSCRIBE_TOPIC | 'aw/subscribe'
const update = process.env.MQTT_UPDATE_TOPIC | 'aw/update'

api.connect()

api.on('error', e => {
    console.error('shit is sideways:', e)
})

api.on('connect', () => {
    console.log(`connected: ${ts()}`)
    mClient.publish(conn)
})

api.on('subscribed', data => {
    console.log(`subscribed: ${ts()}`)
    mClient.publish(subscribe, JSON.stringify(data))
})

api.on('data', data => {
    console.log(`data: ${ts()}`)
    mClient.publish(update, JSON.stringify(data))
})

api.subscribe(process.env.API_KEY)