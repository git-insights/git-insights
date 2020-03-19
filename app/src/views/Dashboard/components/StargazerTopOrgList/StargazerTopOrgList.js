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

const StargazerTopOrgList = props => {
  const { className, repoid, ...rest } = props;
  const [stargazerData, stargazerLoading] = useFetch(
    `api/repo/${repoid}/stargazer-orgs-top10`
  );

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Top 10 Organizations"
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
                      <TableCell>Organization</TableCell>
                      <TableCell>Stargazer Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stargazerData.map(org => (
                      <TableRow
                        hover
                        key={`${org.name}${org.count}`}
                      >
                        <TableCell>{org.name}</TableCell>
                        <TableCell>{org.count}</TableCell>
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

StargazerTopOrgList.propTypes = {
  className: PropTypes.string
};

export default StargazerTopOrgList;
