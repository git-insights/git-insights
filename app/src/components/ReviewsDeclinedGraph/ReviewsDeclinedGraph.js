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


const ReviewsDeclinedGraph = props => {
  const { /*className,*/ repoid } = props;
  const [data, dataLoading] = useFetch(
    `api/repo/${repoid}/reviews/rejected`
  );
  // const classes = useStyles();

  return (
    <BaseChartCard
      dataLoading={dataLoading}
      title="How many Pull Requests were rejected?"
    >
      <Plot
        data={data}
        layout={{
          margin: {
            t: 50
          },
          yaxis: {
            fixedrange: true,
            title: 'Pull Requests',
            rangemode: 'nonnegative',
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

ReviewsDeclinedGraph.propTypes = {
  className: PropTypes.string
};

export default ReviewsDeclinedGraph;
