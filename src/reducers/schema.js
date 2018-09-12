import {
  SCHEMA_LOADED,
  UI_SCHEMA_LOADED,
  SCHEMA_BY_ENTITY_ID_LOADED,
} from '../actions/schema';

export const initialState = {
  uiSchema: {},
  schema: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SCHEMA_LOADED: {
      return {
        ...state,
        schema: {
          [`${action.payload.entityTypeId}--${action.payload.bundle}`]: action
            .payload.entitySchema,
        },
      };
    }
    case SCHEMA_BY_ENTITY_ID_LOADED: {
      return {
        ...state,
        schema: {
          [`${action.payload.entityTypeId}--${action.payload.entityId}`]: action
            .payload.entitySchema,
        },
      };
    }
    case UI_SCHEMA_LOADED: {
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
            fieldStorageConfig: action.payload.fieldStorageConfig,
          },
        },
      };
    }
    default:
      return state;
  }
};
