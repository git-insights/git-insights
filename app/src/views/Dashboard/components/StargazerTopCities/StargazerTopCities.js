import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip
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

const StargazerTopCities = props => {
  const { className, repoid, ...rest } = props;
  const [stargazerData, stargazerLoading] = useFetch(
    `api/repo/${repoid}/stargazer-topcities`
  );

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Top 10 Cities"
      />
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          {stargazerLoading ? (
            "Loading..."
          ) : (
            <PerfectScrollbar>
              <div className={classes.inner}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>City</TableCell>
                      <TableCell>Country</TableCell>
                      <TableCell sortDirection="desc">
                        <Tooltip
                          enterDelay={300}
                          title="Sort"
                        >
                          <TableSortLabel
                            active
                            direction="desc"
                          >
                            Count
                          </TableSortLabel>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stargazerData.map(location => (
                      <TableRow
                        hover
                        key={`${location.city}${location.country}`}
                      >
                        <TableCell>{location.city}</TableCell>
                        <TableCell>{location.country}</TableCell>
                        <TableCell>{location.count}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </PerfectScrollbar>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

StargazerTopCities.propTypes = {
  className: PropTypes.string
};

export default StargazerTopCities;
