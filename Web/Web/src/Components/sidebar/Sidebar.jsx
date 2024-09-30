import './Sidebar.scss';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import HowToRegOutlinedIcon from '@mui/icons-material/HowToRegOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';


const Sidebar = () => {
  return (
    <div className='sidebar'>
        <div className="top">
            <span className='logo'>License Pal </span>
        </div>
        <hr/>
        <div className="center">
            <ul>
                <li><HomeOutlinedIcon className="icon"/>
                  <span>Home</span></li>
                <li><AttachMoneyOutlinedIcon className="icon"/>
                  <span>Fines</span></li>
                <li><HowToRegOutlinedIcon className="icon"/>
                  <span>Register User</span></li>
                <li><AccountCircleOutlinedIcon className="icon"/>
                  <span>Profile</span></li>
                <li><ExitToAppOutlinedIcon className="icon"/>
                  <span>Log Out</span></li>
            </ul>
        </div>
        <div className="bottom">
        <div className="coloroption"></div>
        <div className="coloroption"></div>
        
        </div>
    </div>
  )
}

export default Sidebar