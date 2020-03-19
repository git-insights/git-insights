import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import {
  useParams
} from "react-router-dom";
import {
  IssuesNewGraph,
  IssuesClosedGraph,
  IssuesActiveGraph,
  IssuesAgeGraph,
  IssuesResponseTimeGraph,
  IssuesResolutionDurationGraph,
} from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const Issues = () => {
  const classes = useStyles();
  const { repoid } = useParams();

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          xl={6}
          lg={6}
          md={12}
          xs={12}
        >
          <IssuesNewGraph repoid={repoid}/>
        </Grid>
        <Grid
          item
          xl={6}
          lg={6}
          md={12}
          xs={12}
        >
          <IssuesClosedGraph repoid={repoid}/>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          xl={6}
          lg={6}
          md={12}
          xs={12}
        >
          <IssuesActiveGraph repoid={repoid}/>
        </Grid>
        <Grid
          item
          xl={6}
          lg={6}
          md={12}
          xs={12}
        >
          <IssuesAgeGraph repoid={repoid}/>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          xl={6}
          lg={6}
          md={12}
          xs={12}
        >
          <IssuesResponseTimeGraph repoid={repoid}/>
        </Grid>
        <Grid
          item
          xl={6}
          lg={6}
          md={12}
          xs={12}
        >
          <IssuesResolutionDurationGraph repoid={repoid}/>
        </Grid>
      </Grid>
    </div>
  );
};

export default Issues;
