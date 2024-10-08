import "./Chart.scss"
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  {
    name: 'January',
    Total: 4000, //amount of fines
  
  },
  {
    name: 'February',
    Total: 300,
    
  },
  {
    name: 'March',
    Total: 1100,
    
  },
  {
    name: 'April',
    Total: 1100,
    
  },
  {
    name: 'May',
    Total: 1100,
    
  },
  {
    name: 'June',
    Total: 1100,
    
  },
  {
    name: 'July',
    Total: 1100,
    
  },
  {
    name: 'August',
    Total: 1100,
    
  },
  {
    name: 'September',
    Total: 1100,
    
  },
  {
    name: 'October',
    Total: 1100,
    
  },
  {
    name: 'November',
    Total: 1100,
    
  },
  {
    name: 'December',
    Total: 1100,
    
  },
  
];
const Chart = () => {
  return (
    <div className="chart">
      <div className="chart__title">Year</div>
    <ResponsiveContainer width="100%" height={300}>
    <AreaChart width={730} height={250} data={data}
  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
  <defs>
    <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
      <stop offset="5%" stopColor="lightgreen" stopOpacity={0.8}/>
      <stop offset="95%" stopColor="lightgreen" stopOpacity={0}/>
    </linearGradient>
    
  </defs>
  <XAxis dataKey="name" />

  <CartesianGrid strokeDasharray="3 3" />
  <Tooltip />
  <Area type="monotone" dataKey="Total" stroke="lightgreen" fillOpacity={1} fill="url(#total)" />

</AreaChart>
  </ResponsiveContainer></div>
  )
}

export default Chart