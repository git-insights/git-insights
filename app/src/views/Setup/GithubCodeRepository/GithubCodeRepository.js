import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  useUserState,
  useUserDispatch,
  getGithubRepositories,
  changePrimaryRepo,
} from 'context';
import { Grid, Typography, Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

import {
  RepoPicker,
} from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  },
  image: {
    marginTop: 50,
    display: 'inline-block',
    maxWidth: '100%',
    width: 400
  },
  gridSection: {
    marginTop: theme.spacing(6)
  }
}));

const CodeRepository = () => {
  const history = useHistory();
  const {
    profile,
    githubRepositories,
    statusOfGithubRepositories,
  } = useUserState();
  const userDispatch = useUserDispatch();
  const classes = useStyles();

  const pickPrimaryRepo = async repoId => {
    const repo = githubRepositories.find(repo => repo.id === repoId);
    await changePrimaryRepo(userDispatch, repo);
    history.push(`/repo/${repoId}/dashboard`);
  }

  useEffect(() => {
    if (profile.trackingRepo) {
      history.push(`/repo/${profile.primaryRepo}/dashboard`);
      return;
    }

    if (statusOfGithubRepositories === 'idle' && githubRepositories.length === 0) {
      getGithubRepositories(userDispatch);
    }
  }, [profile, statusOfGithubRepositories, githubRepositories, userDispatch, history]);

  return (
      <Container>
        <Grid
          container
          justify="center"
          alignItems="center"
          className={classes.gridSection}
        >
          <Grid item md={6} style={{textAlign: "center"}}>
            <img
              alt="Under development"
              className={classes.image}
              src="/images/undraw_fill_in_mie5.svg"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h2" gutterBottom={true}>
              One last step!
            </Typography>
            <Typography variant="subtitle1" gutterBottom={true}>
              Please select the repository you want to track
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          justify="center"
          alignItems="center"
          spacing={3}
          className={classes.gridSection}
        >
          <RepoPicker
            isLoading={
              statusOfGithubRepositories === 'idle' ||
              statusOfGithubRepositories === 'pending'
            }
            repos={githubRepositories}
            pickPrimaryRepo={pickPrimaryRepo}
          />
        </Grid>
      </Container>
  )
};

export default CodeRepository;
