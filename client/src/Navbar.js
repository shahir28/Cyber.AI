import React from 'react';
import './Navbar.css';

function Navbar() {
  return (
    <div className="navbar">
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="user-profile">
        <img src="path_to_avatar_image" alt="User Avatar" />
      </div>
    </div>
  );
}

export default Navbar;