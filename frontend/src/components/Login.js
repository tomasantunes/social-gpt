import React, {useState} from 'react';
import axios from 'axios';
import config from '../config.json';
import {useNavigate} from 'react-router-dom';

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  function changeUser(event) {
    setUser(event.target.value);
  }

  function changePass(event) {
    setPass(event.target.value);
  }

  function requestLogin() {
    axios.post(config.BASE_URL + "/api/check-login", {user, pass})
    .then(res => {
      if (res.data.status == "OK") {
        console.log(res.data.data);
        navigate("/user-timeline");
      }
      else {
        alert(res.data.error);
      }
    })
    .catch(err => {
      alert(err.message);
    });
  }

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      requestLogin();
    }
  };

  return (
    <div className="login-box">
      <div style={{textAlign: "center"}}>
        <h3>Login</h3>
      </div>
      <div className="form-group">
          <label>Username</label>
          <input type="text" className="form-control" value={user} onChange={changeUser} onKeyDown={handleKeyDown} />
      </div>
      <div className="form-group mb-4">
          <label>Password</label>
          <input type="password" className="form-control" value={pass} onChange={changePass} onKeyDown={handleKeyDown} />
      </div>
      <div style={{textAlign: "right"}}>
          <button className="btn btn-primary" onClick={requestLogin}>Login</button>
      </div>
    </div>
  )
}
