import { ACTION_TYPE } from '../constants/action_type';
import { Action } from '../actions/action';

export const initialState = {
  uiSchema: {},
  schema: {},
};

export default (state = initialState, action: Action) => {
  switch (action.type) {
    case ACTION_TYPE.SCHEMA_LOADED: {
      return {
        ...state,
        schema: {
          [`${action.payload.entityTypeId}--${action.payload.bundle}`]: action
            .payload.entitySchema,
        },
      };
    }
    case ACTION_TYPE.SCHEMA_BY_ENTITY_ID_LOADED: {
      return {
        ...state,
        schema: {
          [`${action.payload.entityTypeId}--${action.payload.entityId}`]: action
            .payload.entitySchema,
        },
      };
    }
    case ACTION_TYPE.UI_SCHEMA_LOADED: {
      // @ts-ignore
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
