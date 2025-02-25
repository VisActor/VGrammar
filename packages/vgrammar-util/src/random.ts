/**
 * 随机拟合
 */
export const fakeRandom = () => {
  let i = -1;
  const arr = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9];
  return () => {
    i = (i + 1) % arr.length;
    return arr[i];
  };
};
