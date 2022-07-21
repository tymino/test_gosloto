import './Field.sass';

import { Cell } from '../';

const Field = ({ id, data, updateSelected }) => {
  const { name, rules, selected, win, allNumbers } = data;

  const handleClickButton = (buttonValue) => {
    const updateSelectedData = () => {
      if (selected.includes(buttonValue)) {
        return selected.filter((button) => button !== buttonValue);
      }

      if (selected.length === win) return selected;

      return [...selected, buttonValue];
    };

    updateSelected({
      ...data,
      selected: updateSelectedData(),
    });
  };

  return (
    <div className="field">
      <div className="field__header">
        <p className="field__name">{name}</p>
        <p className="field__rules">{rules}</p>
      </div>

      <progress className="field__progress" max={win} value={selected.length} />

      <div className="field__buttons">
        {Array.from({ length: allNumbers }, (_, i) => i + 1).map((button) => {
          return (
            <div key={button}>
              <Cell
                handler={handleClickButton}
                value={button}
                selected={selected.includes(button)}
                maxSelected={selected.length === win}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Field;
