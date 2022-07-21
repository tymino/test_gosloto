import './App.sass';
import { useState, useEffect } from 'react';

import { Button, Field } from './components';

const generator = (length, maxValue) => {
  let set = new Set();

  while (set.size < length) {
    const number = Math.floor(Math.random() * maxValue + 1);
    set.add(number);
  }

  return [...set];
};

const App = () => {
  const [isWin, setIsWin] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);
  const [warningText, setWarningText] = useState('');

  // Вынести "выбранное" в отдельный стейт
  const [firstField, setFirstField] = useState({
    name: 'Поле 1',
    rules: 'Отметьте 8 чисел.',
    selected: [],
    win: 8,
    allNumbers: 19,
  });
  const [secondField, setSecondField] = useState({
    name: 'Поле 2',
    rules: 'Отметьте 1 число.',
    selected: [],
    win: 1,
    allNumbers: 2,
  });

  const checkWinner = () => {
    const getOverlap = (name) => {
      const generateFiield = generator(firstField.win, firstField.allNumbers);

      return [name].selected.filter((num) => generateFiield.includes(num));
    };

    const overlapFirst = getOverlap('firstField');
    const overlapSecond = getOverlap('secondField');

    if (overlapFirst.length >= 4) {
      setIsWin(true);
    } else if (overlapFirst.length === 3 && overlapSecond.length === 1) {
      setIsWin(true);
    }

    setGameEnd(true);
  };

  // const updateData = (id, value) => {
  //   const updateArray = (arr, win) => {
  //     if (arr.includes(value)) {
  //       return arr.filter((button) => button !== value);
  //     }

  //     if (arr.length === win) return arr;

  //     return [...arr, value];
  //   };

  //   const newData = {
  //     ...selectedData,
  //     [id]: {
  //       ...selectedData[id],
  //       selected: updateArray(selectedData[id].selected, selectedData[id].win),
  //     },
  //   };

  //   setSelectedData(newData);
  // };

  const handleRandomFillButton = () => {
    setFirstField({
      ...firstField,
      selected: generator(firstField.win, firstField.allNumbers),
    });
    setSecondField({
      ...secondField,
      selected: generator(secondField.win, secondField.allNumbers),
    });
  };

  const handleClickShowResult = () => {
    checkWinner();
  };

  const setDisabledResultButton = () => {
    const isMaxSelectedFieldFirst =
      firstField.selected.length === firstField.win;
    const isMaxSelectedFieldSecond =
      secondField.selected.length === secondField.win;

    return !(isMaxSelectedFieldFirst && isMaxSelectedFieldSecond);
  };

  useEffect(() => {
    if (!gameEnd) return;

    let timer = null;
    let countConnect = 0;

    const data = {
      selectedNumber: {
        firstField: firstField.selected,
        secondField: secondField.selected,
      },

      isTicketWon: isWin,
    };

    const fetchData = async () => {
      try {
        const response = await fetch('https://localhost:4000', {
          method: 'POST',
          body: JSON.stringify(data),
        });

        await response.json();
      } catch (error) {
        if (countConnect < 2) {
          timer = setTimeout(() => {
            fetchData();
            countConnect++;
          }, 2000);
        } else {
          setWarningText('Сервер недоступен!');
          clearTimeout(timer);
        }
      }
    };

    fetchData();

    return () => clearTimeout(timer);
  }, [firstField.selected, gameEnd, isWin, secondField.selected]);

  return (
    <div className="ticket">
      <div className="ticket__header">
        <div className="ticket__title">Билет 1</div>
        {!gameEnd && (
          <Button type="link" buttonHandler={handleRandomFillButton}>
            <svg
              version="1.1"
              viewBox="0 0 476.917 476.917"
              xmlSpace="preserve">
              <path
                d="M399.135,0L90.503,308.633l77.781,77.782L476.917,77.783L399.135,0z M434.491,77.783l-160.14,160.14l-35.355-35.355
              l160.14-160.141L434.491,77.783z M132.928,308.633l84.853-84.853l35.355,35.355l-84.853,84.853L132.928,308.633z"
              />
              <path
                d="M65.753,283.887l-35.355-35.355l21.213-21.213l35.355,35.355L65.753,283.887z M228.39,446.524l-35.355-35.355
              l21.213-21.213l35.355,35.355L228.39,446.524z M51.606,446.519l-21.213-21.213l35.355-35.355l21.213,21.213L51.606,446.519z"
              />
            </svg>
          </Button>
        )}
      </div>

      {!gameEnd ? (
        <div className="ticket__game">
          <Field
            id="firstField"
            data={firstField}
            updateSelected={setFirstField}
          />
          <Field
            id="secondField"
            data={secondField}
            updateSelected={setSecondField}
          />
        </div>
      ) : (
        <div
          className={`ticket__inform ${
            isWin ? 'ticket__inform--win' : 'ticket__inform--lose'
          }`}>
          {isWin ? 'Победа' : 'Неудача'}
        </div>
      )}

      {!gameEnd && (
        <Button
          type="primary"
          disabled={setDisabledResultButton()}
          buttonHandler={handleClickShowResult}
          value="Показать результат"
        />
      )}

      <div className="ticket__warning">{warningText}</div>
    </div>
  );
};

export default App;
