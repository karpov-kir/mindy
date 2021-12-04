export const getIdGenerator = () => {
  let lastId = 1;

  return () => {
    return lastId++;
  };
};
