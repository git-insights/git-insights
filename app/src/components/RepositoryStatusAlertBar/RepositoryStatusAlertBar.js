import React from 'react';
import { makeStyles } from '@material-ui/styles';
import MuiAlert from '@material-ui/lab/Alert';
import { useUserState } from 'context';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(2)
  }
}));

const RepositoryStatusAlertBar = props => {
  const { repoId } = props;
  const { repositories } = useUserState();
  const classes = useStyles();

  // eslint-disable-next-line eqeqeq
  const repoIndex = repositories.findIndex(repo => repo.id == repoId);
  const repoProcessed = repoIndex !== -1 && repositories[repoIndex].processed === true;

  // If repo processed we don't need to render anything
  if (repoProcessed) return null;

  return (
    <div className={classes.root}>
      <MuiAlert elevation={1} severity="warning">
        Processing historical data, graphs will be available soon.
      </MuiAlert>
    </div>
  );
};

RepositoryStatusAlertBar.propTypes = {
  repoId: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ])
};

export default RepositoryStatusAlertBar;
