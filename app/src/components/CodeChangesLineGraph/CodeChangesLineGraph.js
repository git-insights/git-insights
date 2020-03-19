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


const CodeChangesLineGraph = props => {
  const { className, repoid, ...rest } = props;
  const [data, dataLoading] = useFetch(
    `api/repo/${repoid}/code/line-changes`
  );
  const classes = useStyles();

  return (
    <BaseChartCard
      dataLoading={dataLoading}
      title="How many lines of code were touched by changes?"
    >
      <Plot
        data={data}
        layout={{
          margin: {
            t: 50
          },
          yaxis: {
            fixedrange: true,
            title: 'lines',
            rangemode: 'nonnegative'
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

CodeChangesLineGraph.propTypes = {
  className: PropTypes.string
};

export default CodeChangesLineGraph;
