async function getParentPost(parent_id) {
  var sql = "SELECT * FROM posts WHERE id = ?";
  var [rows, fields] = await con2.query(sql, [parent_id]);
  return rows[0];
}

async function getAllParentPosts(parent_id) {
  var posts = [];
  var parent_post = await getParentPost(parent_id);
  posts.push(parent_post);
  if (parent_post.parent_id != 0) {
    posts = posts.concat(await getAllParentPosts(parent_post.parent_id));
  }
  return posts;
}

module.exports = {
    getAllParentPosts,
    getParentPost,
    default: {
        getAllParentPosts,
        getParentPost
    }
};