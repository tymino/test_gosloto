import './App.sass';
import { useState, useEffect, useRef, useCallback } from 'react';

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
  const randButtonSvg = useRef(
    <svg version="1.1" viewBox="0 0 476.917 476.917" xmlSpace="preserve">
      <path
        d="M399.135,0L90.503,308.633l77.781,77.782L476.917,77.783L399.135,0z M434.491,77.783l-160.14,160.14l-35.355-35.355
  l160.14-160.141L434.491,77.783z M132.928,308.633l84.853-84.853l35.355,35.355l-84.853,84.853L132.928,308.633z"
      />
      <path
        d="M65.753,283.887l-35.355-35.355l21.213-21.213l35.355,35.355L65.753,283.887z M228.39,446.524l-35.355-35.355
  l21.213-21.213l35.355,35.355L228.39,446.524z M51.606,446.519l-21.213-21.213l35.355-35.355l21.213,21.213L51.606,446.519z"
      />
    </svg>,
  );

  const firstFieldConsts = useRef({
    name: 'Поле 1',
    rules: 'Отметьте 8 чисел.',
    winCount: 8,
    allCell: Array.from({ length: 19 }, (_, i) => i + 1),
  });
  const secondFieldConsts = useRef({
    name: 'Поле 2',
    rules: 'Отметьте 1 число.',
    winCount: 1,
    allCell: Array.from({ length: 2 }, (_, i) => i + 1),
  });

  const [userWin, setUserWin] = useState(false);
  const [gameEnd, setGameEnd] = useState(false);
  const [serverWarning, setServerWarning] = useState('');

  const [firstFieldSelected, setFirstFieldSelected] = useState([]);
  const [secondFieldSelected, setSecondFieldSelected] = useState([]);

  const [resultButtonDisable, setResultButtonDisable] = useState(true);

  const handleButtonAutofill = useCallback(() => {
    setFirstFieldSelected(
      generator(
        firstFieldConsts.current.winCount,
        firstFieldConsts.current.allCell.length,
      ),
    );
    setSecondFieldSelected(
      generator(
        secondFieldConsts.current.winCount,
        secondFieldConsts.current.allCell.length,
      ),
    );

    setResultButtonDisable(false);
  }, [setFirstFieldSelected, setSecondFieldSelected]);

  const handleClickShowResult = useCallback(() => {
    setGameEnd(true);
  }, [setGameEnd]);

  // ***
  // попробовать перенести firstFieldSelected и secondFieldSelected в Field
  // Так я получу 1 стейт на все поля
  // Этот стейт проверять на "заполненность" И передавать в приложение
  // Надо проверку на победу делать в App потому что у меня может быть не один Field
  // ***

  useEffect(() => {
    const generateFirstNumbers = generator(
      firstFieldConsts.current.winCount,
      firstFieldConsts.current.allCell.length,
    );

    const overlapFirstField = firstFieldSelected.filter((num) =>
      generateFirstNumbers.includes(num),
    );

    if (overlapFirstField.length >= 4) {
      setUserWin(true);
    } else if (overlapFirstField.length === 3) {
      const generateSecondNumbers = generator(
        secondFieldConsts.current.winCount,
        secondFieldConsts.current.allCell.length,
      );
      const overlapSecondField = secondFieldSelected.filter((num) =>
        generateSecondNumbers.includes(num),
      );

      if (overlapSecondField.length === 1) {
        setUserWin(true);
      }
    }
  }, [gameEnd]);

  useEffect(() => {
    const isFirstFieldSelected =
      firstFieldSelected.length === firstFieldConsts.current.winCount;
    const isSecondFieldSelected =
      secondFieldSelected.length === secondFieldConsts.current.winCount;

    const result = !(isFirstFieldSelected && isSecondFieldSelected);

    setResultButtonDisable(result);
  }, [firstFieldSelected, secondFieldSelected]);

  useEffect(() => {
    if (!gameEnd) return;

    let timer = null;
    let countConnect = 0;

    const data = {
      selectedNumber: {
        firstField: firstFieldSelected,
        secondField: secondFieldSelected,
      },
      isTicketWon: userWin,
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
  }, [gameEnd, firstFieldSelected, secondFieldSelected, userWin]);

  return (
    <div className="ticket">
      <div className="ticket__header">
        <div className="ticket__title">Билет 1</div>
        {!gameEnd && (
          <Button type="link" handler={handleButtonAutofill}>
            {randButtonSvg.current}
          </Button>
        )}
      </div>

      {!gameEnd ? (
        <div className="ticket__game">
          <Field
            id="firstField"
            dataConst={firstFieldConsts}
            dataSelected={firstFieldSelected}
          />
          <Field
            id="secondField"
            dataConst={secondFieldConsts}
            dataSelected={secondFieldSelected}
          />
        </div>
      ) : (
        <div
          className={`ticket__inform ${
            userWin ? 'ticket__inform--win' : 'ticket__inform--lose'
          }`}>
          {userWin ? 'Победа' : 'Неудача'}
        </div>
      )}

      {!gameEnd && (
        <Button
          type="primary"
          disabled={resultButtonDisable}
          handler={handleClickShowResult}>
          Показать результат
        </Button>
      )}

      <div className="ticket__warning">{serverWarning}</div>
    </div>
  );
};

export default App;
