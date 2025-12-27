import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import TileCard from '../components/TileCard.vue';
import TileGrid from '../components/TileGrid.vue';

describe('TileCard', () => {
  it('renders title, description, and link', () => {
    const wrapper = mount(TileCard, {
      props: {
        item: {
          title: 'Climb Fuji',
          note: 'Before summer ends',
          link: 'https://example.com',
          imageUrl: 'data:image/png;base64,abc123'
        }
      }
    });

    expect(wrapper.text()).toContain('Climb Fuji');
    const anchor = wrapper.get('a');
    expect(anchor.attributes('href')).toBe('https://example.com');
    expect(wrapper.find('img').exists()).toBe(true);
    expect(wrapper.find('.placeholder').exists()).toBe(false);
  });

  it('omits optional fields when missing', () => {
    const wrapper = mount(TileCard, {
      props: {
        item: {
          title: 'No extras'
        }
      }
    });

    expect(wrapper.find('a').exists()).toBe(false);
    expect(wrapper.find('.placeholder').exists()).toBe(true);
  });

  it('shows completed overlay when completed', () => {
    const wrapper = mount(TileCard, {
      props: {
        item: {
          title: 'Done',
          completed: true,
          completedAt: '2024-03-10'
        }
      }
    });

    expect(wrapper.classes()).toContain('completed');
    expect(wrapper.text()).toContain('達成日: 2024年03月10日');
  });

  it('emits filter events for category and target age', async () => {
    const wrapper = mount(TileCard, {
      props: {
        item: {
          title: 'Tagged',
          category: 'Food',
          targetAge: 'Kids'
        }
      }
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
    const wrapper = mount(TileCard, {
      props: {
        item: {
          title: 'Plan',
          targetAge: 50
        }
      }
    });

    expect(wrapper.text()).toContain('目標: 50歳台');
  });

  it('emits select when card is clicked', async () => {
    const wrapper = mount(TileCard, {
      props: {
        item: {
          title: 'Click me'
        }
      }
    });

    await wrapper.trigger('click');

    expect(wrapper.emitted('select')).toEqual([[{ title: 'Click me' }]]);
  });

  it('shows placeholder when image is not a data URI', () => {
    const wrapper = mount(TileCard, {
      props: {
        item: {
          title: 'External image',
          imageUrl: 'https://example.com/image.png'
        }
      }
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
