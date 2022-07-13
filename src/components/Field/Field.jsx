import './Field.sass';

const Field = ({ id, data, updateData }) => {
  const { name, rules, selected, allNumbers } = data;

  const handleClickButton = (event) => {
    const value = Number(event.target.value);
    updateData(id, value);
  };

  const setStyleButton = (actualIndex) => {
    return selected.includes(actualIndex)
      ? 'field__button field__button--selected'
      : 'field__button';
  };

  return (
    <div className="field">
      <div className="field__header">
        <p className="field__name">{name}</p>
        <p className="field__rules">{rules}</p>
      </div>

      <div className="field__buttons">
        {Array.from({ length: allNumbers }, (_, i) => i + 1).map((button) => {
          return (
            <button
              key={button}
              className={setStyleButton(button)}
              onClick={handleClickButton}
              value={button}>
              {button}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Field;
