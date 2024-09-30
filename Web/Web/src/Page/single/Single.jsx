import './Single.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Profile from '../../components/profile/Profile';
import Edit from '../../components/edit/Edit';


const Single = () => {
  return (
    <div className='single'>
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <Profile />
        <Edit/>
        
        {/*<div className="content">
          
          

         
          <div className="right">
            <h1 className='title'>Edit Profile</h1>
            <div className="editForm">
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
              <Button variant="contained" color="success" >
                Update Info
              </Button>
            </div>
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default Single;
