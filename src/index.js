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

var pushMessage = function(payload, tell) {
    var params = {
        topic: topic,
        payload: payload,
        qos:0
    };
    var self = this;
    iotData.publish(params, function(err, data) {
        if (!err){
            self.emit(':tell', tell);
        }   
    });
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('StartIntent');
    },
    'StartIntent': function () {
        pushMessage('start', 'wird gestartet');
    },
    'ChangeChannelIntent': function () {
        var channel = this.event.request.intent.slots.Channel.value;
        pushMessage(channel, 'ok');
    },
    'VolUpIntent': function () {
        pushMessage('volup', 'ok');
    },
    'VolDownIntent': function () {
        pushMessage('voldown', 'ok');
    },
    "Unhandled": function () {
        this.emit(':tell', 'keine ahnung');
    }
};