import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
} from '@material-ui/core';
import {
  useParams
} from "react-router-dom";

import {
  ActivityDatesAndTimesGraph,
  TimeToFirstResponseGraph,
  ContributorsTable,
  RepositoryStatusAlertBar,
  RepositoryNavigator,
} from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  alertBar: {
    paddingBottom: theme.spacing(2)
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  const { repoid } = useParams();

  return (
    <div className={classes.root}>
      <RepositoryNavigator />
      <RepositoryStatusAlertBar repoId={repoid} />
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
          <ActivityDatesAndTimesGraph repoid={repoid}/>
        </Grid>
        <Grid
          item
          xl={6}
          lg={6}
          md={12}
          xs={12}
        >
          <TimeToFirstResponseGraph repoid={repoid}/>
        </Grid>
        {/* <Grid
          item
          xl={6}
          lg={6}
          md={12}
          xs={12}
        >
          <OrganizationChart repoid={repoid}/>
        </Grid> */}
        <Grid
          item
          xl={6}
          lg={6}
          md={12}
          xs={12}
        >
          <ContributorsTable repoid={repoid}/>
        </Grid>
      </Grid>
    </div>
  );
};

export default Dashboard;
