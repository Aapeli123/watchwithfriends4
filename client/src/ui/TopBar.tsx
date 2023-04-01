import './TopBar.css';
import logo from './logo_sm.webp';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setUnSelectorClosable, showUnSelector } from '../store/ui';
const TopBar = () => {
  const dispatch = useDispatch();
  const username = useSelector((state: RootState) => state.pref.username);

  const changeName = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    dispatch(setUnSelectorClosable(true));
    dispatch(showUnSelector());
  };

  return (
    <>
      <div className="top-bar">
        <div className="logo">
          <Link aria-label={"Main page"} to={'/'}>
            <div className="logo-text-container">
              <img alt={"Watchwithfriends logo"} src={logo}></img>
              <h2 id="logo-text-left">Watchwith</h2>
              <h2 id="logo-text-right">friends</h2>
            </div>
          </Link>
        </div>
        <div className="username-container">
          <a href="/" onClick={changeName}>
            <div className="username-drop-shadow">
              <div className="username-btn">
                <h3>
                  {username} <span className="material-icons">edit</span>{' '}
                </h3>
              </div>
            </div>
          </a>
        </div>
      </div>
    </>
  );
};

export default TopBar;
