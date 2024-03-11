export const sortByAscDate = (a: { date: Date }, b: { date: Date }) => {
  return a.date.getTime() - b.date.getTime();
};
