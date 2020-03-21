import React from 'react';
import PropTypes from 'prop-types';
import Plot from 'react-plotly.js';
// import { makeStyles } from '@material-ui/styles';
import { BaseChartCard } from 'components';
import { useFetch } from 'helpers';

// const useStyles = makeStyles(() => ({
//   root: {},
//   chartContainer: {
//     height: 400,
//     position: 'relative'
//   },
//   actions: {
//     justifyContent: 'flex-end'
//   },
//   cardActionBtn: {
//     top: '4px',
//     right: '4px',
//   }
// }));

const IssuesResponseTimeGraph = props => {
  const { /*className,*/ repoid } = props;
  const [data, dataLoading] = useFetch(
    `api/repo/${repoid}/issues/avg-response-time`
  );
  // const classes = useStyles();

  return (
    <BaseChartCard
      dataLoading={dataLoading}
      title="How long did it take on average to first respond to an Issue?"
    >
      <Plot
        data={data}
        layout={{
          margin: {
            t: 50
          },
          yaxis: {
            fixedrange: true,
            title: 'Hours',
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

IssuesResponseTimeGraph.propTypes = {
  className: PropTypes.string
};

export default IssuesResponseTimeGraph;
