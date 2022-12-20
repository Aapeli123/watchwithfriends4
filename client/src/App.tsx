import './App.css'
import Room from './pages/Room/Room'
import SideBar from './ui/SideBar'
import TopBar from './ui/TopBar'

function App(): JSX.Element {
  return (
    <div className="App">
      <TopBar />
      <div className='main-content'>
        <SideBar />
        <div className='app-data'>
          <Room />
        </div>
      </div>
      
    </div>
  )
}

export default App
