import './Field.sass';

// import { useCallback } from 'react';
import { Cell } from '../';

const Field = ({ dataConst, dataSelected }) => {
  const { name, rules, winCount, allCell } = dataConst.current;

  const handleClickCell = ({ target }) => {
    const cellValue = target.value;

    const updateSelectedData = () => {
      if (dataSelected.includes(cellValue)) {
        return dataSelected.filter((button) => button !== cellValue);
      }

      if (dataSelected.length === winCount) {
        return dataSelected;
      }

      return [...dataSelected, cellValue];
    };

    // setDataSelected(updateSelectedData);
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
        value={dataSelected.length}
      />

      <div className="field__buttons">
        {allCell.map((buttonVal) => {
          return (
            <div key={buttonVal}>
              <Cell
                handler={handleClickCell}
                value={buttonVal}
                selected={dataSelected.includes(buttonVal)}
                maxSelected={dataSelected.length === winCount}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Field;
