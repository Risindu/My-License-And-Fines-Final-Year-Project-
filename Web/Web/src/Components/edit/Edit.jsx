import './Edit.scss';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Edit() {
  return (
    <div className="edit">
      <h1 className="edit__title">Edit Profile</h1>
      <div className="edit__form">
        <TextField
          label="Division Name"
          margin="normal"
        />
        <TextField
          label="Email"
          margin="normal"
        />
        <TextField
          label="Address"
          margin="normal"
        />
        <TextField
          label="Phone Number"
          margin="normal"
        />
        <TextField
          label="Password"
          type="password"
          margin="normal"
        />
        <Button className="edit__button" variant="contained" color="success">
          Update Info
        </Button>
      </div>
    </div>
  );
}

export default Edit;
