import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Chip,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  IconButton,
  ListItemText,
  ListItemSecondaryAction,
  CircularProgress,
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
} from '@material-ui/icons';
import {
  useUserState,
  useUserDispatch,
  removeRepository,
} from 'context';
import {
  Repo as RepoIcon,
} from 'icons';
import ImportRepoButton from './ImportRepoButton';

const useStyles = makeStyles(theme => ({
  root: {},
  button: {
    margin: theme.spacing(1)
  },
  avatarIcon: {
    color: 'inherit'
  },
  importRepoButton: {
    marginTop: theme.spacing(2),
  }
}));

const Repositories = props => {
  const { className, ...rest } = props;
  const { profile: user, repositories } = useUserState();
  const userDispatch = useUserDispatch();

  const classes = useStyles();

  // Delete existing Repos
  const handleRepoDelete = (repoId) => {
    removeRepository(userDispatch, repoId);
  };

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <form
        autoComplete="off"
        noValidate
      >
        <CardHeader
          title="Repositories"
        />
        <Divider />
        <CardContent>
          <Typography gutterBottom>
            Currently tracking the following repositories:
          </Typography>
          {/* <Typography variant="body2" component="p"> */}
            <div className={classes.demo}>
              <List>
                {repositories.map(repo => {
                  return (
                    <ListItem key={repo.id}>
                      <ListItemIcon>
                        <RepoIcon className={classes.avatarIcon}/>
                      </ListItemIcon>
                      <ListItemText primary={repo.full_name} />
                      <ListItemSecondaryAction>
                        {
                          user.primaryRepo === repo.id &&
                          <Chip label="Primary" size="small" />
                        }
                        {
                          repo.processed === true
                            ? <IconButton
                                edge="end"
                                aria-label="delete"
                                onClick={() => handleRepoDelete(repo.id)}
                                disabled={user.primaryRepo === repo.id}
                              >
                                <DeleteIcon />
                              </IconButton>
                            : <CircularProgress size={20} />
                        }
                      </ListItemSecondaryAction>
                    </ListItem>
                  )})
                }
              </List>
            </div>
          {/* </Typography> */}
          <Typography component="p">
            In order to add more GitHub repositories to Git Insights, click below:
          </Typography>
          <ImportRepoButton user={user} className={classes.importRepoButton}/>
        </CardContent>
      </form>
    </Card>
  );
};

Repositories.propTypes = {
  className: PropTypes.string
};

export default Repositories;
