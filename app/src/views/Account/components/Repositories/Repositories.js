import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
  Button,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  IconButton,
  ListItemText,
  ListItemSecondaryAction,
} from '@material-ui/core';
import {
  Delete as DeleteIcon,
} from '@material-ui/icons';
import { useUser } from 'context';
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
  const { user, fns } = useUser();
  const classes = useStyles();

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
          <Typography variant="body2" component="p">
            <div className={classes.demo}>
              <List>
                {user.repos.map(repo => {
                  return (
                    <ListItem>
                      <ListItemIcon>
                        <RepoIcon className={classes.avatarIcon}/>
                      </ListItemIcon>
                      <ListItemText primary={repo.full_name} />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )})
                }
              </List>
            </div>
          </Typography>
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
