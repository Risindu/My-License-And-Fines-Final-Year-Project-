import './Signupform.scss'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const Signupform = () => {
  return (
    <div className='signupform'>
        <h1 className='signupform__title'>Welcome to License Pal</h1>
        <div className="signupform__form">
        <TextField className='field'
          label="Division Name"
          margin="normal"
        />
        <TextField className='field'
          label="Division ID"
          margin="normal"
        />
        <TextField className='field'
          label="Email"
          margin="normal"
        />
        <TextField className='field'
          label="Location"
          margin="normal"
        />
        <TextField className='field'
          label="Phone Number"
          margin="normal"
        />
        <TextField className='field'
          label="Password"
          type="password"
          margin="normal"
        />
        <Button className="signup__button" variant="contained" color="success">
          Signup
        </Button>
      </div>
      </div>
  )
}

export default Signupform