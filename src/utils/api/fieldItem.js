export const setItemById = (multiple, item, items) => {
  if (multiple) {
    const index = items.findIndex(i => i.id === item.id);
    if (index === -1) {
      return [...items, item];
    }
    items[index] = item;
    return items;
  }
  return item;
};

export const getItemsAsArray = (multiple, items) => {
  if (Array.isArray(items)) {
    return items;
  }
  if (multiple) {
    return Object.values(items);
  }
  return [items];
};

export const deleteItemById = (multiple, id, items) => {
  if (!multiple) {
    return {};
  }

  return items.filter(i => i.id !== id);
};

export default {};
