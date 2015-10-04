var express = require('express');
var app = express();
var Twit = require('twit');
var User = require('./user');
var mongoose = require('mongoose');

mongoose.connect('mongodb://username:password@apollo.modulusmongo.net:27017/eSog9uma')

var T = new Twit({
  consumer_key: 'CcAL0tc9SKIFtTJXGTFg5Agd3',
  consumer_secret: '6cDbgsI01uMxZ7m0RvVaecG9OQkb1PwC6mcQOa79grDBcHO4qU',
  access_token: '3773646014-1lG9ui4o7C8ioH5v9dS78Kdj5lYS2YA4OlwOkrg',
  access_token_secret: 'FbK9R1YITrSSSKjQXSDeVclde4pZfhJQiaJBBrVGUlqb9'
})

console.log('working');

var stream = T.stream('statuses/filter', {track: '@rfg_io'});

var notifyMatchedParticipants = function(host, refugee) {

  // Text to send to host
  var hostMessage = 'Hi @' + host.username +
      '! Thanks for volunteering to host! You have been matched with ' +
      '@' + refugee.username + ' who has '+ refugee.people +
      ' people with them near ' + refugee.location;

  // Text to send to refugee
  var refugeeMessage = 'Hi @' + refugee.username +
      '! You have been matched with a host! ' +
      '@' + host.username + ' can accomodate up to ' + host.people +
      ' people near ' + host.location;

  // Message Host
  T.post('direct_messages/new', {screen_name: host.username,
      text: hostMessage}, function(err, data, response) {
        if (err) throw err;
        console.log(data);
      });

  // Message Refugee
  T.post('direct_messages/new', {screen_name: refugee.username,
      text: refugeeMessage}, function(err, data, response) {
        if (err) throw err;
        console.log(data);
      });

  User.findOneAndRemove({ 'username': host.username}, {
    username: 1, people: 1, host: 1, location: 1, time: 1
  }, function(err, user) {
    console.log('findone: ' + user);
  })

  User.findOneAndRemove({ 'username': refugee.username}, {
    username: 1, people: 1, host: 1, location: 1, time: 1
  }, function(err, user) {
    console.log('findone: ' + user);
  })
}

var refugees = [];
var hosts = [];

stream.on('tweet', function(tweet) {
  console.log(tweet);

  var twitterUser = {};

  var userTweet = tweet.text;

  twitterUser['username'] = tweet.user.screen_name;

  var tweetText = userTweet.replace( /[^\d.]/g, '' );
  twitterUser['people'] = parseInt(tweetText, 10);

  if (userTweet.includes('#refugee') || userTweet.includes('#refugees')) {
    twitterUser['host'] = false;
    refugees.push(twitterUser);
  } else if (userTweet.includes('#host') || userTweet.includes('#hosts')) {
    twitterUser['host'] = true;
    hosts.push(twitterUser);
  }

  var location = [];

  if (userTweet.includes('#location')) {
    var locationIndex = userTweet.search('#location') + 10;

    for (var i = locationIndex; i < userTweet.length && /[a-zA-Z ]/.test(userTweet[i]); i++) {
      location.push(userTweet[i]);
    }
  }

  twitterUser['location'] = location.join('');

  var user = new User({
    username: twitterUser.username,
    people: twitterUser.people,
    host: twitterUser.host,
    location: twitterUser.location,
    time: new Date(tweet.user.created_at)
  });

  User.findOneAndRemove({ 'username': twitterUser.username}, {
    username: 1, people: 1, host: 1, location: 1, time: 1
  }, function(err, removedUser) {
    console.log('findone: ' + removedUser);
  })

  function saveUser() {
    user.save(function(err, data) {
      console.log("#############");
      console.log(data);
      console.log("#############");
      if (err) {
        console.log(err);
        return err;
      } else {
        console.log('username added to database!');
      }
    })
  };

  var isFollowing = function(current_name) {
    // Find all followers
    var boolean = false;
    T.get('followers/list', {screen_name: 'RFG_io', skip_status: true},
        function (err, data, response) {
          console.log('PRINT HERE ADFKJADF;AKDJFA;');
          data.users.forEach(function (user) {
            if (current_name.username == user.screen_name) {
              boolean = true;
            };
          });
        });
    return boolean;
  }

  var queryMatch = null;

  if (twitterUser.host) {
    User.find({ location: twitterUser.location, people: {$lte: twitterUser.people}, host: false}).sort({time : 1}).limit(1).exec(function(err, users) {
        if (err) throw err;
        console.log("######asshost#######");
        queryMatch = users[0];
        console.log(users);

        console.log("$$$$$$$$$$$");
        console.log(queryMatch);
        console.log("$$$$$$$$$$$");
        if (!isFollowing(user)) {
          var params = {status: '@'+user.username+' please follow us back to get updates!'};
          T.post('statuses/update', params, function (err, data, response) {
            console.log(data);
          });
        } else if (!isFollowing(queryMatch)) {
          var params = {status: '@'+queryMatch.username+' please follow us back to get updates!'};
          T.post('statuses/update', params, function (err, data, response) {
            console.log(data);
          });
        }
        else if (users.length > 0) {
          notifyMatchedParticipants(user, queryMatch);
        } else {
          saveUser();
        }
    });
  } else {
    User.find({ location: twitterUser.location, people: {$gte: twitterUser.people}, host: true}).sort({time : 1}).limit(1).exec(function(err, users) {
        if (err) throw err;
        console.log("######assref#######");
        if (users.length > 0) {
            queryMatch = users[0];
        }
        console.log(users);

        console.log("$$$$$$$$$$$");
        console.log(queryMatch);
        console.log("$$$$$$$$$$$");

        if (!isFollowing(user)) {
          var params = {status: '@'+user.username+' please follow us back to get updates!'};
          T.post('statuses/update', params, function (err, data, response) {
            console.log(data);
          });
        } else if (!isFollowing(queryMatch)) {
          var params = {status: '@'+queryMatch.username+' please follow us back to get updates!'};
          T.post('statuses/update', params, function (err, data, response) {
            console.log(data);
          });
        } else if (users.length > 0) {
          notifyMatchedParticipants(queryMatch, user);
        } else {
          saveUser();
        }
    });
  }

  console.log('hosts: ' + JSON.stringify(hosts, null, 2));
  console.log('refugees: ' + JSON.stringify(refugees, null, 2));
});
