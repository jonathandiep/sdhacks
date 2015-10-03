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

  var twitterUser = {};

  var userTweet = tweet.text;

  twitterUser['handle'] = tweet.user.screen_name;

  var tweetText = userTweet.replace( /[^\d.]/g, '' );
  twitterUser['numOfPeople'] = parseInt(tweetText, 10);

  if (userTweet.includes('#refugee') || userTweet.includes('#refugees')) {
    twitterUser['host'] = false;
    refugees.push(twitterUser);
  }

  else if (userTweet.includes('#host') || userTweet.includes('#hosts')) {
    twitterUser['host'] = true;
    hosts.push(twitterUser);
  }

  var locationIndex = userTweet.search('#location');
  locationIndex += 10;

  var location = [];

  for ( var i = locationIndex; i < userTweet.length && /[a-zA-Z]/.test(userTweet[i]); i++) {
    location.push( userTweet[i] );
  }

  twitterUser['location'] = location.join('');

  console.log('hosts: ' + JSON.stringify(hosts, null, 2));
  console.log('refugees: ' + JSON.stringify(refugees, null, 2));
});

// '@DiepJonathan #refugee #4 people in #location Barcelona.'

// store handle as string
// host = true or false
// get number of people
// get location
