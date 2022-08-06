import './Field.sass';
import { memo } from 'react';

import { Cell } from '../';

const Field = ({ fieldData, cellSelected, setCellSelected }) => {
  const { name, rules, winCount, allCell } = fieldData;

  const handleClickCell = ({ target }) => {
    if (!target.classList.contains('cell')) return;

    const cellValue = Number(target.value);

    const updateSelectedData = () => {
      if (cellSelected.includes(cellValue)) {
        return cellSelected.filter((button) => button !== cellValue);
      }

      if (cellSelected.length === winCount) {
        return cellSelected;
      }

      return [...cellSelected, cellValue];
    };

    setCellSelected(updateSelectedData);
  };

  return (
    <div className="field">
      <div className="field__header">
        <p className="field__name">{name}</p>
        <p className="field__rules">{rules}</p>
      </div>

      <progress
        className="field__progress"
        max={winCount}
        value={cellSelected.length}
      />

      <div className="field__buttons">
        {allCell.map((buttonVal) => {
          return (
            <div key={buttonVal} onClick={handleClickCell}>
              <Cell
                value={buttonVal}
                selected={cellSelected.includes(buttonVal)}
                maxSelected={cellSelected.length === winCount}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default memo(Field);
