<template>
  <div class="page">
    <header class="header">
      <div>
        <p class="eyebrow">Bucket List</p>
        <h1>死ぬまでにやりたいことリスト</h1>
        <p class="lead">人生で叶えたいことをタイルでまとめて眺められます。</p>
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
      <TileGrid v-else :items="filteredTiles" @filter="applyFilter" @select="openTile" />
    </section>

    <div v-if="selectedTile" class="modal" @click="closeTile">
      <div class="modal-card" @click.stop>
        <button class="modal-close" type="button" @click="closeTile">×</button>
        <div class="modal-media">
          <img
            v-if="isDataImage(selectedTile.imageUrl)"
            :src="selectedTile.imageUrl"
            :alt="selectedTile.title"
          />
          <div v-else class="modal-placeholder" aria-label="NO IMAGE">NO IMAGE</div>
        </div>
        <div class="modal-body">
          <h2>{{ selectedTile.title }}</h2>
          <p v-if="selectedTile.note">{{ selectedTile.note }}</p>
          <div class="modal-meta">
            <span v-if="selectedTile.category" class="chip">{{ selectedTile.category }}</span>
            <span v-if="selectedTile.targetAge" class="chip">
              {{ formatTargetAge(selectedTile.targetAge) }}
            </span>
          </div>
          <p v-if="selectedTile.completedAt" class="modal-completed">
            達成日: {{ formatDate(selectedTile.completedAt) }}
          </p>
          <a
            v-if="selectedTile.link"
            :href="selectedTile.link"
            target="_blank"
            rel="noopener noreferrer"
            class="modal-link"
          >
            詳細を見る
          </a>
        </div>
      </div>
    </div>
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

const DATA_URL =
  import.meta.env.VITE_DATA_URL ||
  'https://script.google.com/macros/s/AKfycbwUF0Lt3OG5kE0IqTyrkciEcUFIXZULI7aM-xJtR_4nrvqOSlIOVKADtFolAvSwFko6Vw/exec';

const loadTiles = async () => {
  loading.value = true;
  error.value = '';
  filter.value = { type: '', value: '' };
  selectedTile.value = null;
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

const openTile = (item) => {
  selectedTile.value = item;
};

const closeTile = () => {
  selectedTile.value = null;
};

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}年${month}月${day}日`;
};

const formatTargetAge = (value) => {
  const numeric = Number.parseInt(value, 10);
  if (Number.isNaN(numeric)) {
    return `目標: ${value}`;
  }
  return `目標: ${numeric}歳台`;
};

const isDataImage = (value) => typeof value === 'string' && value.startsWith('data');
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

.modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1000;
}

.modal-card {
  background: #fff;
  border-radius: 24px;
  max-width: 720px;
  width: min(90vw, 720px);
  max-height: 90vh;
  overflow: auto;
  position: relative;
  display: flex;
  flex-direction: column;
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  border: none;
  background: #111827;
  color: #fff;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1.25rem;
  cursor: pointer;
}

.modal-media {
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.modal-media img {
  max-width: 100%;
  max-height: 320px;
  object-fit: contain;
}

.modal-placeholder {
  width: 128px;
  height: 128px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  color: #6b7280;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  border-radius: 12px;
}

.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.modal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.modal-meta .chip {
  background: #e5e7eb;
  color: #374151;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.8rem;
  font-weight: 600;
}

.modal-completed {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.modal-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

@media (max-width: 720px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
