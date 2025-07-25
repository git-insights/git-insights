import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4),
    textAlign: 'center'
  }
}));

const HelloWorld = () => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography variant="h1">Hello World</Typography>
    </div>
  );
};

export default HelloWorld;
