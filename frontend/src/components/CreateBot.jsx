import React, {useEffect, useState} from 'react';
import Navbar from './Navbar';
import axios from 'axios';
import config from '../config.json';
import CreateBotForm from './CreateBotForm';

export default function CreateBot() {
  const [bots, setBots] = useState([]);

  function loadBots() {
    axios.get(config.BASE_URL + '/api/get-bots')
    .then(function(response) {
      if (response.data.status == "OK") {
        setBots(response.data.data);
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
      <Navbar />
      <div className="small-container">
        <h3>Create Bot</h3>
        <CreateBotForm />
        <div className="bots">
          {bots.map((bot, index) => (
            <>
              <div className="bot" key={bot.id}>
                <p><b>{bot.author}</b></p>
                {bot.dialogue.map((message, index) => (
                  <p key={index}><b>{index+1}.</b> {message.content}</p>
                ))}
              </div>
              <hr />
            </>
          ))}
        </div>
      </div>
    </>
  )
}
