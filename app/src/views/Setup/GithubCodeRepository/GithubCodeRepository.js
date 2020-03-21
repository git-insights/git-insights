import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useUser } from 'context';
import { Grid, Typography, Container } from '@material-ui/core';
import { Redirect } from 'react-router-dom';

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
  const [repoData, setRepoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [navigate, setNavigating] = useState(false);
  const { user, fns } = useUser();
  const classes = useStyles();

  const pickPrimaryRepo = (repo) => {
    fns.postUserPrimaryRepo(repo)
      .then(data => {
          user.primaryRepo = data.repoId;
          user.trackingRepo = true;
          setNavigating(true);
      })
      .catch(err => console.log(err))
  }

  const fetchRepoData = (page) => {
    setLoading(true);
    fns.fetchUserRepoPage(page)
      .then(data => {
        setRepoData(data);
        setLoading(false);
      })
      .catch(err => console.log(err));
  }

  useEffect(() => {
    if (!repoData) {
      fetchRepoData(1);
    }
  });

  if (navigate || user.trackingRepo) {
    // Redirect to repo stats
    return (<Redirect to={`/repo/${user.primaryRepo}/dashboard`} />);
  }

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
            isLoading={loading}
            repos={repoData}
            fetchRepos={fetchRepoData}
            pickPrimaryRepo={pickPrimaryRepo}
          />
        </Grid>
      </Container>
  )
};

export default CodeRepository;
