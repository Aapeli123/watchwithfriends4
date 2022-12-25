import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter, createBrowserRouter, Outlet, Route, RouterProvider, Routes} from 'react-router-dom'
import './App.css'
import connect, { ServerConn } from './lib/conn'
import Home from './pages/Home/Home'
import Info from './pages/Info/Info'
import Room from './pages/Room/Room'
import RoomCode from './pages/RoomCodeEntry/RoomCode'
import Settings from './pages/Settings/Settings'
import { setUn } from './store/prefs'
import {store} from './store/store'
import SideBar from './ui/SideBar'
import TopBar from './ui/TopBar'



const MainLayout = (props: {conn: ServerConn}) => {
  return(
  <>
    <TopBar />
    <div className='main-content'>
      <SideBar conn={props.conn}/>
      <div className='app-data'>
        <Outlet />
      </div>
    </div>
  </>
  )
}

function App(): JSX.Element {
  const [connection, setConnection] = useState<ServerConn | undefined>();
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    const hasUn = Cookies.get("username") !== undefined;
    console.log(hasUn);

    if(!hasUn) {
      while(1) {
        const username = prompt("Username?");
        if(username === null) {
          continue;
        }
        if (username.trimStart().trimEnd() !== "") {
          Cookies.set("username", username);
          break;
        }
      }
    }

    if (connected) {
      console.log("Already connected.")
      return;
    }
    const connectToServer = async () => {
      const conn = await connect("ws://localhost:8080");
      console.log("Connected...");
      setConnection(conn);
      setConnected(true);

    }
    connectToServer();
  }, [])
  return connected ? (
  <>
    <BrowserRouter>
      <div className="App">
      <Provider store={store}>
        <Routes>
          <Route path="/" element={<MainLayout conn={connection as ServerConn} />}>
              <Route path="/joinroom" element={<RoomCode conn={connection as ServerConn} />} />
              <Route path="/room/:code" element={<Room conn={connection as ServerConn} />} />
              <Route path="/info" element={<Info />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Home conn={connection as ServerConn}/>} />
            </Route>
        </Routes>    
      </Provider>
      </div>
    </BrowserRouter>
  </>
  ) : <div className="App">
    <h1>Connecting..</h1>
  </div>
}

export default App
