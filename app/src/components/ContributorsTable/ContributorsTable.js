import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/styles';
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TableFooter,
  TablePagination,
  Grid,
  CircularProgress,
  Typography,
} from '@material-ui/core';
import {
  FirstPage as FirstPageIcon,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  LastPage as LastPageIcon,
} from '@material-ui/icons';
import { useFetch } from 'helpers';

const useStyles1 = makeStyles(theme => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  }
}));


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = event => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = event => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = event => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = event => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const ContributorsTable = props => {
  const { className, repoid, ...rest } = props;
  const [data, dataLoading] = useFetch(
    `api/repo/${repoid}/contributors`
  );

  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const rowsPerPage = 5;
  let emptyRows = 0;

  if (data) {
    emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div {...rest} className={clsx(classes.root, className)}>
      <Paper className={classes.paper}>
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
          <div>
            <TableContainer>
              <Table className={classes.table} aria-label="custom pagination table">
                <TableHead>
                  <TableRow>
                    <TableCell>Contributor Name</TableCell>
                    <TableCell align="right">Total Contributions</TableCell>
                    <TableCell align="right">Code Contributions</TableCell>
                    <TableCell align="right">Issue Contributions</TableCell>
                    <TableCell align="right">Code Reviews</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(rowsPerPage > 0
                    ? data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    : data
                  ).map(row => (
                    <TableRow key={row.name}>
                      <TableCell component="th" scope="row">
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.total}</TableCell>
                      <TableCell align="right">{row.code}</TableCell>
                      <TableCell align="right">{row.issues}</TableCell>
                      <TableCell align="right">{row.reviews}</TableCell>
                    </TableRow>
                  ))}

                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>

                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
            <TablePagination
              colSpan={3}
              count={data.length}
              component="div"
              rowsPerPage={5}
              page={page}
              onChangePage={handleChangePage}
              rowsPerPageOptions={[]}
              ActionsComponent={TablePaginationActions}
            />
          </div>
        )}
      </Paper>
    </div>
  );
};

ContributorsTable.propTypes = {
  className: PropTypes.string
};

export default ContributorsTable;
