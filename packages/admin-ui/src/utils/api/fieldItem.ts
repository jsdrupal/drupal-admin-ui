interface FieldItem {
  id: string;
}

export const setItemById = (
  multiple: boolean,
  item: FieldItem,
  items: Array<FieldItem>,
): Array<FieldItem> | FieldItem => {
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

export const getItemsAsArray = (
  multiple: boolean,
  items: Array<FieldItem>,
): Array<FieldItem> => {
  if (Array.isArray(items)) {
    return items;
  }
  if (multiple) {
    return Object.values(items);
  }
  return [items];
};

export const deleteItemById = (
  multiple: boolean,
  id: string,
  items: Array<FieldItem>,
): Array<FieldItem> => {
  if (!multiple) {
    return [];
  }

  return items.filter(i => i.id !== id);
};
