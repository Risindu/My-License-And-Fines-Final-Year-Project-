import './Finetable.scss';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

function createData(Description, details ) {
  return { Description, details };
}

const rows = [
  createData('User ID', 513820),
  createData('Full Name', 'NLC Jayashan'),
  createData('License ID', 657895),
  createData('National ID', 200033366),
  createData('Vehicle Number', 'BAC-1234'),
  createData('Offense', 'High Speed Driving'),
  createData('Issue Date', '2021-09-23'),
  createData('Expire Date', '2022-09-23'),
  createData('Amount', 5000),
  createData('Status', '', 'positive'), 
];

const Finetable = () => {
  return (
    <div className='finetable'>
      <div className="search">
        <input type="text" placeholder='search...' />
        <SearchOutlinedIcon />
      </div>

      <div className="image-container">
        <img src="https://cdn.pixabay.com/photo/2024/08/30/10/15/woman-9009013_1280.png" alt="Table Image" className="table-image" />
      </div>

      <div className="tableContainer">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 65 }} aria-label="simple table">
            <TableHead>
              
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.Description}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.Description}
                  </TableCell>
                  <TableCell align="left">
                    {row.Description === 'Status' ? (
                      <div className={`Status ${row.status}`}>
                        {row.status === 'positive' ? 'Paid' : 'Not Paid'}
                      </div>) : (row.details)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default Finetable;
