import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
import { makeStyles } from '@material-ui/styles';
import { BaseChartCard } from 'components';
import { useFetch } from 'helpers';

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
  const { className, repoid, ...rest } = props;
  const [data, dataLoading] = useFetch(
    `api/repo/${repoid}/activity-dates-times`
  );
  const classes = useStyles();

  return (
    <BaseChartCard
      dataLoading={dataLoading}
      title="Activity Dates and Times"
    >
      <Plot
        data={data}
        layout={{
          margin: {
            t: 50
          },
          yaxis: {
            type: 'category',
            fixedrange: true,
            gridcolor: 'transparent'
          },
          xaxis: {
            type: 'category',
            fixedrange: true,
            gridcolor: 'transparent'
          },
          autosize: true,
        }}
        config={{
          displayModeBar: false
        }}
        useResizeHandler={true}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </BaseChartCard>
  );
};

ActivityDatesAndTimesGraph.propTypes = {
  className: PropTypes.string
};

export default ActivityDatesAndTimesGraph;
