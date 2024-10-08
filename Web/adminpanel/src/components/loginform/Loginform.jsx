import './Loginform.scss'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const Loginform = () => {
  return (
    <div className='loginform'>
        <h1 className='loginform__title'>Welcome to License Pal</h1>
        <div className="loginform__form">
        <TextField className='field'
          label="Division ID"
          margin="normal"
        />
        
        <TextField className='field'
          label="Password"
          type="password"
          margin="normal"
        />
        <Button className="loginform__button" variant="contained" color="success">
          Login
        </Button>
      </div>
      <Link to="/Signupform" style={{textDecoration:"none"}}>
      <div className="q1">Do you want to create new account</div></Link>
    </div>
  )
}

export default Loginform