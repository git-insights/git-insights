import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LaunchIcon from '@material-ui/icons/Launch';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  Grid,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  buttonGrid: {
    marginTop: theme.spacing(4),
  },
  cardRoot: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  cardContent: {
    height: '120px',
  },
  textBlock: {
    overflow: 'hidden',
    position: 'relative',
    lineHeight: '1.2em',
    maxHeight: '4.8em',
    textAlign: 'justify',
    marginRight: '-1em',
    paddingRight: '1em',
    '&::before': {
      content: "'...'",
      position: 'absolute',
      right: 0,
      bottom: 0,
    },
    '&::after': {
      content: "''",
      position: 'absolute',
      right: 0,
      width: '1em',
      height: '1em',
      marginTop: '0.2em',
      background: theme.palette.background.paper,
    }
  },
  loadingContainer: {
    height: '400px',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }
}));

export default function RepoPickerList(props) {
  const classes = useStyles();
  const { repos, fetchRepos, pickPrimaryRepo, isLoading } = props;

  const selectPrimaryRepo = (repoId) => {
    // TODO: err if no repo found
    const repo = repos.data.find((repo) => repo.id === repoId);
    pickPrimaryRepo({
      owner: repo.owner.login,
      repo: repo.name
    });
  }

  const getNextPage = () => {
    fetchRepos(repos.nextPage);
  }

  const getPreviousPage = () => {
    fetchRepos(repos.prevPage);
  }

  return (
    !isLoading ?
      <Grid container spacing={1} direction="column" alignItems="center">
        <Grid item container spacing={4}>
          {repos.data.map(repo => {
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={repo.id}>
                <Card className={classes.cardRoot}>
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {repo.full_name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary"
                      component="p" className={classes.textBlock}>
                        {repo.description}
                    </Typography>
                  </CardContent>
                  <Divider variant="middle" />
                  <CardActions>
                    <Button size="small" color="primary" variant="outlined"
                      startIcon={<LaunchIcon />} href={repo.html_url} target="_blank">
                      Visit
                    </Button>
                    <Button size="small" color="primary" variant="outlined"
                      onClick={() => selectPrimaryRepo(repo.id)}
                    >
                      Connect
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        <Grid item className={classes.buttonGrid}>
          <ButtonGroup>
            {repos.prevPage ? (
              <Button onClick={getPreviousPage}>Previous</Button>
            ) : (
              <Button disabled>Previous</Button>
            )}
            {repos.nextPage ? (
              <Button onClick={getNextPage}>Next</Button>
            ) : (
              <Button disabled>Next</Button>
            )}
          </ButtonGroup>
        </Grid>
      </Grid>
    :
      <Grid container className={classes.loadingContainer}>
        <CircularProgress />
        <br />
        <Typography>Loading...</Typography>
      </Grid>
  );
}