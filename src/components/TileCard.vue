<template>
  <article class="card" :class="{ completed: item.completed }">
    <div v-if="item.imageUrl" class="media">
      <img :src="item.imageUrl" :alt="item.title" loading="lazy" />
    </div>
    <div class="body">
      <h2>{{ item.title }}</h2>
      <p v-if="item.note">{{ item.note }}</p>
      <a v-if="item.link" :href="item.link" target="_blank" rel="noopener noreferrer">
        詳細を見る
      </a>
    </div>
    <div v-if="item.completed && item.completedAt" class="overlay">
      <span>達成日: {{ item.completedAt }}</span>
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
