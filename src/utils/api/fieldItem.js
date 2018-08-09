export const setItemById = (multiple, item, items) => {
  if (multiple) {
    const index = items.findIndex(i => i.id === item.id);
    if (index === -1) {
      return [...items, item];
    } else {
      items[index] = item;
      return items;
    }
  }
  return item;
};

export const getItemsAsArray = (multiple, items) => {
  if (multiple) {
    return items;
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
