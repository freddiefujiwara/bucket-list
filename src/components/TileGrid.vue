<template>
  <div class="grid">
    <TileCard
      v-for="item in items"
      :key="item.id"
      :item="item"
      @filter="handleFilter"
      @select="handleSelect"
    />
  </div>
</template>

<script setup>
import TileCard from './TileCard.vue';

defineProps({
  items: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['filter', 'select']);

const handleFilter = (payload) => {
  emit('filter', payload);
};

const handleSelect = (payload) => {
  emit('select', payload);
};
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
</style>
