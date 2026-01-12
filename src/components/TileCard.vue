<template>
  <article class="card" :class="cardClasses" @click="$emit('select', item)">
    <div class="media">
      <img v-if="isDataImage(item.imageUrl)" :src="item.imageUrl" :alt="item.title" loading="lazy" />
      <div v-else class="placeholder" aria-label="NO IMAGE">NO IMAGE</div>
      <div class="info">
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
    </div>
    <div v-if="item.completed && item.completedAt" class="overlay">
      <span>達成日: {{ formatDate(item.completedAt) }}</span>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

defineEmits(['filter', 'select']);

const cardClasses = computed(() => {
  if (props.item.completed) {
    return { completed: true };
  }
  const age = Number.parseInt(props.item.targetAge, 10);
  if (Number.isNaN(age)) {
    return {};
  }
  if (age >= 40 && age < 50) {
    return { 'priority-high': true };
  }
  if (age >= 50 && age < 60) {
    return { 'priority-mid': true };
  }
  if (age >= 60) {
    return { 'priority-low': true };
  }
  return {};
});

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
  min-height: 260px;
  position: relative;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.16);
}

.card.priority-high {
  border-color: #ef4444;
  box-shadow: 0 16px 36px rgba(239, 68, 68, 0.2);
}

.card.priority-mid {
  border-color: #f97316;
}

.card.priority-low {
  border-color: #eab308;
}

.media {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  position: relative;
}

.media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.info {
  position: absolute;
  inset: auto 0 0 0;
  background: rgba(31, 41, 55, 0.65);
  color: #f9fafb;
  padding: 14px 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

h2 {
  margin: 0;
  font-size: 1.1rem;
  color: inherit;
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
  background: rgba(229, 231, 235, 0.85);
  color: #111827;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

a {
  color: #f9fafb;
  font-weight: 600;
  text-decoration: none;
}

.card.completed {
  filter: grayscale(1);
  border-color: #d1d5db;
}

.overlay {
  position: absolute;
  inset: 12px 12px auto 12px;
  background: rgba(31, 41, 55, 0.7);
  color: #fff;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  text-align: center;
  pointer-events: none;
}
</style>
