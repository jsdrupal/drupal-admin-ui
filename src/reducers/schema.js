import { SCHEMA_LOADED } from '../actions/schema';

export const initialState = {
  uiSchema: {},
  schema: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SCHEMA_LOADED: {
      const [
        {
          attributes: { content: formDisplaySchema },
        },
      ] = action.payload.formDisplaySchema;
      const fieldSchema = action.payload.fieldSchema.reduce((acc, cur) => {
        acc[cur.attributes.field_name] = cur;
        return acc;
      }, {});
      return {
        ...state,
        schema: {
          [`${action.payload.entityTypeId}--${action.payload.bundle}`]: action
            .payload.entitySchema,
        },
        uiSchema: {
          ...state.uiSchema,
          [`${action.payload.entityTypeId}--${action.payload.bundle}`]: {
            fieldSchema,
            formDisplaySchema,
          },
        },
      };
    }
    default:
      return state;
  }
};
