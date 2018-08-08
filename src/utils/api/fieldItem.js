export const setItemById = (multiple, item, itemList) => {
  if (multiple) {
    const id = item.id;
    const index = itemList.findIndex(i => i.id === item.id);
    if (index === -1) {
      return [...itemList, item];
    } else {
      itemList[index] = item;
      return itemList;
    }
  } else {
    return {
      ...itemList,
      item,
    };
  }
};

export const getItemsAsArray = (multiple, items) => {
  if (multiple) {
    return items;
  }
  return [items];
};

export default {};
