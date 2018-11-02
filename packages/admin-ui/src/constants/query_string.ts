interface filterElemA {
  bundle?: string,
  entity_type?: string
  condition?: {
    operator?: string,
    path: string,
    value: string,
  },
  mode?: string,
  status?: {
    value: number,
  }
  targetEntityType?: string,
  title?: {
    path: string,
    operator: string,
    value: string,
  }
};

interface filterElemB {
  id: {
    condition: {
      operator: string,
      path: string,
      value: string[],
    }
  }
};

interface filterElemC {
  name: {
    condition: {
      operator: string,
      path: string,
      value: string,
    }
  }
};

export interface QueryString {
  _describes?: string,
  _format?: string,
  filter?: filterElemA | filterElemB | filterElemC,
  page?: {},
  sort?: {},
  include?: string,
};

export default QueryString;
