import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import App from '../App.vue';

vi.mock('../services/fetchJsonp', () => ({
  fetchJsonp: vi.fn()
}));

vi.mock('../utils/normalizeItems', () => ({
  normalizeItems: vi.fn()
}));

const { fetchJsonp } = await import('../services/fetchJsonp');
const { normalizeItems } = await import('../utils/normalizeItems');

describe('App', () => {
  beforeEach(() => {
    fetchJsonp.mockReset();
    normalizeItems.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads and renders tiles on mount', async () => {
    fetchJsonp.mockResolvedValueOnce([{ id: '1', title: 'Test' }]);
    normalizeItems.mockReturnValueOnce([{ id: '1', title: 'Test', note: '' }]);

    const wrapper = mount(App);
    await flushPromises();

    expect(fetchJsonp).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain('Test');
    expect(wrapper.text()).not.toContain('データを取得しています');
  });

  it('shows empty state when no items', async () => {
    fetchJsonp.mockResolvedValueOnce([]);
    normalizeItems.mockReturnValueOnce([]);

    const wrapper = mount(App);
    await flushPromises();

    expect(wrapper.text()).toContain('表示するデータがありません');
  });

  it('shows error state when fetch fails', async () => {
    fetchJsonp.mockRejectedValueOnce(new Error('boom'));
    normalizeItems.mockReturnValueOnce([]);

    const wrapper = mount(App);
    await flushPromises();

    expect(wrapper.text()).toContain('boom');
  });

  it('reloads when refresh button is clicked', async () => {
    fetchJsonp
      .mockResolvedValueOnce([{ id: '1', title: 'First' }])
      .mockResolvedValueOnce([{ id: '2', title: 'Second' }]);
    normalizeItems
      .mockReturnValueOnce([{ id: '1', title: 'First', note: '' }])
      .mockReturnValueOnce([{ id: '2', title: 'Second', note: '' }]);

    const wrapper = mount(App);
    await flushPromises();

    await wrapper.get('button').trigger('click');
    await flushPromises();

    expect(fetchJsonp).toHaveBeenCalledTimes(2);
    expect(wrapper.text()).toContain('Second');
  });

  it('filters by category and clears filter', async () => {
    fetchJsonp.mockResolvedValueOnce([{ id: '1', title: 'A' }]);
    normalizeItems.mockReturnValueOnce([
      { id: '1', title: 'A', category: 'Travel' },
      { id: '2', title: 'B', category: 'Food' }
    ]);

    const wrapper = mount(App);
    await flushPromises();

    await wrapper.find('button.chip').trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('絞り込み:');
    expect(wrapper.text()).toContain('カテゴリ - Travel');
    expect(wrapper.text()).not.toContain('B');

    await wrapper.get('.filter-chip').trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('B');
  });
});
