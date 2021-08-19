import './index.css'
import { useEffect,useState } from "react";
import { useLocation } from "react-router-dom";
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './componetns/login/Login';
import Topbar from './componetns/topbar/Topbar';
import Home from './pages/home/Home';
import { Profile } from './pages/profile/Profile';
import PrivateRoute from "./componetns/private/PrivateRoute";
import RouterLinks from "./componetns/private/RouterLinks";
import Messenger from "./componetns/messenger/Messenger";
import Error from "./componetns/error/Error";

// SCROLL TO TOP WHILE ROUTING
const ScrollTop = () => {
  
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollTop/>
    <div className="App">
      <Topbar />
      <Switch>
          <PrivateRoute exact path='/' component={Home}/>
          <PrivateRoute exact path='/profile/:id' component={Profile}/>
          <PrivateRoute exact path='/messages/:id?' component={Messenger}/>
          <RouterLinks exact path='/login' component={Login} />
          <Route exact component={Error} />
      </Switch>      
    </div>
    </BrowserRouter>
  );
}

export default App;
