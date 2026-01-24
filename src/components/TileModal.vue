<template>
  <div class="modal" @click="close">
    <div class="modal-card" @click.stop>
      <button class="modal-close" type="button" @click="close">×</button>
      <div class="modal-media">
        <img v-if="isDataImage(item.imageUrl)" :src="item.imageUrl" :alt="item.title" />
        <div v-else class="modal-placeholder" aria-label="NO IMAGE">NO IMAGE</div>
      </div>
      <div class="modal-body">
        <h2>{{ item.title }}</h2>
        <p v-if="item.note">{{ item.note }}</p>
        <div class="modal-meta">
          <span v-if="item.category" class="chip">{{ item.category }}</span>
          <span v-if="item.targetAge" class="chip">
            {{ formatTargetAge(item.targetAge) }}
          </span>
        </div>
        <p v-if="item.completedAt" class="modal-completed">
          達成日: {{ formatDate(item.completedAt) }}
        </p>
        <a
          v-if="item.link"
          :href="item.link"
          target="_blank"
          rel="noopener noreferrer"
          class="modal-link"
        >
          詳細を見る
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDate, formatTargetAge } from '../utils/formatters';
import { isDataImage } from '../utils/image';

defineProps({
  item: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

</script>

<style scoped>
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
</style>
