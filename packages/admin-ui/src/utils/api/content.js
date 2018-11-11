export const extractContentType = content =>
  content && content.type && content.type.substring('node--'.length);

export const mapContentTypeToName = (contentTypes, contentType) =>
  contentTypes &&
  contentType &&
  contentTypes[contentType] &&
  contentTypes[contentType].name;

export const cleanupRelationships = ({ relationships, ...rest }) => ({
  ...rest,
  relationships: Object.entries(relationships).reduce((acc, cur) => {
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
