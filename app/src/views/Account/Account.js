import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import { AccountDetails, LinkedAccounts } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Account = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        {/* <Grid
          item
          lg={6}
          xs={12}
        >
          <AccountDetails />
        </Grid> */}
        <Grid
          item
          lg={6}
          xs={12}
        >
          <LinkedAccounts />
        </Grid>
      </Grid>
    </div>
  );
};

export default Account;
