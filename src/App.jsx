import './App.sass';
import { useState, useEffect, useRef, useCallback } from 'react';

import { titleTicket, firstFieldData, secondFieldData } from './gameDB';
import generator from './utils/generator';

import { Button, Field } from './components';

const App = () => {
  const svgStick = useRef(
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

  const [isUserWin, setIsUserWin] = useState(false);
  const [isGameEnd, setIsGameEnd] = useState(false);
  const [serverWarning, setServerWarning] = useState('');

  const [firstFieldSelected, setFirstFieldSelected] = useState([]);
  const [secondFieldSelected, setSecondFieldSelected] = useState([]);

  const [isDisableResultButton, setIsDisableResultButton] = useState(true);

  const handleButtonAutofill = useCallback(() => {
    setFirstFieldSelected(
      generator(firstFieldData.winCount, firstFieldData.allCell.length),
    );
    setSecondFieldSelected(
      generator(secondFieldData.winCount, secondFieldData.allCell.length),
    );

    setIsDisableResultButton(false);
  }, [setFirstFieldSelected, setSecondFieldSelected]);

  const handleClickResultButton = useCallback(() => {
    setIsGameEnd(true);
  }, []);

  useEffect(() => {
    const generateFirstNumbers = generator(
      firstFieldData.winCount,
      firstFieldData.allCell.length,
    );

    const overlapFirstField = firstFieldSelected.filter((num) =>
      generateFirstNumbers.includes(num),
    );

    if (overlapFirstField.length >= 4) {
      setIsUserWin(true);
    } else if (overlapFirstField.length === 3) {
      const generateSecondNumbers = generator(
        secondFieldData.winCount,
        secondFieldData.allCell.length,
      );
      const overlapSecondField = secondFieldSelected.filter((num) =>
        generateSecondNumbers.includes(num),
      );

      if (overlapSecondField.length === 1) {
        setIsUserWin(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGameEnd]);

  useEffect(() => {
    const isFirstFieldSelected =
      firstFieldSelected.length === firstFieldData.winCount;
    const isSecondFieldSelected =
      secondFieldSelected.length === secondFieldData.winCount;

    const result = !(isFirstFieldSelected && isSecondFieldSelected);

    setIsDisableResultButton(result);
  }, [firstFieldSelected, secondFieldSelected]);

  useEffect(() => {
    if (!isGameEnd) return;

    let timer = null;
    let countConnect = 0;

    const data = {
      selectedNumber: {
        firstField: firstFieldSelected,
        secondField: secondFieldSelected,
      },
      isTicketWon: isUserWin,
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
  }, [isGameEnd, firstFieldSelected, secondFieldSelected, isUserWin]);

  return (
    <div className="ticket">
      <div className="ticket__header">
        <div className="ticket__title">{titleTicket}</div>
        {!isGameEnd && (
          <Button type="link" handler={handleButtonAutofill}>
            {svgStick.current}
          </Button>
        )}
      </div>

      {!isGameEnd ? (
        <div className="ticket__game">
          <Field
            fieldData={firstFieldData}
            cellSelected={firstFieldSelected}
            setCellSelected={setFirstFieldSelected}
          />
          <Field
            fieldData={secondFieldData}
            cellSelected={secondFieldSelected}
            setCellSelected={setSecondFieldSelected}
          />
        </div>
      ) : (
        <div
          className={`ticket__inform ${
            isUserWin ? 'ticket__inform--win' : 'ticket__inform--lose'
          }`}>
          {isUserWin ? 'Победа' : 'Неудача'}
        </div>
      )}

      {!isGameEnd && (
        <Button
          type="primary"
          disabled={isDisableResultButton}
          handler={handleClickResultButton}>
          Показать результат
        </Button>
      )}

      <div className="ticket__warning">{serverWarning}</div>
    </div>
  );
};

export default App;
