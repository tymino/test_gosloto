import './Field.sass';

import { Button } from '../';

const Field = ({ id, data, updateData }) => {
  const { name, rules, selected, win, allNumbers } = data;

  const handleClickButton = (buttonValue) => {
    updateData(id, buttonValue);
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
        value={selected.length}
      />

      <div className="field__buttons">
        {Array.from({ length: allNumbers }, (_, i) => i + 1).map((button) => {
          return (
            <div key={button}>
              <Button
                type="secondary"
                buttonHandler={handleClickButton}
                selected={selected.includes(button)}
                maxSelected={selected.length === win}
                value={button}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Field;
