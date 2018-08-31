import React from 'react';

const OpsTableContext = React.createContext({
  openDialog: () => {},
  handleClose: () => {},
});

export default OpsTableContext;
