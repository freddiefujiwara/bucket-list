<template>
  <article class="card" :class="cardClasses" @click="handleSelect">
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
            @click.stop="handleCategoryFilter"
          >
            {{ item.category }}
          </button>
          <button
            v-if="item.targetAge"
            class="chip"
            type="button"
            @click.stop="handleTargetAgeFilter"
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
import { getCardClasses } from '../utils/cardPriority';
import { formatDate, formatTargetAge } from '../utils/formatters';
import { isDataImage } from '../utils/image';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['filter', 'select']);

const cardClasses = computed(() => getCardClasses(props.item));

const handleSelect = () => {
  emit('select', props.item);
};

const handleCategoryFilter = () => {
  emit('filter', { type: 'category', value: props.item.category });
};

const handleTargetAgeFilter = () => {
  emit('filter', { type: 'targetAge', value: props.item.targetAge });
};
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
  transition: box-shadow 0.2s ease, filter 0.2s ease, transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.16);
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

@keyframes pulse-danger {
  0% {
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08), 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08), 0 0 0 12px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 12px 28px rgba(15, 23, 42, 0.08), 0 0 0 0 rgba(239, 68, 68, 0);
  }
}

.card.priority-high {
  border: 2px solid #ef4444; /* red-500 */
  animation: pulse-danger 2s infinite;
}

.card.priority-mid {
  border: 2px solid #f97316; /* orange-500 */
  box-shadow: 0 8px 20px rgba(249, 115, 22, 0.2);
}

.card.priority-low {
  border: 2px solid #3b82f6; /* blue-500 */
}
</style>
