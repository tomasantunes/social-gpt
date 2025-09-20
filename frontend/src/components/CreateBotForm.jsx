import React, {useState} from 'react';
import axios from 'axios';

export default function CreateBotForm() {
  const [prompt, setPrompt] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  function submitBot() {
    setLoading(true);
    axios.post('api/create-bot', {prompt, author})
    .then(function(response) {
      if (response.data.status == "OK") {
        setPrompt('');
        setAuthor('');
        alert("Bot has been created successfully.");
        setLoading(false);
        window.location.reload();
      }
      else {
        setLoading(false);
        alert(response.data.error);
      }
    })
    .catch(function(err) {
      console.log(err);
      alert("Error creating bot: " + err.message);
    });
  }

  return (
    <>
      <div className="create-bot-form mb-2">
        <div className="form-group mb-2">
          <label>Bot Name</label>
          <input type="text" className="form-control" value={author} onChange={e => setAuthor(e.target.value)} />
        </div>
        <div className="form-group mb-2">
          <label>Prompt</label>
          <textarea className="form-control" value={prompt} onChange={e => setPrompt(e.target.value)} />
        </div>
        <div style={{textAlign: 'right'}}>
          <button className="btn btn-primary" onClick={submitBot}>Submit</button>
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
