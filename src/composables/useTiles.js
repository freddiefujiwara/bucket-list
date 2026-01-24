import { computed, onMounted, ref } from 'vue';
import { DATA_URL } from '../config';
import { fetchJsonp } from '../services/fetchJsonp';
import { normalizeItems } from '../utils/normalizeItems';
import { sortItems } from '../utils/sortItems';

export const useTiles = () => {
  const tiles = ref([]);
  const loading = ref(false);
  const error = ref('');
  const filter = ref({ type: '', value: '' });
  const selectedTile = ref(null);

  const filteredTiles = computed(() => {
    if (!filter.value.type || !filter.value.value) {
      return tiles.value;
    }
    if (filter.value.type === 'category') {
      return tiles.value.filter((item) => item.category === filter.value.value);
    }
    if (filter.value.type === 'targetAge') {
      return tiles.value.filter((item) => item.targetAge === filter.value.value);
    }
    return tiles.value;
  });

  const resetView = () => {
    filter.value = { type: '', value: '' };
    selectedTile.value = null;
  };

  const loadTiles = async () => {
    loading.value = true;
    error.value = '';
    resetView();
    try {
      const data = await fetchJsonp(DATA_URL, { callbackParam: 'callback' });
      tiles.value = sortItems(normalizeItems(data));
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'データ取得に失敗しました。';
      tiles.value = [];
    } finally {
      loading.value = false;
    }
  };

  onMounted(loadTiles);

  const applyFilter = ({ type, value }) => {
    filter.value = { type, value };
  };

  const clearFilter = () => {
    filter.value = { type: '', value: '' };
  };

  const openTile = (item) => {
    selectedTile.value = item;
  };

  const closeTile = () => {
    selectedTile.value = null;
  };

  return {
    loading,
    error,
    filter,
    selectedTile,
    filteredTiles,
    loadTiles,
    applyFilter,
    clearFilter,
    openTile,
    closeTile
  };
};
