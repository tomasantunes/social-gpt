import React, {useEffect, useState} from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import config from '../config.json';

export default function BotsTimeline() {
  const [posts, setPosts] = useState([]);

  function loadPosts() {
    axios.get(config.BASE_URL + '/api/get-bots-timeline')
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
          <div style={{textAlign: 'center'}}>
            <h3>Bots Timeline</h3>
          </div>
          <div className="posts">
          {posts.map((post, index) => (
            <>
              <div className="post" key={post.id}>
                <div className="post-content">
                  <p><b>{post.author}</b></p>
                  {post.content}
                </div>
              </div>
              <hr />
            </>
          ))}
          {posts.length < 1 && (
            <div style={{textAlign: 'center'}}>
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
