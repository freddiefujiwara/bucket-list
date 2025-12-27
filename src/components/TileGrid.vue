<template>
  <div class="grid">
    <TileCard
      v-for="item in items"
      :key="item.id"
      :item="item"
      @filter="$emit('filter', $event)"
      @select="$emit('select', $event)"
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

defineEmits(['filter', 'select']);
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
}
</style>
