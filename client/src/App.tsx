import { BrowserRouter, createBrowserRouter, Outlet, Route, RouterProvider, Routes} from 'react-router-dom'
import './App.css'
import connect from './lib/conn'
import Home from './pages/Home/Home'
import Info from './pages/Info/Info'
import Room from './pages/Room/Room'
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
  
  return (
  <>
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainLayout />}>
              <Route path="/room" element={<Room />} />
              <Route path="/info" element={<Info />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/" element={<Home />} />
            </Route>
        </Routes>    
      </div>
    </BrowserRouter>
  </>
  )
}

export default App
