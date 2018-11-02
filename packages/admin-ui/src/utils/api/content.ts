import { ContentType } from '../../constants/content_type';

export const extractContentType = (content: any) =>
  content && content.type && content.type.substring('node--'.length);

export const mapContentTypeToName = (contentTypes: ContentType[], contentType: string): string =>
  contentTypes &&
  contentType &&
  contentTypes[contentType] &&
  contentTypes[contentType].name;

export const cleanupRelationships = ({ relationships, ...rest }: any) => ({
  ...rest,
  relationships: Object.entries(relationships).reduce((acc, cur) => {
    // @ts-ignore
    const [key, { data: relationshipData }] = cur;
    if (
      typeof relationshipData === 'object' &&
      relationshipData.id &&
      relationshipData.type &&
      relationshipData.id !== '' &&
      relationshipData.type !== ''
    ) {
      acc[key] = { data: relationshipData };
    }
    if (Array.isArray(relationshipData) && relationshipData.length) {
      acc[key] = { data: relationshipData };
    }
    return acc;
  }, {}),
});
