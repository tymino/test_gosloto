import './Field.sass';

import { useCallback } from 'react';
import { Cell } from '../';

const Field = ({ dataConst, dataSelected, setDataSelected }) => {
  const { name, rules, winCount, allCell } = dataConst.current;

  const handleClickButton = useCallback(
    (event) => {
      const buttonValue = Number(event.target.value);

      // ???
      // Field -> App
      // ???

      const updateSelectedData = () => {
        if (dataSelected.includes(buttonValue)) {
          return dataSelected.filter((button) => button !== buttonValue);
        }

        if (dataSelected.length === winCount) {
          return dataSelected;
        }

        return [...dataSelected, buttonValue];
      };

      setDataSelected(updateSelectedData);
    },
    [dataSelected, setDataSelected, winCount],
  );

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
                handler={handleClickButton}
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
