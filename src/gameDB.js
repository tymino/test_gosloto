const numberTicket = 1;
export const titleTicket = `Билет ${numberTicket}`;

export const firstFieldData = {
  name: 'Поле 1',
  rules: 'Отметьте 8 чисел.',
  winCount: 8,
  allCell: Array.from({ length: 19 }, (_, i) => i + 1),
};

export const secondFieldData = {
  name: 'Поле 2',
  rules: 'Отметьте 1 число.',
  winCount: 1,
  allCell: Array.from({ length: 2 }, (_, i) => i + 1),
};
