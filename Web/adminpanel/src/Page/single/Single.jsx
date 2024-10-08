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
        <div className="containerProfile">
        <Profile />
        </div>
        
        {/* <Edit/> */}
        
      </div>
    </div>
  );
};

export default Single;
