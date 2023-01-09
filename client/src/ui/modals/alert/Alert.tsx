import '../modal.css';

const Alert = (props: {
  show: boolean;
  text: string;
  buttontext: string;
  onClickBtn: () => any;
}) => {
  return props.show ? (
    <div className="modal">
      <div className="modal-content">
        <h2>{props.text}</h2>
        <button onClick={() => props.onClickBtn()}> {props.buttontext} </button>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Alert;
