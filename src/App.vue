<template>
  <div class="page">
    <header class="header">
      <div>
        <p class="eyebrow">Bucket List</p>
        <h1>やりたいことリスト</h1>
        <p class="lead">Google Apps Script から取得したデータをタイル状に表示します。</p>
        <div v-if="filter.type" class="filter">
          <span>絞り込み:</span>
          <button type="button" class="filter-chip" @click="clearFilter">
            {{ filter.type === 'category' ? 'カテゴリ' : '対象年齢' }} - {{ filter.value }}
            <span class="close">×</span>
          </button>
        </div>
      </div>
      <button class="refresh" type="button" @click="loadTiles" :disabled="loading">
        {{ loading ? '読み込み中…' : '再読み込み' }}
      </button>
    </header>

    <section class="content">
      <p v-if="error" class="state error">{{ error }}</p>
      <p v-else-if="loading" class="state">データを取得しています…</p>
      <p v-else-if="filteredTiles.length === 0" class="state">表示するデータがありません。</p>
      <TileGrid v-else :items="filteredTiles" @filter="applyFilter" />
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import TileGrid from './components/TileGrid.vue';
import { fetchJsonp } from './services/fetchJsonp';
import { normalizeItems } from './utils/normalizeItems';
import { shuffleItems } from './utils/shuffleItems';

const tiles = ref([]);
const loading = ref(false);
const error = ref('');
const filter = ref({ type: '', value: '' });

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

const DATA_URL =
  import.meta.env.VITE_DATA_URL ||
  'https://script.google.com/macros/s/AKfycbwUF0Lt3OG5kE0IqTyrkciEcUFIXZULI7aM-xJtR_4nrvqOSlIOVKADtFolAvSwFko6Vw/exec';

const loadTiles = async () => {
  loading.value = true;
  error.value = '';
  filter.value = { type: '', value: '' };
  try {
    const data = await fetchJsonp(DATA_URL, { callbackParam: 'callback' });
    tiles.value = shuffleItems(normalizeItems(data));
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
</script>

<style scoped>
.page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px 48px;
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 32px;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0 0 8px;
}

h1 {
  margin: 0 0 8px;
  font-size: clamp(1.8rem, 2.4vw, 2.6rem);
}

.lead {
  margin: 0;
  color: #4b5563;
}

.filter {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #4b5563;
  font-size: 0.9rem;
}

.filter-chip {
  border: none;
  border-radius: 999px;
  padding: 4px 12px;
  background: #111827;
  color: #fff;
  font-size: 0.8rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.filter-chip .close {
  font-size: 1rem;
  line-height: 1;
}

.refresh {
  border: none;
  border-radius: 999px;
  padding: 12px 20px;
  background: #2563eb;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.refresh:disabled {
  cursor: wait;
  opacity: 0.7;
}

.refresh:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.2);
}

.content {
  min-height: 320px;
}

.state {
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.error {
  color: #b91c1c;
  background: #fee2e2;
}

@media (max-width: 720px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
