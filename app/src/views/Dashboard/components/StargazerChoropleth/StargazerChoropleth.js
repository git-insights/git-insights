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

const StargazerChoropleth = props => {
  const { className, repoid, ...rest } = props;
  const [stargazerData, stargazerLoading] = useFetch(
    `api/repo/${repoid}/stargazer-countries`
  );

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Countries"
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
                  type: 'choropleth',
                  locations: Object.keys(stargazerData),
                  z: Object.values(stargazerData),
                  text: Object.keys(stargazerData),
                  locationmode: 'country names',
                  colorscale: [
                      [0,'rgb(5, 10, 172)'],[0.35,'rgb(40, 60, 190)'],
                      [0.5,'rgb(70, 100, 245)'], [0.6,'rgb(90, 120, 245)'],
                      [0.7,'rgb(106, 137, 247)'],[1,'rgb(220, 220, 220)']],
                  autocolorscale: false,
                  reversescale: true,
                  tick0: 0,
                  zmin: 0,
                  dtick: 1000,
                }
              ]}
              layout={{
                margin: {
                  t: 50
                },
                autosize: true,
                geo:{
                    showframe: false,
                    showcoastlines: false,
                    showcountries: true,
                    projection:{
                        type: 'natural earth',
                    }
                }
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

StargazerChoropleth.propTypes = {
  className: PropTypes.string
};

export default StargazerChoropleth;
