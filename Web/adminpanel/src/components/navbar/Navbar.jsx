import React, { useState } from 'react';
import './Navbar.scss';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';

const Navbar = () => {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className='navbar'>
      <div className="wrapper">
        <div className="search">
          <input type="text" placeholder='search...' />
          <SearchOutlinedIcon />
        </div>
        
        <div className="text1">Homagama Police Division</div>
        <div className="items">
          <div className="item">
            <LanguageOutlinedIcon className='icon' />
            English
          </div>

          <div className="item" onClick={toggleDropdown}>
            <NotificationsNoneOutlinedIcon className='icon' />
            <div className="counter">1</div>

            {showDropdown && (
              <div className="notification-dropdown">
                <ul>
                  <li>New Paid Fines</li>
                  <li>New Issued Fines</li>
                  <li>New Message</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
