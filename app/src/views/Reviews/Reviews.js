import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
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
  }
}));

const Reviews = () => {
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
