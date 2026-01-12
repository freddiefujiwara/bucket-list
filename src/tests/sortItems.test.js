import {
  describe, expect, it, vi,
} from 'vitest';
import { sortItems } from '../utils/sortItems';

describe('sortItems', () => {
  const mockItems = [
    // Uncompleted items
    { id: 1, targetAge: 30, completed: false }, // Group 30
    { id: 2, targetAge: 25, completed: false }, // Group 25
    { id: 3, targetAge: 30, completed: false }, // Group 30
    { id: 4, targetAge: 'invalid', completed: false }, // Group Infinity
    { id: 5, targetAge: 25, completed: undefined }, // Group 25
    { id: 6, completed: false }, // Group Infinity
    { id: 7, targetAge: '40', completed: false }, // Group 40

    // Completed items
    { id: 8, completed: true, completedAt: '2023-01-15' }, // Oldest
    { id: 9, completed: true, completedAt: '2023-05-20' }, // Newest
    { id: 10, completed: true, completedAt: 'invalid-date' }, // End
    { id: 11, completed: true }, // End
    { id: 12, completed: true, completedAt: null }, // End
  ];

  it('should not mutate the original array', () => {
    const originalItems = [{ id: 1, completed: false, targetAge: 30 }];
    const originalItemsCopy = JSON.parse(JSON.stringify(originalItems));
    sortItems(originalItems);
    expect(originalItems).toEqual(originalItemsCopy);
  });

  it('should place uncompleted items before completed items', () => {
    const result = sortItems(mockItems);
    const uncompletedCount = mockItems.filter((i) => i.completed !== true).length;

    expect(result.length).toBe(mockItems.length);
    expect(result.slice(0, uncompletedCount).every((i) => i.completed !== true)).toBe(true);
    expect(result.slice(uncompletedCount).every((i) => i.completed === true)).toBe(true);
  });

  it('should sort completed items by completedAt date (ascending)', () => {
    const result = sortItems(mockItems);
    const completedItems = result.filter((item) => item.completed === true);

    const expectedOrder = [8, 9, 10, 11, 12];
    const actualOrder = completedItems.map((item) => item.id);

    expect(actualOrder).toEqual(expectedOrder);
  });

  it('should handle tie-breaking for invalid completedAt dates', () => {
    const items = [
      { id: 1, completed: true, completedAt: 'invalid' },
      { id: 2, completed: true, completedAt: null },
      { id: 3, completed: true, completedAt: '2023-01-01' },
      { id: 4, completed: true, completedAt: undefined },
    ];
    const result = sortItems(items);
    expect(result.map((i) => i.id)).toEqual([3, 1, 2, 4]);
  });

  it('should sort uncompleted items by targetAge (ascending)', () => {
    const result = sortItems(mockItems);
    const uncompleted = result.filter((i) => i.completed !== true);

    // Extract ages, converting to numbers for comparison
    const ages = uncompleted.map((i) => parseInt(i.targetAge, 10));
    const sortedAges = [...ages].sort((a, b) => {
      const numA = Number.isNaN(a) ? Infinity : a;
      const numB = Number.isNaN(b) ? Infinity : b;
      return numA - numB;
    });

    expect(ages).toEqual(sortedAges);
    expect(parseInt(uncompleted[0].targetAge, 10)).toBe(25);
    expect(parseInt(uncompleted[1].targetAge, 10)).toBe(25);
    expect(parseInt(uncompleted[2].targetAge, 10)).toBe(30);
    expect(parseInt(uncompleted[3].targetAge, 10)).toBe(30);
    expect(parseInt(uncompleted[4].targetAge, 10)).toBe(40);
  });

  it('should handle items with invalid or missing targetAge', () => {
    const result = sortItems(mockItems);
    const uncompleted = result.filter((i) => i.completed !== true);

    // Items with invalid/missing age should be at the end of the uncompleted list
    const invalidAgeItems = uncompleted.filter((i) => Number.isNaN(parseInt(i.targetAge, 10)));
    expect(invalidAgeItems.map((i) => i.id).sort()).toEqual([4, 6].sort());

    const lastTwoUncompleted = uncompleted.slice(-2);
    expect(lastTwoUncompleted.map((i) => i.id).sort()).toEqual([4, 6].sort());
  });

  it('should shuffle items within the same targetAge group', () => {
    const randomSpy = vi.spyOn(Math, 'random');
    const items = [
      { id: 1, targetAge: 20, completed: false },
      { id: 2, targetAge: 20, completed: false },
      { id: 3, targetAge: 20, completed: false },
    ];

    // Mock random to be deterministic
    randomSpy.mockReturnValue(0.8);
    const result1 = sortItems(JSON.parse(JSON.stringify(items)));
    expect(result1.map((i) => i.id)).toEqual([1, 2, 3]);

    randomSpy.mockReturnValue(0.1);
    const result2 = sortItems(JSON.parse(JSON.stringify(items)));
    expect(result2.map((i) => i.id)).toEqual([2, 3, 1]);

    randomSpy.mockRestore();
  });

  it('should handle an empty array', () => {
    const result = sortItems([]);
    expect(result).toEqual([]);
  });

  it('should handle array with only uncompleted items', () => {
    const items = [
      { id: 1, targetAge: 30, completed: false },
      { id: 2, targetAge: 20, completed: false },
    ];
    const result = sortItems(items);
    expect(result.map((i) => i.id)).toEqual([2, 1]);
    expect(result.every((i) => i.completed !== true)).toBe(true);
  });

  it('should handle array with only completed items', () => {
    const items = [
      { id: 1, completed: true, completedAt: '2023-12-01' },
      { id: 2, completed: true, completedAt: '2023-01-01' },
    ];
    const result = sortItems(items);
    expect(result.map((i) => i.id)).toEqual([2, 1]);
    expect(result.every((i) => i.completed === true)).toBe(true);
  });
});
