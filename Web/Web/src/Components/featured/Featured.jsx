import "./Featured.scss"
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CircularProgressbar } from "react-circular-progressbar";
import 'react-circular-progressbar/dist/styles.css';
const Featured = () => {
  return (
    <div className="featured">
      <div className="top">
       < h1 className="title">Monthly Comparison</h1>
       <MoreVertIcon fontSize="small"/>
      </div>
      <div className="bottom">
        <div className="featuredChart">
          <CircularProgressbar value={70} text="70%" strokeWidth={5}/>
        </div>
        <div className="featuredInfo">
          <div className="month1 january">
              <div className="colorBox"></div>
                <p>January</p>
              
          </div>
          <div className="month2 february">
              <div className="colorBox"></div>
                <p>February</p>
              
            </div>

      </div>
    </div>
    </div>
  )
}

export default Featured