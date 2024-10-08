import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import './List.scss';
import Finetable from '../../components/finetable/Finetable';

const List = () => {
  return (
    <div className='list'>
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <Finetable/>
      </div>
    </div>
  )
}

export default List