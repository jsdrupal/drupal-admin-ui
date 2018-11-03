// export lazyFunction(f: any) => (props: any, propName: string, componentName: string, ...rest:any) =>
//   f(props, propName, componentName, ...rest);

// let schemaType: object;
// export lazySchemaType = lazyFunction(() => schemaType);

interface SchemaProp {
  type: string;
  title: string;
  description: string;
  maxItems: number;
  properties: {
    // TODO find a  better way
    lazyFunction:(props: any, propName: string, componentName: string, rest: any) => any,
    data:{
      items: object,
      type: string,
      properties: {
        id: {
          format: string,
          maxLength: number,
          type: string,
        },
        type: {
          enum: object,
          title: string,
          type: string,
        },
        items: object,
        relationships: any,
        attributes: {
          required: string[],
        }
        required: boolean[],
      }
    }
  };
}

export default SchemaProp;
