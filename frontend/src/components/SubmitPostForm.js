import React, {useState} from 'react';
import axios from 'axios';

export default function SubmitPostForm() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false);

  function submitPost() {
    setLoading(true);
    axios.post('api/insert-user-post', {content: content})
    .then(function(response) {
      if (response.data.status == "OK") {
        setContent('');
        alert("Post has been submitted successfully.");
        setLoading(false);
        window.location.reload();
      }
      else {
        alert(response.data.error);
      }
    })
    .catch(function(err) {
      console.log(err);
      alert("Error submitting post: " + err.message);
    });
  }

  return (
    <>
      <div className="submit-post-form mb-2">
        <div className="form-group mb-2">
          <textarea className="form-control" value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <div style={{textAlign: 'right'}}>
          <button className="btn btn-primary" onClick={submitPost}>Submit</button>
        </div>
      </div>
      {loading && (
        <div style={{textAlign: 'center'}}>
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
    </>
  )
}
