
export const buildOptions = (value: number = 0) => {
  const options = [];

  for (let i = 0; i < value; i++) {
    const prefix = (i < 10 ? '0' : '');

    options.push({
      value: i.toString(),
      label: `${prefix}${i}`
    });
  }

  return options;
};
