export const setItemById = (multiple: boolean, item: any, items: any[]) => {
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

export const getItemsAsArray = (multiple: boolean, items: object) => {
  if (Array.isArray(items)) {
    return items;
  }
  if (multiple) {
    return Object.values(items);
  }
  return [items];
};

export const deleteItemById = (multiple: boolean, id: string, items: any) => {
  if (!multiple) {
    return {};
  }

  return items.filter((i: {id: string}) => i.id !== id);
};

export default {};
