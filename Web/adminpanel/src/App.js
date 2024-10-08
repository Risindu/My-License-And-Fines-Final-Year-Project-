import Home from './Page/home/Home';
import Login from './Page/login/Login';
import { BrowserRouter, Routes, Route} from "react-router-dom";
import Single from './Page/single/Single';
import New from './Page/new/New';
import List from './Page/list/List';
import Signup from './Page/signup/Signup';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Login/>}/>
            {/* <Route path="login" element={<Login/>}/> */}
            <Route path='users'>
              <Route index element={<List/>}/>
              <Route path=':userID' element={<Single/>}/>
              {/* <Route path='new' element={<New/>}/> */}
            </Route>
            {/* <Route path='products'>
              <Route index element={<List/>}/>
              <Route path=':productID' element={<Single/>}/>
              <Route path='new' element={<New/>}/>
            </Route> */}
            <Route path='home'>
              <Route index element={<Home/>}/>

            </Route>
            <Route path='edit'>
            <Route index element={<New/>}/>
            </Route>
            <Route path='signupform'>
            <Route index element={<Signup/>}/>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
