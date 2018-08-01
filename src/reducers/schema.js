import { UI_CONFIG_SCHEMA_LOADED } from '../actions/schema';

export const initialState = {
  uiSchema: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UI_CONFIG_SCHEMA_LOADED: {
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
