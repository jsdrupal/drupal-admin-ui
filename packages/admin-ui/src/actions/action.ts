import { ACTION_TYPE } from '../constants/action_type';
import { ContentType } from '../constants/content_type';
import { MenuLink } from '../constants/menu_link';

export interface Action {
  data: {};
  type: ACTION_TYPE;
  id: string;
  attributes: {
    id: string;
    label: string;
  };
  payload: {
    actions: {
      data: Array<{}>;
    };
    key: string;
    bundle: string;
    content: {
      id: string;
      attributes: {
        nid: string;
      };
    };
    contentList: {
      data: Array<{
        id: string;
        type: string;
      }>;
      links: {};
      included: Array<{
        id: string;
        type: string;
      }>;
    };
    contentTypes: {
      data: ContentType[];
    };
    data: Array<{}>;
    dbLogEntries: {
      data: Array<{
        attributes: {
          wid: string;
          message_formatted_plain: string;
          timestamp: number;
          type: string;
        };
      }>;
      links: string[];
    };
    dbLogEntriesTypes: string[];
    entity: {
      data: {
        id: string;
      };
    };
    entityId: string;
    entitySchema: {};
    // TODO do we need both these values? ( below )
    entityTypeId: string;
    entity_type: string;
    formDisplaySchema: {};
    fieldSchema: Array<{
      attributes: {
        field_name: string;
      };
    }>;
    fieldStorageConfig: {};
    menuLinks: MenuLink[];
    options: {};
    roles: {
      data: Array<{}>;
    };
    taxonomyVocabulary: {};
    taxonomyTerms: {};
    vocabulary: {};
    user: {};
    uid: string;
  };
}

export default Action;
