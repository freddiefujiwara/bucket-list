const BIRTH_DATE = new Date('1979-09-02T00:00:00+09:00');

const calculateAge = (birthDate, nowDate) => {
  const birthYear = birthDate.getFullYear();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();

  const nowYear = nowDate.getFullYear();
  const nowMonth = nowDate.getMonth();
  const nowDay = nowDate.getDate();

  let age = nowYear - birthYear;
  if (nowMonth < birthMonth || (nowMonth === birthMonth && nowDay < birthDay)) {
    age -= 1;
  }
  return age;
};

export const getCardClasses = (item, nowDate = new Date()) => {
  if (item?.completed) {
    return { completed: true };
  }

  const age = Number.parseInt(item?.targetAge, 10);
  if (Number.isNaN(age)) {
    return { 'priority-low': true };
  }

  const actualAge = calculateAge(BIRTH_DATE, nowDate);
  const normalizedTargetAge = Math.floor(actualAge / 10) * 10;

  if (age <= normalizedTargetAge) {
    return { 'priority-high': true };
  }
  if (age <= normalizedTargetAge + 10) {
    return { 'priority-mid': true };
  }
  return { 'priority-low': true };
};
