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
  Button
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

const StargazerHistogram = props => {
  const { className, repoid, ...rest } = props;
  const [stargazerData, stargazerLoading] = useFetch(
    `api/repo/${repoid}/stargazers`
  );
  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Stargazer Histogram"
      />
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          {stargazerLoading ? (
            "Loading..."
          ) : (
            <Plot
              data={[
                {
                  type: 'scatter',
                  x: stargazerData.x,
                  y: stargazerData.y,
                  mode: 'lines',
                  name: 'Red',
                  line: {
                    color: 'rgb(219, 64, 82)',
                    width: 3
                  }
                }
              ]}
              layout={{
                margin: {
                  t: 50
                },
                autosize: true,
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

StargazerHistogram.propTypes = {
  className: PropTypes.string
};

export default StargazerHistogram;
