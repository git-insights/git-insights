import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { useUser } from 'context';
import { objectToParams } from 'helpers';
import { IntegrationCard } from 'components';
import { Grid, Typography, Container } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    marginBottom: theme.spacing(6)
  },
  loadingGrid: {
    marginTop: theme.spacing(10),
    marginBottom: theme.spacing(10)
  }
}));


const CodeRepository = () => {
  const [repoData, setRepoData] = useState(null);
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
    fns.fetchUserRepoPage(page)
      .then(data => {
        setRepoData(data);
      })
      .catch(err => console.log(err));
  }

  if (navigate || user.trackingRepo) {
    // Redirect to repo stats
    return (<Redirect to={`/repo/${user.primaryRepo}/dashboard`} />);
  }

  if (!repoData) {
    fetchRepoData(1);
  }

  return (
    user ?
      <Container>
        <Grid
          container
          justify="center"
          alignItems="center"
          className={classes.gridSection}
        >
          <Grid item xs={12} md={6}>
            <Typography variant="h2" gutterBottom={true}>
              Welcome to Git Insights!
            </Typography>
            <Typography variant="subtitle1" gutterBottom={true}>
              Please pick a source code repository host to begin
            </Typography>
            {/* <p>Please select the repo you want to track:</p> */}
          </Grid>
          <Grid item md={6}>
            <img
              alt="Under development"
              className={classes.image}
              src="/images/undraw_select_option_y75i.svg"
            />
          </Grid>
        </Grid>
        <Grid
          container
          justify="center"
          alignItems="center"
          spacing={3}
          className={classes.gridSection}
        >
          <Grid item xs={12} sm={4}>
            <IntegrationCard
              icon="/images/external-logos/github.png"
              serviceName="Github"
              serviceDesc="Github is a web-based version control repository hosting service owned by Microsoft."
              actionLabel="Connect"
              actionDisabled={false}
              url={`${process.env.REACT_APP_API_SERVER}/api/auth/github-app/connect`}
            ></IntegrationCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <IntegrationCard
              icon="/images/external-logos/bitbucket.png"
              serviceName="Bitbucket"
              serviceDesc="Bitbucket is a web-based version control repository hosting service owned by Atlassian."
              actionLabel="Coming Soon"
              actionDisabled={true}
            ></IntegrationCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <IntegrationCard
              icon="/images/external-logos/gitlab.png"
              serviceName="GitLab"
              serviceDesc="GitLab is a web-based version control repository hosting service owned by GitLab."
              actionLabel="Coming Soon"
              actionDisabled={true}
            ></IntegrationCard>
          </Grid>
          <Grid item xs={12} sm={4}>
            <IntegrationCard
              icon="/images/external-logos/git.png"
              serviceName="Custom Git"
              serviceDesc="Use the Custom Git option if you are self-hosting or using another service."
              actionLabel="Coming Soon"
              actionDisabled={true}
            ></IntegrationCard>
          </Grid>
            {/* <RepoPicker
              repos={repoData}
              fetchRepos={fetchRepoData}
              pickPrimaryRepo={pickPrimaryRepo}
            /> */}
        </Grid>
      </Container>
    :
      <Container>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          className={classes.loadingGrid}
        >
          <Grid item>
            <CircularProgress />
          </Grid>
        </Grid>
      </Container>
  )
};

export default CodeRepository;
