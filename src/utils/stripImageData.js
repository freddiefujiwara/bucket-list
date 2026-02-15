export const isImageRelatedKey = (key) => /image|thumbnail/i.test(key);

export const stripImageRelatedData = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => stripImageRelatedData(item));
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce((acc, [key, entryValue]) => {
      if (isImageRelatedKey(key)) {
        return acc;
      }
      acc[key] = stripImageRelatedData(entryValue);
      return acc;
    }, {});
  }

  return value;
};
