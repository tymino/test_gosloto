import './Field.sass';

import { Cell } from '../';

const Field = ({ dataConst, dataSelected, setDataSelected }) => {
  const { name, rules, win, allNumbers } = dataConst;

  const handleClickButton = (buttonValue) => {
    const updateSelectedData = () => {
      if (dataSelected.includes(buttonValue)) {
        return dataSelected.filter((button) => button !== buttonValue);
      }

      if (dataSelected.length === win) return dataSelected;

      return [...dataSelected, buttonValue];
    };

    setDataSelected(updateSelectedData);
  };

  return (
    <div className="field">
      <div className="field__header">
        <p className="field__name">{name}</p>
        <p className="field__rules">{rules}</p>
      </div>

      <progress
        className="field__progress"
        max={win}
        value={dataSelected.length}
      />

      <div className="field__buttons">
        {Array.from({ length: allNumbers }, (_, i) => i + 1).map((button) => {
          return (
            <div key={button}>
              <Cell
                handler={handleClickButton}
                value={button}
                selected={dataSelected.includes(button)}
                maxSelected={dataSelected.length === win}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Field;
