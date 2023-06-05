export const transform = (
  options: {
    callback: (entry: any, params: any) => boolean;
  },
  data: any[],
  parameters?: any
) => {
  return data.filter(entry => {
    return options.callback(entry, parameters);
  });
};
