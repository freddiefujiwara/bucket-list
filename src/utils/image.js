export const isDisplayableImage = (value) =>
  typeof value === 'string' &&
  (value.startsWith('data:image/') || /^https?:\/\//.test(value));
