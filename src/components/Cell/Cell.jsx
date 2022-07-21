import './Cell.sass';

const Cell = ({
  handler,
  value = '',
  selected = false,
  maxSelected = false,
}) => {
  const handleClick = () => {
    handler(value);
  };

  const setCellStyle = () => {
    return selected
      ? `cell cell--selected`
      : maxSelected
      ? `cell cell--maxSelected`
      : 'cell';
  };

  return (
    <button className={setCellStyle()} onClick={handleClick}>
      {value}
    </button>
  );
};

export default Cell;
