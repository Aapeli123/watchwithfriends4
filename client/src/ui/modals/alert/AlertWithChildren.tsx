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
        <input
          id="close-btn-alert"
          type="submit"
          value={'Close'}
          onClick={closeBtnPress}
        />
      </div>
    </div>
  );
};

export default AlertWithChildren;
