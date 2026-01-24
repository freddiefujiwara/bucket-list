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

const mountApp = async () => {
  const wrapper = mount(App);
  await flushPromises();
  return wrapper;
};

const makeTile = (overrides = {}) => ({
  id: '1',
  title: 'Test',
  note: '',
  ...overrides
});

describe('App', () => {
  beforeEach(() => {
    fetchJsonp.mockReset();
    normalizeItems.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads and renders tiles on mount', async () => {
    fetchJsonp.mockResolvedValueOnce([makeTile()]);
    normalizeItems.mockReturnValueOnce([makeTile()]);

    const wrapper = await mountApp();

    expect(fetchJsonp).toHaveBeenCalledTimes(1);
    expect(wrapper.text()).toContain('Test');
    expect(wrapper.text()).not.toContain('データを取得しています');
  });

  it('shows empty state when no items', async () => {
    fetchJsonp.mockResolvedValueOnce([]);
    normalizeItems.mockReturnValueOnce([]);

    const wrapper = await mountApp();

    expect(wrapper.text()).toContain('表示するデータがありません');
  });

  it('shows error state when fetch fails', async () => {
    fetchJsonp.mockRejectedValueOnce(new Error('boom'));
    normalizeItems.mockReturnValueOnce([]);

    const wrapper = await mountApp();

    expect(wrapper.text()).toContain('boom');
  });

  it('reloads when refresh button is clicked', async () => {
    fetchJsonp
      .mockResolvedValueOnce([{ id: '1', title: 'First' }])
      .mockResolvedValueOnce([{ id: '2', title: 'Second' }]);
    normalizeItems
      .mockReturnValueOnce([makeTile({ id: '1', title: 'First' })])
      .mockReturnValueOnce([makeTile({ id: '2', title: 'Second' })]);

    const wrapper = await mountApp();

    await wrapper.get('button').trigger('click');
    await flushPromises();

    expect(fetchJsonp).toHaveBeenCalledTimes(2);
    expect(wrapper.text()).toContain('Second');
  });

  it('filters by category and clears filter', async () => {
    fetchJsonp.mockResolvedValueOnce([{ id: '1', title: 'A' }]);
    normalizeItems.mockReturnValueOnce([
      makeTile({ id: '1', title: 'A', category: 'Travel' }),
      makeTile({ id: '2', title: 'B', category: 'Food' })
    ]);

    const wrapper = await mountApp();

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

  it('filters by targetAge and clears filter', async () => {
    fetchJsonp.mockResolvedValueOnce([
      { id: '1', title: 'A', targetAge: 20 },
      { id: '2', title: 'B', targetAge: 30 }
    ]);
    normalizeItems.mockReturnValueOnce([
      makeTile({ id: '1', title: 'A', targetAge: 20 }),
      makeTile({ id: '2', title: 'B', targetAge: 30 })
    ]);

    const wrapper = await mountApp();

    // Click on a targetAge chip (assuming TileCard renders it)
    const ageChip = wrapper.findAll('button.chip').find((chip) => chip.text().includes('20'));
    await ageChip.trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('絞り込み:');
    expect(wrapper.text()).toContain('対象年齢 - 20');
    expect(wrapper.findAll('article.card')).toHaveLength(1);
    expect(wrapper.text()).toContain('A');

    await wrapper.get('.filter-chip').trigger('click');
    await flushPromises();
    expect(wrapper.findAll('article.card')).toHaveLength(2);
  });

  it('returns all tiles when filter type is invalid', async () => {
    normalizeItems.mockReturnValueOnce([
      makeTile({ id: '1', title: 'A' }),
      makeTile({ id: '2', title: 'B' })
    ]);

    const wrapper = await mountApp();

    // Directly set a filter that should be ignored
    await wrapper.vm.applyFilter({ type: 'invalid', value: 'anything' });
    await flushPromises();
    expect(wrapper.findAll('article.card')).toHaveLength(2);
  });

  it('handles non-Error rejection', async () => {
    fetchJsonp.mockRejectedValueOnce('network error');
    const wrapper = await mountApp();
    expect(wrapper.text()).toContain('データ取得に失敗しました。');
  });

  describe('modal interactions', () => {
    const mockTileData = {
      id: '1',
      title: 'Modal Test',
      note: 'A detailed note.',
      imageUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
      completedAt: '2023-11-12T15:00:00.000Z',
      category: 'Test',
      targetAge: 30,
      link: 'http://example.com',
    };

    beforeEach(() => {
      fetchJsonp.mockResolvedValueOnce([{}]);
      normalizeItems.mockReturnValueOnce([mockTileData]);
    });

    it('opens modal with full data', async () => {
      const wrapper = await mountApp();
      await wrapper.find('article.card').trigger('click');

      expect(wrapper.find('.modal').exists()).toBe(true);
      expect(wrapper.find('h2').text()).toBe('Modal Test');
      expect(wrapper.text()).toContain('A detailed note.');
      expect(wrapper.find('.modal-media img').attributes('src')).toBe(mockTileData.imageUrl);
      expect(wrapper.text()).toContain('達成日: 2023年11月12日');
      expect(wrapper.text()).toContain('Test');
      expect(wrapper.text()).toContain('目標: 30歳台');
      expect(wrapper.find('a.modal-link').attributes('href')).toBe(mockTileData.link);
    });

    it('handles data with missing optional fields', async () => {
      const minimalData = { id: '2', title: 'Minimal' };
      normalizeItems.mockReset().mockReturnValueOnce([minimalData]);

      const wrapper = await mountApp();
      await wrapper.find('article.card').trigger('click');

      expect(wrapper.find('.modal').exists()).toBe(true);
      expect(wrapper.find('h2').text()).toBe('Minimal');
      expect(wrapper.find('.modal-placeholder').exists()).toBe(true);
      expect(wrapper.find('.modal-body').text()).not.toContain('達成日:');
      expect(wrapper.find('.modal-link').exists()).toBe(false);
    });

    it('handles invalid dates and ages', async () => {
      const invalidData = {
        id: '3',
        title: 'Invalid',
        completedAt: 'invalid-date',
        targetAge: 'abc',
      };
      normalizeItems.mockReset().mockReturnValueOnce([invalidData]);
      const wrapper = await mountApp();
      await wrapper.find('article.card').trigger('click');

      expect(wrapper.text()).toContain('達成日: invalid-date');
      expect(wrapper.text()).toContain('目標: abc');
    });

    it('closes modal on background click', async () => {
      const wrapper = await mountApp();
      await wrapper.find('article.card').trigger('click');
      expect(wrapper.find('.modal').exists()).toBe(true);

      await wrapper.find('.modal').trigger('click');
      expect(wrapper.find('.modal').exists()).toBe(false);
    });

    it('closes modal on close button click', async () => {
      const wrapper = await mountApp();
      await wrapper.find('article.card').trigger('click');
      expect(wrapper.find('.modal').exists()).toBe(true);

      await wrapper.find('.modal-close').trigger('click');
      expect(wrapper.find('.modal').exists()).toBe(false);
    });
  });
});
