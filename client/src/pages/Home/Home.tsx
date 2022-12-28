import './Home.css';
import { ServerConn } from '../../lib/conn';

const Home = (props: { conn: ServerConn }) => {
  return (
    <div className="home">
      <h1>Welcome to watch with friends!</h1>
      <p>
        Watch youtube, twitch and more with your friends. Just create a new room
        from the sidebar on the left or join a room with the room code.
      </p>
    </div>
  );
};

export default Home;
