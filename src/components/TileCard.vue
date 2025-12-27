<template>
  <article class="card">
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
}

.media {
  height: 140px;
  overflow: hidden;
}

.media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
</style>
