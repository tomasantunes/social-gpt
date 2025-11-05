import React, {useEffect, useState} from 'react';
import Navbar from './Navbar';
import SubmitPostForm from './SubmitPostForm';
import axios from 'axios';
import config from '../config.json';

export default function UserTimeline() {
  const [posts, setPosts] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [replyParentId, setReplyParentId] = useState(null);
  const [loading, setLoading] = useState(false);

  function loadPosts() {
    axios.get(config.BASE_URL + '/api/get-user-timeline')
    .then(function(response) {
      if (response.data.status == "OK") {
        setPosts(response.data.data);
      }
      else {
        alert(response.data.error);
      }
    })
    .catch(function(err) {
      console.log(err);
      alert("Error loading posts: " + err.message);
    });
  }

  function getComments(post) {
    if (post.comments.length > 0) {
      return post.comments.map((comment, index) => (
        <div key={comment.id}>
          <div className="post-comment" >
            <p><i>Replying to {comment.parent_author}</i></p>
            <p><b>{comment.author}</b></p>
            <small>{post.created_at}</small><br/>
            {comment.content}
            <div style={{textAlign: 'right'}}>
              <button className="btn btn-primary btn-sm" onClick={(e) => { openReplyBox(comment.id) }}>Reply</button>
            </div>
          </div>
          {getComments(comment)}
        </div>
      ));
    }
    else {
      return '';
    }
  }

  function getCommentsToExport(post) {
    if (post.comments.length > 0) {
      return post.comments.map((comment, index) => {
        return `
          <p><i>Replying to ${comment.parent_author}</i></p>
          <p><b>${comment.author}</b></p>
          <small>${post.created_at}</small><br/>
          ${comment.content}
          <hr>
        `;
      });
    }
    else {
      return '';
    }
  }

  function openReplyBox(parentId) {
    setReplyParentId(parentId);
    var modal = bootstrap.Modal.getOrCreateInstance(document.querySelector('.replyModal'))
    modal.show();
  }

  function closeReplyBox() {
    setReplyParentId(null);
    setReplyText('');
    var modal = bootstrap.Modal.getOrCreateInstance(document.querySelector('.replyModal'))
    modal.hide();
  }

  function submitReply(e) {
    e.preventDefault();
    setLoading(true);
    axios.post(config.BASE_URL + '/api/insert-reply', {content: replyText, parent_id: replyParentId})
    .then(function(response) {
      if (response.data.status == "OK") {
        setLoading(false);
        alert("Reply has been submitted successfully.");
        closeReplyBox();
        loadPosts();
      }
      else {
        setLoading(false);
        alert(response.data.error);
      }
    })
    .catch(function(err) {
      setLoading(false);
      console.log(err);
      alert("Error submitting reply: " + err.message);
    });
  }

  function exportToBlog(post) {
    var title = "AI Talk - #" + post.id;
    var content = "";
    var tags = ""
    var summary = "AI Talk - #" + post.id;

    content += `
      <p><b>${post.author}</b></p>
      <small>${post.created_at}</small><br/>
      ${post.content}
      <hr>
    `;

    var comments = getCommentsToExport(post);
    content += comments;


    axios.post(config.BASE_URL + "/blog/add-post", {
      title,
      content,
      tags, 
      summary
    })
    .then(function(response) {
      if (response.data.status == "OK") {
        alert("Post has been exported successfully.")
      }
      else {
        alert("There was an error exporting the post.");
      }
    })
    .catch(function(err) {
      alert("Connection error.");
    })
  }

  useEffect(() => {
    loadPosts();
  }, []);
  return (
    <>
      <Navbar />
      <div className="small-container">
        <h3>User Timeline</h3>
        <SubmitPostForm />
        <div className="posts">
          {posts.map((post, index) => (
            <>
              <div className="post" key={post.id}>
                <div className="post-content">
                  <p><b>{post.author}</b></p>
                  <small>{post.created_at}</small><br/>
                  {post.content}
                  <div style={{textAlign: 'right'}}>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => exportToBlog(post)}>Export To Blog</button>
                    <button className="btn btn-primary btn-sm" onClick={(e) => { openReplyBox(post.id) }}>Reply</button>
                  </div>
                </div>
                <div className="post-comments">
                  {getComments(post)}
                </div>
              </div>
              <hr />
            </>
          ))}
        </div>
      </div>
      <div class="modal replyModal" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Reply</h5>
              <button type="button" class="btn-close" onClick={closeReplyBox} aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <form onSubmit={submitReply}>
                <div className="form-group py-2">
                  <div>
                    <textarea className="form-control" value={replyText} onChange={e => setReplyText(e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                    <div style={{textAlign: "right"}}>
                        {loading && (
                          <div style={{textAlign: 'center'}}>
                            <div class="spinner-border" role="status">
                              <span class="visually-hidden">Loading...</span>
                            </div>
                          </div>
                        )}
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
