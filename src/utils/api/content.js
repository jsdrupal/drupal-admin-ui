export const extractContentType = content =>
  content && content.type && content.type.substring('node--'.length);

export const mapContentTypeToName = (contentTypes, contentType) =>
  contentTypes &&
  contentType &&
  contentTypes[contentType] &&
  contentTypes[contentType].name;
