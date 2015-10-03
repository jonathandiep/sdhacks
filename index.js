var express = require('express');
var app = express();
var Twit = require('twit');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:/')

var T = new Twit({
  consumer_key: 'lGzemE6STP9kvBaHVhiWJuDD0',
  consumer_secret: 'WmU52nDWuVlmc2mMTmiUqyQS6AY5FvabukPMJf1XbLAkqAMWK6',
  access_token: '19480353-KrLUMDOWU9CcPDdninpuWI8ebMIkntTFI6O2S3H6I',
  access_token_secret: 'o2yqzmNhe4XTkF2FApB3e2Sot8HfztjoKQvLMgaAizZx8'
})

/*
T.post('statuses/update', { status: 'testing!' }, function(err, data, response) {
  console.log(data);
})
*/

console.log('working');

var stream = T.stream('statuses/filter', {track: '#sdhackstweettesting'});

stream.on('tweet', function(tweet) {
  var username = tweet.user.screen_name
  console.log(username);
  T.post('statuses/update', { status: '@' + username + ' this is a response!' }, function(err, data, response) {
    if (err) return err;
  });
});
