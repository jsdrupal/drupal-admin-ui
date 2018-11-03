export interface ContentType {
  id: string;
  attributes: {
    type: 'string',
  };
  name: string;
  description: string;
}

export default ContentType;
