import React, {useEffect, useState} from 'react';
import Navbar from './Navbar';
import SubmitPostForm from './SubmitPostForm';
import axios from 'axios';
import config from '../config.json';

export default function UserTimeline() {
  const [posts, setPosts] = useState([]);

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
                  {post.content}
                </div>
                <div className="post-comments">
                  {post.comments.map((comment, index) => (
                    <div className="post-comment" key={comment.id}>
                      <p><b>{comment.author}</b></p>
                      {comment.content}
                    </div>
                  ))}
                </div>
              </div>
              <hr />
            </>
          ))}
        </div>
      </div>
    </>
  )
}
