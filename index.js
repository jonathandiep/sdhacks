var express = require('express');
var app = express();
var Twit = require('twit');
var User = require('./user'); // new

var T = new Twit({
  consumer_key: 'lGzemE6STP9kvBaHVhiWJuDD0',
  consumer_secret: 'WmU52nDWuVlmc2mMTmiUqyQS6AY5FvabukPMJf1XbLAkqAMWK6',
  access_token: '19480353-KrLUMDOWU9CcPDdninpuWI8ebMIkntTFI6O2S3H6I',
  access_token_secret: 'o2yqzmNhe4XTkF2FApB3e2Sot8HfztjoKQvLMgaAizZx8'
})


console.log('working');

var stream = T.stream('statuses/filter', {track: '@DiepJonathan'});

var refugees = [];
var hosts = [];

stream.on('tweet', function(tweet) {
  console.log(tweet);
  var userTweet = tweet.text;
  if (userTweet.includes('#refugee') || userTweet.includes('#refugees')) {
    refugees.push(tweet.user.screen_name);
  }

  if (userTweet.includes('#host') || userTweet.includes('#hosts')) {
    hosts.push(tweet.user.screen_name);
  }

  console.log('hosts: ' + hosts);
  console.log('refugees: ' + refugees);
});
