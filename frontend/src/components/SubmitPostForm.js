import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Select from 'react-select';
import config from '../config';

export default function SubmitPostForm() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false);
  const [selectBots, setSelectBots] = useState([]);
  const [selectedBots, setSelectedBots] = useState([]);

  function submitPost() {
    setLoading(true);
    axios.post(config.BASE_URL + '/api/insert-user-post', {content: content, selectedBots: selectedBots})
    .then(function(response) {
      if (response.data.status == "OK") {
        setContent('');
        alert("Post has been submitted successfully.");
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
      setLoading(false);
      alert("Error submitting post: " + err.message);
    });
  }

  function changeSelectedBots(selected) {
    setSelectedBots(selected);
  }

  function loadBots() {
    axios.get(config.BASE_URL + '/api/get-bots')
    .then(function(response) {
      if (response.data.status == "OK") {
        var bots = response.data.data;
        var select_bots = [];
        for (var i in bots) {
          select_bots.push({label: bots[i].author, value: bots[i].id});
        }
        setSelectBots(select_bots);
      }
      else {
        alert(response.data.error);
      }
    })
    .catch(function(err) {
      console.log(err);
      alert("Error loading bots: " + err.message);
    });
  }

  useEffect(() => {
    loadBots();
  }, []);

  return (
    <>
      <div className="submit-post-form mb-2">
        <div className="form-group mb-2">
          <textarea className="form-control" value={content} onChange={e => setContent(e.target.value)} />
        </div>
        <div style={{textAlign: 'right'}}>
          <div className="my-2">
            <Select options={selectBots} isMulti value={selectedBots} placeholder="Select Bots" onChange={changeSelectedBots} />
          </div>
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
