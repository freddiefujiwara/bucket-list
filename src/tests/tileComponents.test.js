import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TileCard from '../components/TileCard.vue';
import TileGrid from '../components/TileGrid.vue';
import TileModal from '../components/TileModal.vue';

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
  it('renders title, image, and labels', () => {
    const wrapper = mountCard({
      title: 'Climb Fuji',
      category: 'Travel',
      targetAge: 50,
      imageUrl: 'data:image/png;base64,abc123'
    });

    expect(wrapper.text()).toContain('Climb Fuji');
    expect(wrapper.find('img').exists()).toBe(true);
    expect(wrapper.find('.placeholder').exists()).toBe(false);
    expect(wrapper.text()).toContain('Travel');
    expect(wrapper.text()).toContain('目標: 50歳台');
  });

  it('renders https images', () => {
    const wrapper = mountCard({
      title: 'External image',
      imageUrl: 'https://example.com/image.png'
    });

    expect(wrapper.find('img').exists()).toBe(true);
    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/image.png');
  });

  it('omits optional fields when missing', () => {
    const wrapper = mountCard({ title: 'No extras' });

    expect(wrapper.find('.placeholder').exists()).toBe(true);
    expect(wrapper.find('.meta').exists()).toBe(false);
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

  it('emits select when card is clicked', async () => {
    const wrapper = mountCard({ title: 'Click me' });

    await wrapper.trigger('click');

    expect(wrapper.emitted('select')).toEqual([[{ title: 'Click me' }]]);
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

  it('passes select events through', async () => {
    const wrapper = mount(TileGrid, {
      props: {
        items: [{ id: '1', title: 'Item 1' }]
      }
    });

    await wrapper.find('article.card').trigger('click');

    expect(wrapper.emitted('select')).toEqual([[{ id: '1', title: 'Item 1' }]]);
  });
});

describe('TileModal', () => {
  const mountModal = (props = {}) =>
    mount(TileModal, {
      props: {
        item: makeItem({ title: 'Modal item' }),
        ...props
      }
    });

  it('renders item details', () => {
    const wrapper = mountModal({
      item: makeItem({
        title: 'Detailed',
        note: 'A note.',
        category: 'Travel',
        targetAge: 40,
        completedAt: '2023-10-26T15:00:00.000Z',
        imageUrl: 'https://example.com/image.png'
      })
    });

    expect(wrapper.text()).toContain('Detailed');
    expect(wrapper.text()).toContain('A note.');
    expect(wrapper.text()).toContain('Travel');
    expect(wrapper.text()).toContain('目標: 40歳台');
    expect(wrapper.text()).toContain('達成日: 2023年10月27日');
    expect(wrapper.find('.modal-media img').exists()).toBe(true);
  });

  it('shows placeholder without an image', () => {
    const wrapper = mountModal();

    expect(wrapper.find('.modal-placeholder').exists()).toBe(true);
  });

  it('shows management fields and emits edit', async () => {
    const wrapper = mountModal({
      item: makeItem({
        title: 'Managed',
        nextAction: '予約する',
        progress: '下調べ中'
      })
    });

    expect(wrapper.text()).toContain('次の一歩');
    expect(wrapper.text()).toContain('予約する');
    expect(wrapper.text()).toContain('進捗メモ');
    expect(wrapper.text()).toContain('下調べ中');

    await wrapper.get('button.edit-button').trigger('click');
    expect(wrapper.emitted('edit')).toHaveLength(1);
  });

  it('hides management sections when empty', () => {
    const wrapper = mountModal();

    expect(wrapper.text()).not.toContain('次の一歩');
    expect(wrapper.text()).not.toContain('進捗メモ');
  });

  it('emits close on background and button clicks', async () => {
    const wrapper = mountModal();

    await wrapper.find('.modal-close').trigger('click');
    await wrapper.find('.modal').trigger('click');

    expect(wrapper.emitted('close')).toHaveLength(2);
  });

  it('emits prev and next from nav buttons and disables at the ends', async () => {
    const wrapper = mountModal({ hasPrev: false, hasNext: true });

    const prevButton = wrapper.get('button.prev');
    const nextButton = wrapper.get('button.next');
    expect(prevButton.attributes('disabled')).toBeDefined();
    expect(nextButton.attributes('disabled')).toBeUndefined();

    await nextButton.trigger('click');
    expect(wrapper.emitted('next')).toHaveLength(1);
    expect(wrapper.emitted('prev')).toBeUndefined();
  });

  it('handles keyboard navigation', async () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener');
    const wrapper = mountModal({ hasPrev: true, hasNext: true });

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(wrapper.emitted('prev')).toHaveLength(1);
    expect(wrapper.emitted('next')).toHaveLength(1);
    expect(wrapper.emitted('close')).toHaveLength(1);

    wrapper.unmount();
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeSpy.mockRestore();
  });
});
