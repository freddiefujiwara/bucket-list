export const normalizeItems = (payload) => {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload.map((item, index) => ({
    id: item.id ?? `idx-${index}`,
    category: item.category ?? '',
    targetAge: item.target_age ?? '',
    title: item.title ?? '',
    note: item.note ?? '',
    imageUrl: item.image_url ?? '',
    completed: Boolean(item.completed),
    completedAt: item.completed_at ?? ''
  }));
};
