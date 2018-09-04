import {
    setItemById,
    deleteItemById,
    getItemsAsArray
} from './fieldItem';

it('should add / update item to fieldItem list.', () => {

    // Multiple fieldItem list.
    expect(
        setItemById(
            true,
            {id: "f0231265-f056-4084-b9e0-534c54eb2f64", type: "taxonomy_term--tags"},
            [{id: "c6c704aa-8dd9-4e6d-9ae3-4b10714f7700", type: "taxonomy_term--tags"}]
        ),
    ).toEqual([
        {id: "c6c704aa-8dd9-4e6d-9ae3-4b10714f7700", type: "taxonomy_term--tags"},
        {id: "f0231265-f056-4084-b9e0-534c54eb2f64", type: "taxonomy_term--tags"}]);

    // Single fieldItem.
    expect(
        setItemById(
            false,
            {id: "f0231265-f056-4084-b9e0-534c54eb2f64", type: "taxonomy_term--tags"},
            []
        ),
    ).toEqual(
        {id: "f0231265-f056-4084-b9e0-534c54eb2f64", type: "taxonomy_term--tags"}
    );

    // Existing item in the list.
    expect(
        setItemById(
            true,
            {id: "f0231265-f056-4084-b9e0-534c54eb2f64", type: "user--user"},
            [{id: "f0231265-f056-4084-b9e0-534c54eb2f64", type: "taxonomy_term--tags"},
                {id: "c6c704aa-8dd9-4e6d-9ae3-4b10714f7700", type: "taxonomy_term--tags"}]
        ),
    ).toEqual(
        [
            {id: "f0231265-f056-4084-b9e0-534c54eb2f64", type: "user--user"},
            {id: "c6c704aa-8dd9-4e6d-9ae3-4b10714f7700", type: "taxonomy_term--tags"}
        ]
    );

});


it('should delete item from fieldItem list.', () => {

    // Delete from multiple fieldItem list.
    expect(
        deleteItemById(
            true,
            "c6c704aa-8dd9-4e6d-9ae3-4b10714f7700",
            [
                {id: "f0231265-f056-4084-b9e0-534c54eb2f64", type: "taxonomy_term--tags"},
                {id: "c6c704aa-8dd9-4e6d-9ae3-4b10714f7700", type: "taxonomy_term--tags"}
            ]

        ),
    ).toEqual([
        {id: "f0231265-f056-4084-b9e0-534c54eb2f64", type: "taxonomy_term--tags"}
    ]);

    // Delete item.
    expect(
        deleteItemById(
            false,
            "c6c704aa-8dd9-4e6d-9ae3-4b10714f7700",
            {id: "c6c704aa-8dd9-4e6d-9ae3-4b10714f7700", type: "taxonomy_term--tags"}
        )
    ).toEqual({});
});


it('should get array of items', () => {

    expect(
        getItemsAsArray(
            true,
            [
                {id: "f0231265-f056-4084-b9e0-534c54eb2f64", type: "taxonomy_term--tags"},
                {id: "c6c704aa-8dd9-4e6d-9ae3-4b10714f7700", type: "taxonomy_term--tags"}
            ]
        )
    ).toEqual([
            {id: "f0231265-f056-4084-b9e0-534c54eb2f64", type: "taxonomy_term--tags"},
            {id: "c6c704aa-8dd9-4e6d-9ae3-4b10714f7700", type: "taxonomy_term--tags"}
        ]);


    expect(
        getItemsAsArray(
            false,
            {id: "f0231265-f056-4084-b9e0-534c54eb2f64", type: "taxonomy_term--tags"}
        )
    ).toEqual([
        {id: "f0231265-f056-4084-b9e0-534c54eb2f64", type: "taxonomy_term--tags"}
    ]);
});
