const getTargetAge = (item) => {
  const age = Number.parseInt(item.targetAge, 10);
  return Number.isNaN(age) ? Infinity : age;
};

const getCompletedAt = (item) => {
  const date = new Date(item.completedAt);
  return Number.isNaN(date.getTime()) ? Infinity : date.getTime();
};

export const sortItems = (items) => {
  const copiedItems = [...items];

  copiedItems.sort((a, b) => {
    const aIsCompleted = a.completed === true;
    const bIsCompleted = b.completed === true;

    if (aIsCompleted && !bIsCompleted) {
      return 1;
    }
    if (!aIsCompleted && bIsCompleted) {
      return -1;
    }

    if (!aIsCompleted) {
      // 未完了グループのソート
      const aAge = getTargetAge(a);
      const bAge = getTargetAge(b);
      if (aAge !== bAge) {
        return aAge - bAge;
      }
      const aHasCompletedAt = a.completedAt != null;
      const bHasCompletedAt = b.completedAt != null;
      if (aHasCompletedAt !== bHasCompletedAt) {
        return aHasCompletedAt ? 1 : -1;
      }
    } else {
      // 完了グループのソート
      const aDate = getCompletedAt(a);
      const bDate = getCompletedAt(b);
      if (aDate !== bDate) {
        return aDate - bDate;
      }
    }

    return 0;
  });

  return copiedItems;
};
