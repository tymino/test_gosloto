import './Button.sass';

const Button = ({
  type = 'primary',
  buttonHandler,
  value = '',
  selected = false,
  maxSelected = false,
  disabled = false,
  children,
}) => {
  const handleClick = () => {
    buttonHandler(value);
  };

  const setButtonType = () => {
    if (selected) {
      return `button__${type}--selected`;
    } else if (maxSelected) {
      return `button__${type}--maxSelected`;
    } else {
      return '';
    }
  };

  return (
    <button
      className={`button button__${type} ${setButtonType()}`}
      onClick={handleClick}
      disabled={disabled}>
      {children ? children : value}
    </button>
  );
};

export default Button;
