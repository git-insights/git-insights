import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  CircularProgress,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {},
  chartContainer: {
    height: 400,
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  },
  cardActionBtn: {
    top: '4px',
    right: '4px',
  }
}));


const ActivityDatesAndTimesGraph = props => {
  const {
    className,
    children,
    dataLoading,
    title,
    ...rest
  } = props;

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader title={title}/>
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          {dataLoading ? (
            <Grid
              container
              spacing={0}
              alignItems="center"
              justify="center"
              style={{ minHeight: "100%" }}
            >
              <Grid item xs={6}  align="center">
                <CircularProgress/>
                <Typography>
                  Loading Chart..
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <>
              {children}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

ActivityDatesAndTimesGraph.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  dataLoading: PropTypes.bool,
  title: PropTypes.string,
};

export default ActivityDatesAndTimesGraph;
