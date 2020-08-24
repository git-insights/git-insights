import React, { useEffect, useState } from 'react';
import {
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Checkbox,
  CircularProgress,
  Grid,
  Typography,
  Box,
} from '@material-ui/core';
import {
  Launch as LaunchIcon
} from '@material-ui/icons';
import {
  Github as GithubIcon,
} from 'icons';
import clsx from 'clsx';
import { FixedSizeList as List } from 'react-window';
import { makeStyles } from '@material-ui/styles';
import {
  useUserState,
  useUserDispatch,
  getGithubRepositories,
  addRepositories
} from 'context';

const useStyles = makeStyles(theme => ({
  root: {},
  repoList: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  repoLink: {
    marginLeft: theme.spacing(1)
  },
  loadingContainer: {
    height: '250px',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  }
}));

const ImportRepoButton = props => {
  const {
    user,
    className,
    style,
  } = props;
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const {
    repositories,
    githubRepositories,
    statusOfGithubRepositories,
  } = useUserState();
  const userDispatch = useUserDispatch();
  const isLoading = statusOfGithubRepositories === 'idle' || statusOfGithubRepositories === 'pending';
  const [selectedRepos, setSelectedRepos] = useState({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedRepos({});
    setOpen(false);
  };

  const handleCloseImport = () => {
    const selectedRepoIndexes = Object.entries(selectedRepos).filter(pair => pair[1] === true).map(pair => pair[0]);
    const newRepositories = selectedRepoIndexes.map(repoIndex => {
      const repo = githubRepositories[repoIndex];
      return {
        description: repo.description,
        full_name: repo.full_name,
        id: repo.id,
        name: repo.name,
        url: repo.url,
        processed: false,
      };
    });

    if (newRepositories.length > 0) {
      addRepositories(userDispatch, newRepositories);
    }

    handleClose();
    setOpen(false);
  }

  const handleChange = (event) => {
    setSelectedRepos({
      ...selectedRepos,
      [event.target.name]: event.target.checked
    });
  };

  useEffect(() => {
    if (open && statusOfGithubRepositories === 'idle') {
      getGithubRepositories(userDispatch, repositories);
    }
  }, [open, repositories, statusOfGithubRepositories, userDispatch]);

  const Row = ({ index, style }) => (
    <div style={{
      ...style,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }} >
      <div style={{
        flex: 1,
        display: "inline-flex",
        alignItems: "center",
        height: "100%",
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: "0%",
        paddingRight: "10px"
      }}>
        <GithubIcon />
      </div>
      <div style={{
        flex: 1
      }}>
          <Typography variant="body1" display="inline">
            {githubRepositories[index].full_name}
          </Typography>
          <IconButton
            aria-label="launch"
            href={githubRepositories[index].html_url}
            target="_blank"
            rel="noopener"
            size="small"
            className={classes.repoLink}
          >
            <LaunchIcon fontSize="small" />
          </IconButton>
      </div>
      <div style={{}}>
        <Checkbox
          checked={selectedRepos[index]}
          onChange={handleChange}
          color="primary"
          name={index.toString()}
          inputProps={{ 'aria-label': 'primary checkbox' }}
        />
      </div>
    </div>
  );

  return (
    <Box
      className={clsx(classes.root, className)}
      style={style}
    >
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Import Repository from GitHub
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth="sm"
      >
        <DialogTitle id="alert-dialog-title">Import new GitHub repository?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Select a GitHub repository to automatically track events:
          </DialogContentText>
          {
            isLoading
              ? <Grid container className={classes.loadingContainer}>
                  <CircularProgress />
                  <br />
                  <Typography>Loading...</Typography>
                </Grid>
              : <List
                  height={250}
                  itemCount={githubRepositories.length}
                  itemSize={35}
                  className={classes.repoList}
                >
                  {Row}
                </List>
          }
          <DialogContentText id="alert-dialog-subnote">
            Edit your <Link href={`https://github.com/apps/${process.env.REACT_APP_GH_APP_NAME}/installations/${user.githubAppId}`} target="_blank" rel="noreferrer">repository access</Link> settings on GitHub.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCloseImport} color="primary" autoFocus>
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ImportRepoButton;
