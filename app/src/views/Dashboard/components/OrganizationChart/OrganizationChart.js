import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  CircularProgress,
  Typography
} from '@material-ui/core';
import { useFetch } from 'helpers';

const useStyles = makeStyles(() => ({
  root: {},
  chartContainer: {
    height: 400,
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const OrganizationChart = props => {
  const { className, repoid, ...rest } = props;
  const [data, dataLoading] = useFetch(
    `api/repo/${repoid}/contributors/organizations`
  );

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Contributor Organizations"
      />
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
            <Plot
              data = {[{
                values: Object.values(data),
                labels: Object.keys(data),
                hoverinfo: 'label+value',
                textinfo: 'label+percent',
                hole: .4,
                type: 'pie'
              }]}
              layout={{
                margin: {
                  t: 50
                },
                autosize: true,
                showlegend: false
              }}
              useResizeHandler={true}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

OrganizationChart.propTypes = {
  className: PropTypes.string
};

export default OrganizationChart;
