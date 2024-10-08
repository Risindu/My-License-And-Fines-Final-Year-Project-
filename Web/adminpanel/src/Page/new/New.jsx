import './New.scss';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import Edit from '../../components/edit/Edit';

const New = () => {
  return (
    <div className='new'>
      <Sidebar/>
      <div className="new__Container">
        <Navbar/>
      </div>
      <div className="new__edit">
          <Edit/>
      </div>
    </div>
  )
}

export default New