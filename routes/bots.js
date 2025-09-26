var express = require('express');
var router = express.Router();
var {getMySQLConnections} = require("../libs/database");
var {getAllDialogues} = require("../libs/dialogues");
var {getAnswer} = require("../libs/openai");

var {con, con2} = getMySQLConnections();

router.post("/api/create-bot", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.json({status: "NOK", error: "Invalid Authorization."});
    return;
  }

  var author = req.body.author;
  var prompt = req.body.prompt;

  var sql1 = "SELECT MAX(bot_id) AS max_bot_id FROM dialogues";
  con.query(sql1, function (err, result) {
    if (err) {
      console.log(err);
      res.json({status: "NOK", error: err.message});
      return;
    }
    var max_bot_id = result[0].max_bot_id;
    if (max_bot_id == null) {
      max_bot_id = 1;
    }
    var bot_id = max_bot_id + 1;
    var sql2 = "INSERT INTO dialogues (bot_id, author, content, role) VALUES (?, ?, ?, ?)";
    con.query(sql2, [bot_id, author, prompt, "user"], async function (err, result) {
      if (err) {
        console.log(err);
        res.json({status: "NOK", error: err.message});
        return;
      }

      var messages = [
        {"role": "user", "content": prompt}
      ];

      var messages2 = await getAnswer(messages);
      var sql3 = "INSERT INTO dialogues (bot_id, author, content, role) VALUES (?, ?, ?, ?)";
      con.query(sql3, [bot_id, author, messages2[messages2.length - 1].content, messages2[messages2.length - 1].role], async function (err, result) {
        if (err) {
          console.log(err);
          res.json({status: "NOK", error: err.message});
          return;
        }
        res.json({status: "OK", data: "Bot has been created successfully."});
      });
    });
  });
});

router.get("/api/get-bots-list", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.json({status: "NOK", error: "Invalid Authorization."});
    return;
  }
  getAllDialogues(function(response) {
    if (response.status == "OK") {
      var bot_names = [];
      for (var i in response.data) {
        bot_names.push(response.data[i].author);
      }
      bot_names = bot_names.join("\n");
      res.json({status: "OK", data: bot_names});
    }
    else {
      res.json({status: "NOK", error: response.error});
    }
  });
});

router.get('/api/get-bots', (req, res) => {
  if (!req.session.isLoggedIn) {
    res.json({status: "NOK", error: "Invalid Authorization."});
    return;
  }
  getAllDialogues(function(response) {
    if (response.status == "OK") {
      res.json({status: "OK", data: response.data});
    }
    else {
      res.json({status: "NOK", error: response.error});
    }
  });
});

module.exports = router;