import { describe, expect, it } from 'vitest';
import { sortItems } from '../utils/sortItems';

describe('sortItems', () => {
  const mockItems = [
    { id: 1, targetAge: 50, completed: false },
    { id: 2, targetAge: 40, completed: false },
    { id: 3, completed: true, completedAt: '2023-01-01' },
    { id: 4, completed: true, completedAt: '2022-01-01' },
    { id: 5, targetAge: 40, completed: false, completedAt: '2025-01-01' },
    { id: 6, targetAge: 'invalid', completed: false },
    { id: 7, completed: true, completedAt: 'invalid-date' },
    { id: 8, targetAge: 40, completed: false },
  ];

  it('sorts uncompleted items before completed items', () => {
    const result = sortItems(mockItems);
    const uncompleted = result.filter(item => !item.completed);
    const completed = result.filter(item => item.completed);
    expect(result.slice(0, 5)).toEqual(uncompleted);
    expect(result.slice(5)).toEqual(completed);
  });

  it('sorts uncompleted items by targetAge in ascending order', () => {
    const result = sortItems(mockItems);
    const uncompleted = result.filter(item => !item.completed);
    expect(uncompleted.map(i => i.id)).toEqual([2, 8, 5, 1, 6]);
  });

  it('sorts uncompleted items with same targetAge by completedAt (nulls first)', () => {
    const result = sortItems(mockItems);
    const uncompleted40s = result.filter(item => item.targetAge === 40);
    expect(uncompleted40s.map(i => i.id)).toEqual([2, 8, 5]);
  });

  it('sorts completed items by completedAt in ascending order', () => {
    const result = sortItems(mockItems);
    const completed = result.filter(item => item.completed);
    expect(completed.map(i => i.id)).toEqual([4, 3, 7]);
  });

  it('handles invalid targetAge and completedAt values gracefully', () => {
    const result = sortItems(mockItems);
    // invalid targetAge should be last in uncompleted
    expect(result.find(i => i.id === 6).targetAge).toBe('invalid');
    expect(result.filter(i => !i.completed).pop().id).toBe(6);
    // invalid completedAt should be last in completed
    expect(result.find(i => i.id === 7).completedAt).toBe('invalid-date');
    expect(result.filter(i => i.completed).pop().id).toBe(7);
  });

  it('does not mutate the original array', () => {
    const original = [...mockItems];
    sortItems(original);
    expect(original).toEqual(mockItems);
  });
});
