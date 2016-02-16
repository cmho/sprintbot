/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
          \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
           \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Slack bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.

# RUN THE BOT:

  Get a Bot token from Slack:

    -> http://my.slack.com/services/new/bot

  Run your bot from the command line:

    token=<MY TOKEN> node bot.js

# USE THE BOT:

  Find your bot inside Slack to send it a direct message.

  Say: "Hello"

  The bot will reply "Hello!"

  Say: "who are you?"

  The bot will tell you its name, where it running, and for how long.

  Say: "Call me <nickname>"

  Tell the bot your nickname. Now you are friends.

  Say: "who am I?"

  The bot will tell you your nickname, if it knows one for you.

  Say: "shutdown"

  The bot will ask if you are sure, and then shut itself down.

  Make sure to invite your bot into other channels using /invite @<my bot>!

# EXTEND THE BOT:

  Botkit is has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


var Botkit = require('./lib/Botkit.js')
var os = require('os');

var controller = Botkit.slackbot({
  debug: false,
});

var bot = controller.spawn(
  {
    token:process.env.token
  }
).startRTM();


controller.hears(['start sprint'],'direct_message,direct_mention,mention',function(bot,message) {
	bot.startConversation(message,function(err, convo) {
		var matches = message.text.match(/start sprint ([0-9]+)([smh])/i);
		var time = parseInt(matches[1]);
		var millitime;
		var unit = matches[2];
		if (unit == "s") {
			unit = "second";
			millitime = time*1000;
		} else if (unit == "m") {
			unit = "minute";
			millitime = time*60000;
		} else if (unit == "h") {
			unit = "hour";
			millitime = time*360000;
		} else {
			bot.reply(message, "Time unit not detected; defaulting to minutes.");
			unit = "minute";
			millitime = time*60000;
		}
		bot.reply(message, "@here A "+time+"-"+unit+" sprint is starting now.");
		setTimeout(function () {
			bot.reply(message, "@here Sprint complete! Post your progress.");
		}, millitime);
	});
});

controller.hears(['start pomodoro'],'direct_message,direct_mention,mention',function(bot,message) {
  var matches = message.text.match(/start pomodoro ([0-9]+)m break ([0-9]+)m/i);
  var time = parseInt(matches[1]);
  var breaktime = parseInt(matches[2]);
  var millitime = time*60000;
  var millibreaktime = breaktime*60000;
  var pomo_count = 0;
  bot.startConversation(message,function(err, convo) {
  	bot.reply(message, "Starting pomodoro session.");
  	setTimeout(function (){
  		if 
  	}, millitime);
  });
  controller.storage.users.get(message.user,function(err,user) {
    if (!user) {
      user = {
        id: message.user,
      }
    }
    user.name = name;
    controller.storage.users.save(user,function(err,id) {
      bot.reply(message,"Got it. I will call you " + user.name + " from now on.");
    })
  })
});

controller.hears(['what is my name','who am i'],'direct_message,direct_mention,mention',function(bot,message) {

  controller.storage.users.get(message.user,function(err,user) {
    if (user && user.name) {
      bot.reply(message,"Your name is " + user.name);
    } else {
      bot.reply(message,"I don't know yet!");
    }
  })
});


controller.hears(['shutdown'],'direct_message,direct_mention,mention',function(bot,message) {

  bot.startConversation(message,function(err,convo) {
    convo.ask("Are you sure you want me to shutdown?",[
      {
        pattern: bot.utterances.yes,
        callback: function(response,convo) {
          convo.say("Bye!");
          convo.next();
          setTimeout(function() {
            process.exit();
          },3000);
        }
      },
      {
        pattern: bot.utterances.no,
        default:true,
        callback: function(response,convo) {
          convo.say("*Phew!*");
          convo.next();
        }
      }
    ])
  })
})


controller.hears(['uptime','identify yourself','who are you','what is your name'],'direct_message,direct_mention,mention',function(bot,message) {

  var hostname = os.hostname();
  var uptime = formatUptime(process.uptime());

  bot.reply(message,':robot_face: I am a bot named <@' + bot.identity.name +'>. I have been running for ' + uptime + ' on ' + hostname + ".");

})

function formatUptime(uptime) {
  var unit = 'second';
  if (uptime > 60) {
    uptime = uptime / 60;
    unit = 'minute';
  }
  if (uptime > 60) {
    uptime = uptime / 60;
    unit = 'hour';
  }
  if (uptime != 1) {
    unit = unit +'s';
  }

  uptime = uptime + ' ' + unit;
  return uptime;
}

function pomodoroWork(time, breaktime, convo, message) {
	setTimeout(function() {
		bot.reply(message, "Pomodoro interval complete-time for a "+breaktime+"-minute break.");
		pomodoroBreak(breaktime*60000, time, message);
	}, time);
}

function pomodoroBreak(time, worktime, convo, message) {
	setTimeout(function () {
		bot.reply(message, "Break time's over—time for another "+worktime+"-minute work session.");
		pomodoroWork(worktime*60000, time, message);
	});
}

// this is a test to determine whether my ssh key is working
