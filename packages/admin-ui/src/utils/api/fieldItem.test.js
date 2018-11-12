import { setItemById, deleteItemById, getItemsAsArray } from './fieldItem';

describe('should set item in fieldItem', () => {
  it('with multiple items in list', () => {
    expect(
      setItemById(
        true,
        {
          id: 'f0231265-f056-4084-b9e0-534c54eb2f64',
          type: 'taxonomy_term--tags',
        },
        [
          {
            id: 'c6c704aa-8dd9-4e6d-9ae3-4b10714f7700',
            type: 'taxonomy_term--tags',
          },
        ],
      ),
    ).toEqual([
      {
        id: 'c6c704aa-8dd9-4e6d-9ae3-4b10714f7700',
        type: 'taxonomy_term--tags',
      },
      {
        id: 'f0231265-f056-4084-b9e0-534c54eb2f64',
        type: 'taxonomy_term--tags',
      },
    ]);
  });

  it('with single item', () => {
    expect(
      setItemById(
        false,
        {
          id: 'f0231265-f056-4084-b9e0-534c54eb2f64',
          type: 'taxonomy_term--tags',
        },
        [],
      ),
    ).toEqual({
      id: 'f0231265-f056-4084-b9e0-534c54eb2f64',
      type: 'taxonomy_term--tags',
    });
  });

  it('with existing item in list', () => {
    expect(
      setItemById(
        true,
        { id: 'f0231265-f056-4084-b9e0-534c54eb2f64', type: 'user--user' },
        [
          {
            id: 'f0231265-f056-4084-b9e0-534c54eb2f64',
            type: 'taxonomy_term--tags',
          },
          {
            id: 'c6c704aa-8dd9-4e6d-9ae3-4b10714f7700',
            type: 'taxonomy_term--tags',
          },
        ],
      ),
    ).toEqual([
      { id: 'f0231265-f056-4084-b9e0-534c54eb2f64', type: 'user--user' },
      {
        id: 'c6c704aa-8dd9-4e6d-9ae3-4b10714f7700',
        type: 'taxonomy_term--tags',
      },
    ]);
  });
});

describe('should delete item in fieldItem', () => {
  it('with multiple item in list', () => {
    expect(
      deleteItemById(true, 'c6c704aa-8dd9-4e6d-9ae3-4b10714f7700', [
        {
          id: 'f0231265-f056-4084-b9e0-534c54eb2f64',
          type: 'taxonomy_term--tags',
        },
        {
          id: 'c6c704aa-8dd9-4e6d-9ae3-4b10714f7700',
          type: 'taxonomy_term--tags',
        },
      ]),
    ).toEqual([
      {
        id: 'f0231265-f056-4084-b9e0-534c54eb2f64',
        type: 'taxonomy_term--tags',
      },
    ]);
  });

  it('with single item', () => {
    expect(
      deleteItemById(false, 'c6c704aa-8dd9-4e6d-9ae3-4b10714f7700', {
        id: 'c6c704aa-8dd9-4e6d-9ae3-4b10714f7700',
        type: 'taxonomy_term--tags',
      }),
    ).toEqual([]);
  });
});

describe('should get array of items', () => {
  it('with multiple items in list', () => {
    expect(
      getItemsAsArray(true, [
        {
          id: 'f0231265-f056-4084-b9e0-534c54eb2f64',
          type: 'taxonomy_term--tags',
        },
        {
          id: 'c6c704aa-8dd9-4e6d-9ae3-4b10714f7700',
          type: 'taxonomy_term--tags',
        },
      ]),
    ).toEqual([
      {
        id: 'f0231265-f056-4084-b9e0-534c54eb2f64',
        type: 'taxonomy_term--tags',
      },
      {
        id: 'c6c704aa-8dd9-4e6d-9ae3-4b10714f7700',
        type: 'taxonomy_term--tags',
      },
    ]);
  });

  it('with single item', () => {
    expect(
      getItemsAsArray(false, {
        id: 'f0231265-f056-4084-b9e0-534c54eb2f64',
        type: 'taxonomy_term--tags',
      }),
    ).toEqual([
      {
        id: 'f0231265-f056-4084-b9e0-534c54eb2f64',
        type: 'taxonomy_term--tags',
      },
    ]);
  });
});
