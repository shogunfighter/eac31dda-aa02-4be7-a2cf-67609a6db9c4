import { findItemWithLatestCompletedDate, findItemWithOldestCompletedDate } from "./util";

describe('findItemWithLatestCompletedDate', () => {
  it('should return null for an empty array', () => {
    const result = findItemWithLatestCompletedDate([]);
    expect(result).toBeNull();
  });

  it('should return the item with the latest completed date', () => {
    const inputArray = [
      { completed: '12/01/2019 08:00:00' },
      { completed: '12/01/2024 09:00:00' }, //latest 2024
      { completed: '12/01/2021 10:00:00' },
    ];

    const result = findItemWithLatestCompletedDate(inputArray);
    expect(result).toEqual({ completed: '12/01/2024 09:00:00' });
  });
});

describe('findItemWithOldestCompletedDate', () => {
  it('should return null for an empty array', () => {
    const result = findItemWithOldestCompletedDate([]);
    expect(result).toBeNull();
  });

  it('should return the item with the oldest completed date', () => {
    const inputArray = [
      { completed: '12/01/2010 08:00:00' },
      { completed: '12/01/2013 10:00:00' },
      { completed: '12/01/2005 09:00:00' }, // oldest 2005
      { completed: '12/01/2024 09:00:00' },
      { completed: '12/01/2022 09:00:00' },
    ];

    const result = findItemWithOldestCompletedDate(inputArray);
    expect(result).toEqual({ completed: '12/01/2005 09:00:00' });
  });
});