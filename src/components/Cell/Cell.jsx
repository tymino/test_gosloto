import { memo, useMemo } from 'react';
import './Cell.sass';

const Cell = ({
  handler,
  value = '',
  selected = false,
  maxSelected = false,
}) => {
  const handleClick = () => handler(value);

  console.log('Cell');

  const setCellStyle = useMemo(() => {
    return selected
      ? `cell cell--selected`
      : maxSelected
      ? `cell cell--maxSelected`
      : 'cell';
  }, [selected, maxSelected]);

  return (
    <button className={setCellStyle} onClick={handleClick}>
      {value}
    </button>
  );
};

export default memo(Cell);
