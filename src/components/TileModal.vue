<template>
  <div class="modal" @click="close">
    <div class="modal-card" @click.stop>
      <button class="modal-close" type="button" @click="close">×</button>
      <div class="modal-media">
        <img v-if="isDisplayableImage(item.imageUrl)" :src="item.imageUrl" :alt="item.title" />
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
        <div v-if="item.nextAction" class="modal-manage">
          <h3>次の一歩</h3>
          <p>{{ item.nextAction }}</p>
        </div>
        <div v-if="item.progress" class="modal-manage">
          <h3>進捗メモ</h3>
          <p>{{ item.progress }}</p>
        </div>
        <div class="modal-nav">
          <button type="button" class="nav-button prev" :disabled="!hasPrev" @click="$emit('prev')">
            ← 前の項目
          </button>
          <button type="button" class="nav-button edit-button" @click="$emit('edit')">
            編集する
          </button>
          <button type="button" class="nav-button next" :disabled="!hasNext" @click="$emit('next')">
            次の項目 →
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { formatDate, formatTargetAge } from '../utils/formatters';
import { isDisplayableImage } from '../utils/image';

defineProps({
  item: {
    type: Object,
    required: true
  },
  hasPrev: {
    type: Boolean,
    default: false
  },
  hasNext: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'prev', 'next', 'edit']);

const close = () => {
  emit('close');
};

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    close();
  } else if (event.key === 'ArrowLeft') {
    emit('prev');
  } else if (event.key === 'ArrowRight') {
    emit('next');
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  background: rgba(23, 20, 15, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  z-index: 1000;
}

.modal-card {
  background: var(--surface);
  color: var(--ink);
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
  background: var(--ink);
  color: var(--bg);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  font-size: 1.25rem;
  cursor: pointer;
  z-index: 1;
}

.modal-media {
  background: var(--accent-soft);
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
  background: var(--line);
  color: var(--ink-3);
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

.modal-body h2 {
  font-family: "Shippori Mincho B1", "Hiragino Mincho ProN", "Yu Mincho", serif;
}

.modal-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.modal-meta .chip {
  background: var(--accent-soft);
  color: var(--ink-2);
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 0.8rem;
  font-weight: 600;
}

.modal-completed {
  margin: 0;
  color: var(--ink-2);
  font-size: 0.9rem;
}

.modal-manage h3 {
  margin: 0 0 4px;
  font-size: 0.85rem;
  color: var(--accent);
  letter-spacing: 0.06em;
}

.modal-manage p {
  margin: 0;
  white-space: pre-wrap;
}

.edit-button {
  border-color: var(--accent);
  color: var(--accent);
}

.modal-nav {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 8px;
}

.nav-button {
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 8px 16px;
  background: var(--surface);
  color: var(--ink);
  font-weight: 600;
  cursor: pointer;
}

.nav-button:disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
