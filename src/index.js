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

var Alexa = require("alexa-sdk");

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('StartIntent');
    },
    'StartIntent': function () {
        var paramsStart = {
            topic:"/fernseher",
            payload: "start",
            qos:0
        };
        var self = this;
        iotData.publish(paramsStart, function(err, data) {
          if (!err){
            self.emit(':tell', 'wird gestartet');
          }   
        });
    },
    'ChangeChannelIntent': function () {
        var channel = this.event.request.intent.slots.Channel.value;
        var paramsChannel = {
            topic:"/fernseher",
            payload: channel,
            qos:0
        };
        var self = this;
        iotData.publish(paramsChannel, function(err, data) {
          if (!err){
            self.emit(':tell', 'ok');
          }   
        });
    },
    'VolUpIntent': function () {
        var paramsStart = {
            topic:"/fernseher",
            payload: "volup",
            qos:0
        };
        var self = this;
        iotData.publish(paramsStart, function(err, data) {
          if (!err){
            self.emit(':tell', 'ok');
          }   
        });
    },
    'VolDownIntent': function () {
        var paramsStart = {
            topic:"/fernseher",
            payload: "voldown",
            qos:0
        };
        var self = this;
        iotData.publish(paramsStart, function(err, data) {
          if (!err){
            self.emit(':tell', 'ok');
          }   
        });
    },
    "Unhandled": function () {
        this.emit(':tell', 'keine ahnung');
    }
};