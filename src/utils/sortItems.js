/**
 * Parses a value into a number. Returns Infinity for invalid numbers.
 * @param {string | number} value The value to parse.
 * @returns {number} The parsed number or Infinity.
 */
const parseAge = (value) => {
  if (value === null || value === undefined) {
    return Infinity;
  }
  const num = parseInt(value, 10);
  return Number.isNaN(num) ? Infinity : num;
};

/**
 * Parses a date string into a Date object. Returns null for invalid dates.
 * @param {string | number | Date} value The date value to parse.
 * @returns {Date | null} The parsed Date object or null.
 */
const parseDate = (value) => {
  if (value === null || value === undefined) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 * @param {Array<T>} array The array to shuffle.
 * @returns {Array<T>} The shuffled array.
 */
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const sortItems = (items) => {
  const itemsCopy = [...items];

  const uncompletedItems = itemsCopy.filter((item) => item.completed !== true);
  const completedItems = itemsCopy.filter((item) => item.completed === true);

  // Sort completed items by completed_at ascending
  // null, undefined, or invalid dates go to the end
  completedItems.sort((a, b) => {
    const dateA = parseDate(a.completedAt);
    const dateB = parseDate(b.completedAt);

    if (dateA === null && dateB === null) return 0;
    if (dateA === null) return 1;
    if (dateB === null) return -1;
    return dateA.getTime() - dateB.getTime();
  });

  // Group uncompleted items by target_age
  const uncompletedGroups = uncompletedItems.reduce((groups, item) => {
    const age = parseAge(item.targetAge);
    const key = age.toString(); // Use string key for object
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});

  // Get sorted age groups
  const sortedAges = Object.keys(uncompletedGroups).sort((a, b) => parseFloat(a) - parseFloat(b));

  // Shuffle within each group and flatten
  const sortedUncompletedItems = sortedAges.flatMap((age) => {
    const group = uncompletedGroups[age];
    return shuffle(group);
  });

  return [...sortedUncompletedItems, ...completedItems];
};
