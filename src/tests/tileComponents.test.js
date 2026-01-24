import { describe, expect, it, vi, afterEach, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TileCard from '../components/TileCard.vue';
import TileGrid from '../components/TileGrid.vue';

const makeItem = (overrides = {}) => ({
  title: 'Item',
  ...overrides
});

const mountCard = (itemOverrides = {}) =>
  mount(TileCard, {
    props: {
      item: makeItem(itemOverrides)
    }
  });

describe('TileCard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    const mockDate = new Date('2024-08-15T12:00:00.000Z'); // 実年齢が44歳になる日付
    vi.setSystemTime(mockDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders title, description, and link', () => {
    const wrapper = mountCard({
      title: 'Climb Fuji',
      note: 'Before summer ends',
      link: 'https://example.com',
      imageUrl: 'data:image/png;base64,abc123'
    });

    expect(wrapper.text()).toContain('Climb Fuji');
    const anchor = wrapper.get('a');
    expect(anchor.attributes('href')).toBe('https://example.com');
    expect(wrapper.find('img').exists()).toBe(true);
    expect(wrapper.find('.placeholder').exists()).toBe(false);
  });

  it('omits optional fields when missing', () => {
    const wrapper = mountCard({ title: 'No extras' });

    expect(wrapper.find('a').exists()).toBe(false);
    expect(wrapper.find('.placeholder').exists()).toBe(true);
  });

  it('shows completed overlay when completed', () => {
    const wrapper = mountCard({
      title: 'Done',
      completed: true,
      completedAt: '2024-03-10'
    });

    expect(wrapper.classes()).toContain('completed');
    expect(wrapper.text()).toContain('達成日: 2024年03月10日');
  });

  it('shows original date string if date is invalid', () => {
    const wrapper = mountCard({
      title: 'Invalid Date',
      completed: true,
      completedAt: 'invalid-date'
    });
    expect(wrapper.text()).toContain('達成日: invalid-date');
  });

  it('calculates age correctly just after the birthday', () => {
    // This test ensures the branch condition in calculateAge is covered
    // where the current month is after the birth month.
    const mockDate = new Date('2024-09-03T12:00:00.000Z'); // Birthday is 09-02. Actual age is 45. Normalized is 40.
    vi.setSystemTime(mockDate);

    const wrapper = mountCard({
      title: 'Post-birthday test',
      targetAge: 50 // Should be priority-mid
    });

    expect(wrapper.classes()).toContain('priority-mid');
  });

  it.each([
    { targetAge: 40, expectedClass: 'priority-high' },
    { targetAge: 50, expectedClass: 'priority-mid' },
    { targetAge: 60, expectedClass: 'priority-low' },
    { targetAge: 'invalid', expectedClass: 'priority-low' },
    { targetAge: undefined, expectedClass: 'priority-low' }
  ])('applies correct priority class for targetAge $targetAge', ({ targetAge, expectedClass }) => {
    const wrapper = mountCard({
      title: 'Priority Test',
      targetAge
    });
    expect(wrapper.classes()).toContain(expectedClass);
  });

  it('applies completed class and no priority class if item is completed', () => {
    const wrapper = mountCard({
      title: 'Completed item',
      targetAge: 40,
      completed: true
    });
    expect(wrapper.classes()).toContain('completed');
    expect(wrapper.classes()).not.toContain('priority-high');
  });

  it('emits filter events for category and target age', async () => {
    const wrapper = mountCard({
      title: 'Tagged',
      category: 'Food',
      targetAge: 'Kids'
    });

    const buttons = wrapper.findAll('button.chip');
    await buttons[0].trigger('click');
    await buttons[1].trigger('click');

    expect(wrapper.emitted('filter')).toEqual([
      [{ type: 'category', value: 'Food' }],
      [{ type: 'targetAge', value: 'Kids' }]
    ]);
    expect(wrapper.text()).toContain('目標: Kids');
  });

  it('formats numeric target age as decade', () => {
    const wrapper = mountCard({
      title: 'Plan',
      targetAge: 50
    });

    expect(wrapper.text()).toContain('目標: 50歳台');
  });

  it('emits select when card is clicked', async () => {
    const wrapper = mountCard({ title: 'Click me' });

    await wrapper.trigger('click');

    expect(wrapper.emitted('select')).toEqual([[{ title: 'Click me' }]]);
  });

  it('shows placeholder when image is not a data URI', () => {
    const wrapper = mountCard({
      title: 'External image',
      imageUrl: 'https://example.com/image.png'
    });

    expect(wrapper.find('img').exists()).toBe(false);
    expect(wrapper.find('.placeholder').text()).toBe('NO IMAGE');
  });
});

describe('TileGrid', () => {
  it('renders cards for each item', () => {
    const wrapper = mount(TileGrid, {
      props: {
        items: [
          { id: '1', title: 'Item 1' },
          { id: '2', title: 'Item 2' }
        ]
      }
    });

    expect(wrapper.findAllComponents(TileCard)).toHaveLength(2);
  });
});
