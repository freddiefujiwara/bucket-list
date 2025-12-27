<template>
  <div class="page">
    <header class="header">
      <div>
        <p class="eyebrow">Bucket List</p>
        <h1>やりたいことリスト</h1>
        <p class="lead">Google Apps Script から取得したデータをタイル状に表示します。</p>
      </div>
      <button class="refresh" type="button" @click="loadTiles" :disabled="loading">
        {{ loading ? '読み込み中…' : '再読み込み' }}
      </button>
    </header>

    <section class="content">
      <p v-if="error" class="state error">{{ error }}</p>
      <p v-else-if="loading" class="state">データを取得しています…</p>
      <p v-else-if="tiles.length === 0" class="state">表示するデータがありません。</p>
      <TileGrid v-else :items="tiles" />
    </section>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import TileGrid from './components/TileGrid.vue';
import { fetchJsonp } from './services/fetchJsonp';
import { normalizeItems } from './utils/normalizeItems';

const tiles = ref([]);
const loading = ref(false);
const error = ref('');

const DATA_URL =
  import.meta.env.VITE_DATA_URL ||
  'https://script.google.com/macros/s/AKfycbwUF0Lt3OG5kE0IqTyrkciEcUFIXZULI7aM-xJtR_4nrvqOSlIOVKADtFolAvSwFko6Vw/exec';

const loadTiles = async () => {
  loading.value = true;
  error.value = '';
  try {
    const data = await fetchJsonp(DATA_URL, { callbackParam: 'callback' });
    tiles.value = normalizeItems(data);
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'データ取得に失敗しました。';
    tiles.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(loadTiles);
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
