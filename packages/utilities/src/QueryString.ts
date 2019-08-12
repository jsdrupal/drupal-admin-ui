interface FilterElemA {
  bundle?: string;
  entity_type?: string;
  condition?: {
    operator?: string;
    path: string;
    value: string;
  };
  mode?: string;
  status?: {
    value: number;
  };
  targetEntityType?: string;
  title?: {
    path: string;
    operator: string;
    value: string;
  };
}

interface FilterElemB {
  id: {
    condition: {
      operator: string;
      path: string;
      value: string[];
    };
  };
}

interface FilterElemC {
  name: {
    condition: {
      operator: string;
      path: string;
      value: string;
    };
  };
}

export interface QueryString {
  _describes?: string;
  _format?: string;
  filter?: FilterElemA | FilterElemB | FilterElemC;
  page?: {};
  sort?: {};
  include?: string;
}
