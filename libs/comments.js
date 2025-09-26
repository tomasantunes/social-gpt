// recursive function to get all comments of a post and include the comments of those comments
function getComments(posts, post_id) {
  var comments = [];
  for (var i in posts) {
    var post = posts[i];
    if (post.parent_id == post_id) {
      post.comments = getComments(posts, post.id);
      comments.push(post);
    }
  }
  comments.sort(function(a, b) {
    return b.id - a.id;
  });
  return comments;
}

module.exports = {
    getComments,
    default: {
        getComments
    }
};