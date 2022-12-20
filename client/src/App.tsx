import {createBrowserRouter, createRoutesFromElements, Route, RouterProvider} from 'react-router-dom'
import './App.css'
import Home from './pages/Home/Home'
import Room from './pages/Room/Room'
import SideBar from './ui/SideBar'
import TopBar from './ui/TopBar'

const router = createBrowserRouter([
  {
    path: "/room",
    element: <Room />,
  },
  {
    path: "/",
    element: <Home />,
  },
]);

function App(): JSX.Element {
  return (
    <div className="App">
      <TopBar />
      <div className='main-content'>
        <SideBar />
        <div className='app-data'>
          <RouterProvider router={router} />
        </div>
      </div>
      
    </div>
  )
}

export default App
