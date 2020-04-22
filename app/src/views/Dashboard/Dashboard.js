import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useUser } from 'context';
import {
  useParams
} from "react-router-dom";

import {
  ActivityDatesAndTimesGraph,
  TimeToFirstResponseGraph,
  ContributorsTable,
} from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  alertBar: {
    paddingBottom: theme.spacing(2)
  },
  controlContainer: {
    display: "flex",
      // list-style-type:none;
      padding: 0,
      justifyContent: "flex-end"
  },
  repoControl: {
    minWidth: 120,
    marginRight: 'auto',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(-2),
  },
  dateControl: {
    minWidth: 120,
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(-2),
  }
}));

const Dashboard = () => {
  const classes = useStyles();
  const { repoid } = useParams();
  const { user } = useUser();

  let repoHeader;

  if (user.repos[0] && user.repos[0].processed === false) {
    repoHeader = (
      <div className={classes.alertBar}>
        <MuiAlert elevation={1} severity="warning">Processing historical data, graphs will be available soon.</MuiAlert>
      </div>
    );
  } else {
    repoHeader = (
      <div className={classes.controlContainer} container>
        <FormControl className={classes.repoControl}>
          <InputLabel id="repo-select-label">Repository</InputLabel>
          <Select
            labelId="repo-select-label"
            id="repo-select"
            value={user.repos[0].id}
            // onChange={handleChange}
          >
            {
              user.repos.map(repo => {
                return (<MenuItem value={repo.id}>{repo.full_name}</MenuItem>)
              })
            }
          </Select>
        </FormControl>
        <FormControl className={classes.dateControl}>
          <InputLabel id="date-select-label">Time Frame</InputLabel>
          <Select
            labelId="date-select-label"
            id="date-select"
            value={1}
          >
            <MenuItem value={1}>Last 2 Weeks</MenuItem>
          </Select>
        </FormControl>
      </div>
    );
  }

  return (
    <div className={classes.root}>
      {repoHeader}
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
