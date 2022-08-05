import { memo, useMemo } from 'react';
import './Cell.sass';

const Cell = ({ value = '', selected = false, maxSelected = false }) => {
  const setCellStyle = useMemo(() => {
    return selected
      ? `cell cell--selected`
      : maxSelected
      ? `cell cell--maxSelected`
      : 'cell';
  }, [selected, maxSelected]);

  return (
    <button className={setCellStyle} value={value}>
      {value}
    </button>
  );
};

export default memo(Cell);
