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
          description: 'Before summer ends',
          link: 'https://example.com'
        }
      }
    });

    expect(wrapper.text()).toContain('Climb Fuji');
    expect(wrapper.text()).toContain('Before summer ends');
    const anchor = wrapper.get('a');
    expect(anchor.attributes('href')).toBe('https://example.com');
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
