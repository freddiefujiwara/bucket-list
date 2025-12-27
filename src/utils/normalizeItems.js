const fallbackTitle = (item) => item.title || item.name || '';

export const normalizeItems = (payload) => {
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
      ? payload.items
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

  return items.map((item, index) => ({
    id: item.id || item.uuid || item.key || `idx-${index}`,
    title: fallbackTitle(item),
    note: item.note || item.notes || item.description || item.detail || '',
    imageUrl: item.image_url || item.image || item.imageUrl || item.photo || '',
    link: item.link || item.url || item.href || '',
    completed: Boolean(item.completed),
    completedAt: item.completed_at || item.completedAt || ''
  }));
};
