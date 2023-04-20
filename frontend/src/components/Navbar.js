import React from 'react';
import {NavLink} from 'react-router-dom';

export default function Navbar() {
  return (
    <nav class="navbar navbar-expand-lg bg-light">
      <div class="container-fluid">
          <a class="navbar-brand" href="#">SocialGPT</a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
              <li class="nav-item">
                <NavLink to="/user-timeline" className="nav-link">User Timeline</NavLink>
              </li>
              <li class="nav-item">
                <NavLink to="/bots-timeline" className="nav-link">Bots Timeline</NavLink>
              </li>
            </ul>
          </div>
      </div>
    </nav>
  )
}
