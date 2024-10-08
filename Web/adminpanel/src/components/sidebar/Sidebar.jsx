import './Sidebar.scss';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
import { Link } from 'react-router-dom';


const Sidebar = () => {
  return (
    <div className='sidebar'>
        <div className="top">
          <Link to="/home" style={{textDecoration:"none"}}>
            <span className='logo'>License Pal </span>
          </Link>
        </div>
        <hr/>
        <div className="center">
            <ul>
                <Link to="/home" style={{textDecoration:"none"}}>
                  <li><HomeOutlinedIcon className="icon"/>
                    <span>Home</span></li>
                  </Link>
                <Link to="/users" style={{textDecoration:"none"}}>
                  <li><AttachMoneyOutlinedIcon className="icon"/>
                    <span>Fines</span></li>
                </Link>
                <Link to="/users/123" style={{textDecoration:"none"}}>
                  <li><AccountCircleOutlinedIcon className="icon"/>
                    <span>Profile</span></li>
                </Link>
                <Link to="/" style={{textDecoration:"none"}}>
                  <li><ExitToAppOutlinedIcon className="icon"/>
                    <span>Log Out</span></li>
                    </Link>
            </ul>
        </div>
        
    </div>
  )
}

export default Sidebar