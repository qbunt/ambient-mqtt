# Note: Deprecated and unmaintained
> If you need this for Home Assistant, use the [native AmbientWeather integration](https://www.home-assistant.io/integrations/ambient_station/) instead, I have no interest in maintaining this


##  ambient-mqtt
This app is designed to subscribe to the AmbientWeather Realtime API and broadcast the messages out over MQTT topics

### Usage

```
cp .env-sample .env
// fill out all the config details
npm install
npm start
```

### Environment Configuration

| key                  | description                                                                |
|----------------------|----------------------------------------------------------------------------|
| API_KEY              | API key from Ambient Weather                                               |
| APP_KEY              | Application key from Ambient Weather                                       |
| MQTT_BROKER_ADDRESS  | MQTT broker URL (eg. `mqtt://localhost:1883`)                              |
| MQTT_USER            | Broker user                                                                |
| MQTT_PASSWORD        | Broker password                                                            |
| MQTT_UPDATE_TOPIC    | Broker topic for realtime updates from AmbientWeather                      |
| MQTT_CONNECT_TOPIC   | Broker topic for initial connections to the AmbientWeather Realtime socket |
| MQTT_SUBSCRIBE_TOPIC | Broker topic for successful subscription to the realtime API               |
| MQTT_TOPIC_JSON      | Publish status as JSON to aw/data. true/false (default true)               |


### MQTT_TOPIC_JSON option
By default, the status will be updated to the topic `aw/data` and the payload will be JSON received from the Ambient Weather query. Setting this to false will split each property in the JSON payload to individual topics, one for property.

Example of default behavior (MQTT_TOPIC_JSON=true or MQTT_TOPIC_JSON=):

```json
{"dateutc":1537282680000,"tempf":85.6,"humidity":92,"hourlyrainin":0,"dailyrainin":0,"weeklyrainin":0,"monthlyrainin":1.83,"yearlyrainin":37.23,"totalrainin":37.23,"tempinf":87.8,"humidityin":63,"baromrelin":31.02,"baromabsin":30.06,"dewPoint":83,"lastRain":"2018-09-14T14:56:00.000Z","deviceId":"5a41138884f9e0000d5a822d","date":"2018-09-18T14:58:00.000Z"}
```

Example of (MQTT_TOPIC_JSON=false), individual topics with the value as the payload:
```
aw/data/dateutc
1537282680000

aw/data/tempf
85.6

aw/data/humidity
92
```
