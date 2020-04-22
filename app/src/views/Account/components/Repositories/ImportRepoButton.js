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
  Switch,
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
import { apiClient } from 'helpers';
import { makeStyles } from '@material-ui/styles';

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
  const { user, className, style, ...rest } = props;
  const [open, setOpen] = useState(false);
  const [requested, setRequested] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const classes = useStyles();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (event) => {
    // const newData = [...data];
    // newData[event.target.name] = {...newData[event.target.name], 'checked': event.target.checked };
    // setData(newData);
  };

  useEffect(() => {
    if (open && !requested) {
      const fetchData = async () => {
        setIsLoading(true);

        try {
          let response = await apiClient('api/user/github-repos/all');
          // filter by id
          const userRepos = user.repos.map(repo => repo.id);
          response = response.filter(repo => userRepos.indexOf(repo.id) === -1)
          setData(response);
        } catch (err) {
          console.log(err);
          setData([]);
        }

        setIsLoading(false);
      }
      fetchData();
      setRequested(true);
    }
  }, [open]);

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
            {data[index].full_name}
          </Typography>
          <IconButton
            aria-label="launch"
            href={data[index].html_url}
            target="_blank"
            rel="noopener"
            size="small"
            className={classes.repoLink}
          >
            <LaunchIcon fontSize="small" />
          </IconButton>
      </div>
      <div style={{}}>
        <Switch
          checked={data[index].checked}
          onChange={handleChange}
          color="primary"
          name={index}
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
                  itemCount={data.length}
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
          <Button onClick={handleClose} color="primary" autoFocus>
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ImportRepoButton;