'use strict';

/*
 * App ID for the skill
 */
var APP_ID = undefined;

/*
 * Environment Configuration
 */
var config = {};
config.IOT_BROKER_ENDPOINT      = "identifier.iot.us-east-1.amazonaws.com".toLowerCase();
config.IOT_BROKER_REGION        = "us-east-1";

//Loading AWS SDK libraries
var AWS = require('aws-sdk');
AWS.config.region = config.IOT_BROKER_REGION;
//Initializing client for IoT
var iotData = new AWS.IotData({endpoint: config.IOT_BROKER_ENDPOINT});
var topic = "/fernseher";

var Alexa = require("alexa-sdk");

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'PushMessage': function (payload, tell) {
        var params = {
            topic: topic,
            payload: payload,
            qos:0
        };
        iotData.publish(params, (err, data) => {
            if (!err){
                this.emit(':tell', tell);
            }   
        });
    },
    'LaunchRequest': function () {
        this.emit('StartIntent');
    },
    'StartIntent': function () {
        this.emit('PushMessage', 'start', 'wird gestartet');
    },
    'StopIntent': function () {
        this.emit('PushMessage', 'stop', 'wird heruntergefahren');
    },
    'ChangeChannelIntent': function () {
        var channel = this.event.request.intent.slots.Channel.value;
        this.emit('PushMessage', channel, 'ok');
    },
    'VolUpIntent': function () {
        this.emit('PushMessage', 'volup', 'ok');
    },
    'VolDownIntent': function () {
        this.emit('PushMessage', 'voldown', 'ok');
    },
    "Unhandled": function () {
        this.emit(':tell', 'keine ahnung');
    }
};