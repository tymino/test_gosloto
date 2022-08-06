const generator = (length, maxValue) => {
  const randomNumbers = new Set();

  while (randomNumbers.size < length) {
    const number = Math.floor(Math.random() * maxValue + 1);
    randomNumbers.add(number);
  }

  return [...randomNumbers];
};

export default generator;
