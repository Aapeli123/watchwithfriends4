import "./Home.css"
import {ServerConn} from "../../lib/conn"

const Home = (props: {conn: ServerConn}) => {
    return <div className="home">
        <h1>Placeholder text</h1>
        <p>This is the homescreen, it will hopefully include something interesting</p>
    </div>
}

export default Home;