import "./Widgets.scss";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import OutboxOutlinedIcon from '@mui/icons-material/OutboxOutlined';
import CallReceivedOutlinedIcon from '@mui/icons-material/CallReceivedOutlined';
import CurrencyExchangeOutlinedIcon from '@mui/icons-material/CurrencyExchangeOutlined';

const Widgets = ({ type }) => {
    
    let data = {
        title: "UNKNOWN",
        link: "No link available",
        icon: <PersonOutlineOutlinedIcon className="icon" />
    };

    const amount = 100;
    const no = 10;

    switch (type) {
        case "fines":
            data = {
                title: "FINES ISSUED",
                link: "See all issued fines",
                icon: <OutboxOutlinedIcon className="icon" 
                        style={{color:"crimson",
                            backgroundColor: "rgba(255, 0, 0, 0.2)",
                        }}/>
            };
            break;
        case "paid":
            data = {
                title: "PAID FINES",
                link: "See all paid fines",
                icon: <CallReceivedOutlinedIcon className="icon" 
                        style={{color:"green",
                        backgroundColor: "rgba(0, 128, 0, 0.2)",
                }}
                />
            };
            break;
        case "remain":
            data = {
                title: "REMAINING FINES",
                link: "See all remaining fines",
                icon: <CurrencyExchangeOutlinedIcon className="icon" 
                    style={{color:"purple",
                    backgroundColor: "rgba(128, 0, 128, 0.2)",
            }}/>
            };
            break;
        default:
            break;
    }

    return (
        <div className="widget">
            <div className="left">
                <span className="title">{data.title}</span>
                <span className="counter">{amount}</span>
                <span className="link">{data.link}</span>
            </div>
            <div className="right">
                <div className="percentage positive">
                    <KeyboardArrowUpIcon />
                    {no}%
                </div>
                {data.icon}
            </div>
        </div>
    );
}

export default Widgets;
