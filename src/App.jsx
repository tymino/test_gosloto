import './App.sass';
import { useState, useEffect } from 'react';

import { Field } from './components';

const App = () => {
  const generator = (length, maxValue) => {
    let set = new Set();
    let counter = 0;

    while (counter < length) {
      const number = Math.floor(Math.random() * maxValue + 1);

      set.add(number);
      counter = set.size;
    }

    return [...set];
  };

  const [isWin, setIsWin] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);
  const [warningText, setWarningText] = useState('');

  const [selectedData, setSelectedData] = useState({
    firstField: {
      name: 'Поле 1',
      rules: 'Отметьте 8 чисел.',
      selected: [],
      win: 8,
      allNumbers: 19,
    },
    secondField: {
      name: 'Поле 2',
      rules: 'Отметьте 1 число.',
      selected: [],
      win: 1,
      allNumbers: 2,
    },
  });
  // eslint-disable-next-line no-unused-vars
  const [randomData, setRandomData] = useState({
    firstField: generator(
      selectedData.firstField.win,
      selectedData.firstField.allNumbers,
    ),
    secondField: generator(
      selectedData.secondField.win,
      selectedData.secondField.allNumbers,
    ),
  });

  const checkWinner = (data) => {
    const overlapFirst = data.firstField.selected.filter((num) =>
      randomData.firstField.includes(num),
    );
    const overlapSecond = data.secondField.selected.filter((num) =>
      randomData.secondField.includes(num),
    );

    if (overlapFirst.length >= 4) {
      setIsWin(true);
    } else if (overlapFirst.length === 3 && overlapSecond.length === 1) {
      setIsWin(true);
    }

    setGameEnd(true);
  };

  const updateData = (id, value) => {
    const updateArray = (arr, win) => {
      if (arr.includes(value)) {
        return arr.filter((button) => button !== value);
      }

      if (arr.length === win) return arr;

      return [...arr, value];
    };

    const newData = {
      ...selectedData,
      [id]: {
        ...selectedData[id],
        selected: updateArray(selectedData[id].selected, selectedData[id].win),
      },
    };

    setSelectedData(newData);
  };

  const handleRandomFillButton = () => {
    setSelectedData({
      firstField: {
        ...selectedData.firstField,
        selected: generator(
          selectedData.firstField.win,
          selectedData.firstField.allNumbers,
        ),
      },
      secondField: {
        ...selectedData.secondField,
        selected: generator(
          selectedData.secondField.win,
          selectedData.secondField.allNumbers,
        ),
      },
    });
  };

  const handleClickShowResult = () => {
    checkWinner(selectedData);
  };

  const setDisabledResultButton = () => {
    const fieldFirst =
      selectedData.firstField.selected.length === selectedData.firstField.win;
    const fieldSecond =
      selectedData.secondField.selected.length === selectedData.secondField.win;

    return !(fieldFirst && fieldSecond);
  };

  useEffect(() => {
    if (!gameEnd) return;

    let timer = null;
    let countConnect = 0;

    const sendData = {
      selectedNumber: {
        firstField: selectedData.firstField.selected,
        secondField: selectedData.secondField.selected,
      },

      isTicketWon: isWin,
    };

    const sendDataToServer = async () => {
      try {
        const response = await fetch('https://localhost:4000', {
          method: 'POST',
          body: JSON.stringify(sendData),
        });

        // eslint-disable-next-line no-unused-vars
        const json = await response.json();
      } catch (error) {
        if (countConnect < 2) {
          timer = setTimeout(() => {
            sendDataToServer();
            countConnect++;
          }, 2000);
        } else {
          setWarningText('Сервер недоступен!');
          clearInterval(timer);
        }
      }
    };

    sendDataToServer();

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameEnd]);

  return (
    <div className="ticket">
      <div className="ticket__header">
        <div className="ticket__title">Билет 1</div>
        {!gameEnd && (
          <button
            className="ticket__button ticket__random"
            onClick={handleRandomFillButton}>
            <img
              className="ticket__button-image"
              src="./images/magic-wand.png"
              alt="magic-wand"
            />
          </button>
        )}
      </div>

      {!gameEnd ? (
        <div className="ticket__game">
          <Field
            id="firstField"
            data={selectedData.firstField}
            updateData={updateData}
          />
          <Field
            id="secondField"
            data={selectedData.secondField}
            updateData={updateData}
          />
        </div>
      ) : (
        <div className="ticket__inform">{isWin ? 'Победа' : 'Неудача'}</div>
      )}

      {!gameEnd && (
        <button
          className="ticket__result ticket__button"
          onClick={handleClickShowResult}
          disabled={setDisabledResultButton()}>
          Показать результат
        </button>
      )}

      <div className="ticket__warning">{warningText}</div>
    </div>
  );
};

export default App;
