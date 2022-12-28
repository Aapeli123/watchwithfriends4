import github from './github.svg';
import './Info.css';
const Info = () => {
  return (
    <div className="info">
      <h1>Info and contributors:</h1>
      <h4>
        Code written by Aapo H.{' '}
        <button onClick={() => location.assign('mailto:aaposharju@gmail.com')}>
          <span className="material-icons">mail</span>
        </button>
        <button onClick={() => location.assign('https://github.com/Aapeli123')}>
          <img src={github}></img>
        </button>
      </h4>
      <h4>
        UI design by Aarni S.{' '}
        <button
          onClick={() => location.assign('mailto:aarni.salmenpera@gmail.com')}
        >
          <span className="material-icons">mail</span>
        </button>
      </h4>
      <h2>Open source code:</h2>
      <p>
        All the code that is needed to run this website is open source and can
        be found in{' '}
        <a href="https://github.com/Aapeli123/watchwithfriends4">github</a>. If
        you see something you want to change, just open an issue or a pull
        request.
      </p>
    </div>
  );
};
export default Info;
