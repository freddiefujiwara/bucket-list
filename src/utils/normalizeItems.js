const fallbackTitle = (item, index) => item.title || item.name || `Item ${index + 1}`;

export const normalizeItems = (payload) => {
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
      ? payload.items
      : Array.isArray(payload?.data)
        ? payload.data
        : [];

  return items.map((item, index) => ({
    id: item.id || item.uuid || item.key || `${index}-${fallbackTitle(item, index)}`,
    title: fallbackTitle(item, index),
    description: item.description || item.detail || item.notes || '',
    imageUrl: item.image || item.imageUrl || item.photo || '',
    link: item.link || item.url || item.href || ''
  }));
};
