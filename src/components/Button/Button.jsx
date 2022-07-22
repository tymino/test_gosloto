import './Button.sass';

const Button = ({ type = 'primary', handler, disabled = false, children }) => {
  return (
    <button
      className={`button button__${type}`}
      onClick={handler}
      disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
