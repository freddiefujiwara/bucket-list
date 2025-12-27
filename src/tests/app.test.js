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

    const travelChip = wrapper
      .findAll('button.chip')
      .find((chip) => chip.text() === 'Travel');
    await travelChip.trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('絞り込み:');
    expect(wrapper.text()).toContain('カテゴリ - Travel');
    expect(wrapper.findAll('article.card')).toHaveLength(1);
    expect(wrapper.text()).toContain('A');

    await wrapper.get('.filter-chip').trigger('click');
    await flushPromises();

    expect(wrapper.findAll('article.card')).toHaveLength(2);
  });

  it('opens and closes the tile modal', async () => {
    fetchJsonp.mockResolvedValueOnce([{ id: '1', title: 'A' }]);
    normalizeItems.mockReturnValueOnce([
      {
        id: '1',
        title: 'A',
        note: 'note',
        imageUrl: 'img.jpg',
        completedAt: '2023-11-12T15:00:00.000Z'
      }
    ]);

    const wrapper = mount(App);
    await flushPromises();

    await wrapper.find('article.card').trigger('click');

    expect(wrapper.find('.modal').exists()).toBe(true);
    expect(wrapper.text()).toContain('達成日: 2023年11月12日');

    await wrapper.find('.modal-close').trigger('click');

    expect(wrapper.find('.modal').exists()).toBe(false);
  });
});
