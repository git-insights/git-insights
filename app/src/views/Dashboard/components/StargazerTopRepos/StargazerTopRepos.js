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

const StargazerTopRepos = props => {
  const { className, repoid, ...rest } = props;
  const [stargazerData, stargazerLoading] = useFetch(
    `api/repo/${repoid}/stargazer-toprepos`
  );

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Top 10 Repositories"
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
                      <TableCell>Name</TableCell>
                      <TableCell>Shared Stargazer</TableCell>
                      <TableCell>Repo Stargazer</TableCell>
                      <TableCell>Language</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stargazerData.map(repo => (
                      <TableRow
                        hover
                        key={repo.repo_id}
                      >
                        <TableCell>
                          <a href={repo.html_url} target='_blank'>
                            {repo.full_name}
                          </a>
                        </TableCell>
                        <TableCell>{repo.count}</TableCell>
                        <TableCell>{repo.stargazers_count}</TableCell>
                        <TableCell>{repo.language}</TableCell>
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

StargazerTopRepos.propTypes = {
  className: PropTypes.string
};

export default StargazerTopRepos;
