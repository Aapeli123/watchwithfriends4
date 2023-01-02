import '../modal.css';

type Props = {
  children?: JSX.Element | JSX.Element[] | string | string[];
  className?: string;
  closeBtnPress: () => any;
};

const AlertWithChildren: React.FC<Props> = ({
  children,
  className,
  closeBtnPress,
}) => {
  return (
    <div className={`modal ${className}`}>
      <div className="modal-content">
        {children}
        <br></br>
        <button id="close-btn-alert" type="submit" onClick={closeBtnPress}>
          Close
        </button>
      </div>
    </div>
  );
};

export default AlertWithChildren;
