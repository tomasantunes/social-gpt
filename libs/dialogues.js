var {getMySQLConnections} = require('./database');
var {getAnswer} = require("./openai");
var {shuffle} = require("./utils");

var {con, con2} = getMySQLConnections();

async function getRandomDialogues(cb) {
  var sql = "SELECT * FROM dialogues";
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      cb({status: "NOK", error: err.message});
    }
    var dialogues = [];
    for (var i in result) {
      var existing_dialogue_idx = dialogues.findIndex(dialogue => dialogue.id == result[i].bot_id);
      if (existing_dialogue_idx != -1) {
        dialogues[existing_dialogue_idx].dialogue.push(
            {
              role: result[i].role,
              content: result[i].content
            }
        );
      }
      else {
        dialogues.push({
          id: result[i].bot_id,
          author: result[i].author,
          dialogue: [
            {
              role: result[i].role,
              content: result[i].content
            }
          ]
        });
      }
    }
    if (dialogues.length <= 6) {
      cb({status: "OK", data: dialogues});
    }
    else {
      cb({status: "OK", data: shuffle(dialogues).slice(0, 6)});
    }
    
  });
}

function getDialogues(selectedBots, cb) {
  var bot_ids = [];
  if (selectedBots.length > 0) {
    for (var i in selectedBots) {
      bot_ids.push(selectedBots[i].value);
    }
    getDialoguesByIds(bot_ids, cb);
  }
  else {
    getRandomDialogues(cb);
  }
}

async function getDialoguesByIds(ids, cb) {
  var sql = "SELECT * FROM dialogues WHERE bot_id IN (?)";
  con.query(sql, [ids], function (err, result) {
    if (err) {
      console.log(err);
      cb({status: "NOK", error: err.message});
    }
    var dialogues = [];
    for (var i in result) {
      var existing_dialogue_idx = dialogues.findIndex(dialogue => dialogue.id == result[i].bot_id);
      if (existing_dialogue_idx != -1) {
        dialogues[existing_dialogue_idx].dialogue.push(
            {
              role: result[i].role,
              content: result[i].content
            }
        );
      }
      else {
        dialogues.push({
          id: result[i].bot_id,
          author: result[i].author,
          dialogue: [
            {
              role: result[i].role,
              content: result[i].content
            }
          ]
        });
      }
    }
    cb({status: "OK", data: dialogues});
  });
}

async function getAllDialogues(cb) {
  var sql = "SELECT * FROM dialogues";
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      cb({status: "NOK", error: err.message});
    }
    var dialogues = [];
    for (var i in result) {
      var existing_dialogue_idx = dialogues.findIndex(dialogue => dialogue.id == result[i].bot_id);
      if (existing_dialogue_idx != -1) {
        dialogues[existing_dialogue_idx].dialogue.push(
            {
              role: result[i].role,
              content: result[i].content
            }
        );
      }
      else {
        dialogues.push({
          id: result[i].bot_id,
          author: result[i].author,
          dialogue: [
            {
              role: result[i].role,
              content: result[i].content
            }
          ]
        });
      }
    }
    cb({status: "OK", data: dialogues});
  });
}

async function getBotAnswer(dialogue, bot, insertId, requests_completed) {
  var messages = await getAnswer(dialogue)
  var comment = {
    author: bot.author,
    user_id: bot.id,
    parent_id: insertId,
    timeline: "user"
  }
  comment.content = messages[messages.length - 1].content;

  var sql = "INSERT INTO posts (content, timeline, user_id, parent_id, author) VALUES (?, ?, ?, ?, ?)";
  await con2.query(sql, [comment.content, comment.timeline, comment.user_id, comment.parent_id, comment.author]);
  requests_completed++;
  return requests_completed;
}

module.exports = {
    getRandomDialogues,
    getDialogues,
    getDialoguesByIds,
    getAllDialogues,
    getBotAnswer,
    default: {
        getRandomDialogues,
        getDialogues,
        getDialoguesByIds,
        getAllDialogues,
        getBotAnswer
    }
};