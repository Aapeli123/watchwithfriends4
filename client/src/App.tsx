import { useEffect, useState } from 'react'
import { BrowserRouter, createBrowserRouter, Outlet, Route, RouterProvider, Routes} from 'react-router-dom'
import './App.css'
import connect, { ServerConn } from './lib/conn'
import Home from './pages/Home/Home'
import Info from './pages/Info/Info'
import Room from './pages/Room/Room'
import RoomCode from './pages/RoomCodeEntry/RoomCode'
import Settings from './pages/Settings/Settings'
import SideBar from './ui/SideBar'
import TopBar from './ui/TopBar'



const MainLayout = () => {
  return(
  <>
    <TopBar />
    <div className='main-content'>
      <SideBar />
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
        <Routes>
          <Route path="/" element={<MainLayout />}>
              <Route path="/joinroom" element={<RoomCode conn={connection as ServerConn} />} />
              <Route path="/room/:code" element={<Room conn={connection as ServerConn} />} />
              <Route path="/info" element={<Info />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Home conn={connection as ServerConn}/>} />
            </Route>
        </Routes>    
      </div>
    </BrowserRouter>
  </>
  ) : <div className="App">
    <h1>Loading..</h1>
  </div>
}

export default App
