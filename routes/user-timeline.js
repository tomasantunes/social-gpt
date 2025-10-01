var express = require('express');
var router = express.Router();
var {getMySQLConnections} = require("../libs/database");
var {getAllDialogues, getDialogues, getBotAsnswer} = require("../libs/dialogues");
var {getParentPost, getAllParentPosts} = require("../libs/posts");
var {getComments} = require('../libs/comments');

var {con, con2} = getMySQLConnections();

var requests_completed = 0;
var total_requests = 0;

router.get('/api/get-user-timeline', (req, res) => {
  if (!req.session.isLoggedIn) {
    res.json({status: "NOK", error: "Invalid Authorization."});
    return;
  }
  var sql = "SELECT p1.*, p2.author AS parent_author FROM posts p1 LEFT JOIN posts p2 ON p1.parent_id = p2.id WHERE p1.timeline = 'user' ";
  con.query(sql, function (err, result) {
    if (err) {
      console.log(err);
      res.json({status: "NOK", error: err.message});
    }
    var posts = [];
    for (var i in result) {
      var post = result[i];
      if (post.parent_id == 0) {
        post.comments = getComments(result, post.id);
        posts.push(post);
      }
    }
    posts.sort(function(a, b) {
      return b.id - a.id;
    });
    res.json({status: "OK", data: posts});
  });
});

router.post("/api/insert-reply", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.json({status: "NOK", error: "Invalid Authorization."});
    return;
  }
  var content = req.body.content;
  var parent_id = req.body.parent_id;
  var sql = "INSERT INTO posts (content, timeline, user_id, parent_id, author) VALUES (?, 'user', 1, ?, 'User')";
  con.query(sql, [content, parent_id], async function (err, result) {
    if (err) {
      console.log(err);
      res.json({status: "NOK", error: err.message});
    }
    var parent_post1 = await getParentPost(parent_id);
    var parent_posts = await getAllParentPosts(parent_id);
    parent_posts.reverse();
    getAllDialogues(async function(response) {
      var bot = response.data.find(bot => bot.id == parent_post1.user_id);
      if (bot) {
        var dialogue = bot.dialogue;
        for (var i in parent_posts) {
          if (parent_posts[i].user_id != 1) {
            dialogue.push({"role": "assistant", "content": parent_posts[i].content});
          }
          else {
            dialogue.push({"role": "user", "content": parent_posts[i].content});
          }
          dialogue.push({"role": "user", "content": content});
          
        }
        await getBotAnswer(dialogue, bot, result.insertId);
        res.json({status: "OK", data: "Reply has been submitted successfully."});
      }
      else {
        res.json({status: "OK", data: "Reply has been submitted successfully."});
      }
    });
    
  });
});

router.post("/api/insert-user-post", (req, res) => {
    if (!req.session.isLoggedIn) {
      res.json({status: "NOK", error: "Invalid Authorization."});
      return;
    }
    var content = req.body.content;
    var selectedBots = req.body.selectedBots;

    var sql = "INSERT INTO posts (content, timeline, user_id, parent_id, author) VALUES (?, 'user', 1, 0, 'User')";
    con.query(sql, [content], async function (err, result) {
      if (err) {
        console.log(err);
        res.json({status: "NOK", error: err.message});
      }

      getDialogues(selectedBots, async function(response) {
        if (response.status == "OK") {
          var bots = response.data;
          requests_completed = 0;
          total_requests = bots.length;

          for (var i in bots) {
            currentDialogue = bots[i].dialogue;
            currentDialogue.push({"role": "user", "content": content});
            requests_completed = await getBotAnswer(currentDialogue, bots[i], result.insertId, requests_completed);
          }

          while (requests_completed < total_requests) {
            await new Promise(r => setTimeout(r, 500));
          }
          res.json({status: "OK", data: "Post has been submitted successfully."});
        }
        else {
          res.json({status: "NOK", error: response.error});
        }
      })
    });
});

module.exports = router;