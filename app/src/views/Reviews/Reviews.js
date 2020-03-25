import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import { useUser } from 'context';
import MuiAlert from '@material-ui/lab/Alert';
import {
  useParams
} from "react-router-dom";
import {
  ReviewsAcceptedGraph,
  ReviewsDeclinedGraph,
  ReviewsDurationGraph,
} from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  alertBar: {
    paddingBottom: theme.spacing(2)
  }
}));

const Reviews = () => {
  const classes = useStyles();
  const { repoid } = useParams();
  const { user } = useUser();

  return (
    <div className={classes.root}>
      {user.repos[0] && user.repos[0].processed === false &&
        <div className={classes.alertBar}>
          <MuiAlert elevation={1} severity="warning">Processing historical data, graphs will be available soon.</MuiAlert>
        </div>
      }
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
          <ReviewsAcceptedGraph repoid={repoid}/>
        </Grid>
        <Grid
          item
          xl={6}
          lg={6}
          md={12}
          xs={12}
        >
          <ReviewsDeclinedGraph repoid={repoid}/>
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
          <ReviewsDurationGraph repoid={repoid}/>
        </Grid>
      </Grid>
    </div>
  );
};

export default Reviews;
