<template>
  <article class="card" :class="{ completed: item.completed }" @click="$emit('select', item)">
    <div class="media">
      <img v-if="isDataImage(item.imageUrl)" :src="item.imageUrl" :alt="item.title" loading="lazy" />
      <div v-else class="placeholder" aria-label="NO IMAGE">NO IMAGE</div>
    </div>
    <div class="body">
      <h2>{{ item.title }}</h2>
      <div class="meta" v-if="item.category || item.targetAge">
        <button
          v-if="item.category"
          class="chip"
          type="button"
          @click.stop="$emit('filter', { type: 'category', value: item.category })"
        >
          {{ item.category }}
        </button>
        <button
          v-if="item.targetAge"
          class="chip"
          type="button"
          @click.stop="$emit('filter', { type: 'targetAge', value: item.targetAge })"
        >
          {{ formatTargetAge(item.targetAge) }}
        </button>
      </div>
      <a
        v-if="item.link"
        :href="item.link"
        target="_blank"
        rel="noopener noreferrer"
        @click.stop
      >
        詳細を見る
      </a>
    </div>
    <div v-if="item.completed && item.completedAt" class="overlay">
      <span>達成日: {{ formatDate(item.completedAt) }}</span>
    </div>
  </article>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
});

defineEmits(['filter', 'select']);

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
.card {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  display: flex;
  flex-direction: column;
  min-height: 220px;
  position: relative;
  transition: filter 0.2s ease, transform 0.2s ease;
}

.media {
  height: 176px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  padding: 16px;
}

.media img {
  width: 128px;
  height: 128px;
  object-fit: contain;
  display: block;
}

.placeholder {
  width: 128px;
  height: 128px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  color: #6b7280;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  border-radius: 12px;
}

.body {
  padding: 16px 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

h2 {
  margin: 0;
  font-size: 1.1rem;
}

p {
  margin: 0;
  color: #4b5563;
  font-size: 0.95rem;
  flex: 1;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  border: none;
  border-radius: 999px;
  padding: 4px 10px;
  background: #e5e7eb;
  color: #374151;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

a {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.card.completed {
  filter: grayscale(1);
}

.overlay {
  position: absolute;
  inset: auto 12px 12px 12px;
  background: rgba(31, 41, 55, 0.8);
  color: #fff;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  text-align: center;
}
</style>
