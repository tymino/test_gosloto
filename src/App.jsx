import './App.sass';
import { useState, useEffect } from 'react';

import { Button, Field } from './components';

const generator = (length, maxValue) => {
  const randomNumbers = new Set();

  while (randomNumbers.size < length) {
    const number = Math.floor(Math.random() * maxValue + 1);
    randomNumbers.add(number);
  }

  return [...randomNumbers];
};

const App = () => {
  const [isWin, setIsWin] = useState(false);
  const [isGameEnd, setIsGameEnd] = useState(false);
  const [serverWarning, setServerWarning] = useState('');

  const [firstFieldConsts] = useState({
    name: 'Поле 1',
    rules: 'Отметьте 8 чисел.',
    win: 8,
    allNumbers: 19,
  });
  const [secondFieldConsts] = useState({
    name: 'Поле 2',
    rules: 'Отметьте 1 число.',
    win: 1,
    allNumbers: 2,
  });

  const [firstFieldSelected, setFirstFieldSelected] = useState([]);
  const [secondFieldSelected, setSecondFieldSelected] = useState([]);

  const checkWinner = () => {
    const generateFirstNumbers = generator(
      firstFieldConsts.win,
      firstFieldConsts.allNumbers,
    );
    const overlapFirstField = firstFieldSelected.filter((num) =>
      generateFirstNumbers.includes(num),
    );

    if (overlapFirstField.length >= 4) {
      setIsWin(true);
    } else if (overlapFirstField.length === 3) {
      const generateSecondNumbers = generator(
        secondFieldConsts.win,
        secondFieldConsts.allNumbers,
      );
      const overlapSecondField = secondFieldSelected.filter((num) =>
        generateSecondNumbers.includes(num),
      );

      if (overlapSecondField.length === 1) {
        setIsWin(true);
      }
    }

    setIsGameEnd(true);
  };

  const handleButtonAutofill = () => {
    setFirstFieldSelected(
      generator(firstFieldConsts.win, firstFieldConsts.allNumbers),
    );
    setSecondFieldSelected(
      generator(secondFieldConsts.win, secondFieldConsts.allNumbers),
    );
  };

  const handleClickShowResult = () => {
    checkWinner();
  };

  const setDisabledResultButton = () => {
    const isMaxSelectedFieldFirst =
      firstFieldSelected.length === firstFieldConsts.win;
    const isMaxSelectedFieldSecond =
      secondFieldSelected.length === secondFieldConsts.win;

    return !(isMaxSelectedFieldFirst && isMaxSelectedFieldSecond);
  };

  useEffect(() => {
    if (!isGameEnd) return;

    let timer = null;
    let countConnect = 0;

    const data = {
      selectedNumber: {
        firstField: firstFieldSelected,
        secondField: secondFieldSelected,
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
          setServerWarning('Сервер недоступен!');
          clearTimeout(timer);
        }
      }
    };

    fetchData();

    return () => clearTimeout(timer);
  }, [isGameEnd, firstFieldSelected, secondFieldSelected, isWin]);

  return (
    <div className="ticket">
      <div className="ticket__header">
        <div className="ticket__title">Билет 1</div>
        {!isGameEnd && (
          <Button type="link" handler={handleButtonAutofill}>
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

      {!isGameEnd ? (
        <div className="ticket__game">
          <Field
            id="firstField"
            dataConst={firstFieldConsts}
            dataSelected={firstFieldSelected}
            setDataSelected={setFirstFieldSelected}
          />
          <Field
            id="secondField"
            dataConst={secondFieldConsts}
            dataSelected={secondFieldSelected}
            setDataSelected={setSecondFieldSelected}
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

      {!isGameEnd && (
        <Button
          type="primary"
          disabled={setDisabledResultButton()}
          handler={handleClickShowResult}>
          Показать результат
        </Button>
      )}

      <div className="ticket__warning">{serverWarning}</div>
    </div>
  );
};

export default App;
