import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import {
  Dashboard as DashboardIcon,
  Error as ErrorIcon,
  Assignment as AssignmentIcon,
  Code as CodeIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';
import { useUserState } from 'context';
import { Profile, SidebarNav } from './components';
import {
  useParams
} from "react-router-dom";

const useStyles = makeStyles(theme => ({
  drawer: {
    width: 240,
    [theme.breakpoints.up('lg')]: {
      marginTop: 64,
      height: 'calc(100% - 64px)'
    }
  },
  root: {
    backgroundColor: theme.palette.white,
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    padding: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;
  const { profile: user } = useUserState();

  const { repoid } = useParams();
  const classes = useStyles();

  const userRepoId = repoid || user.primaryRepo;

  const pages = [];

  pages.push(
    {
      title: 'Dashboard',
      href: `/repo/${userRepoId}/dashboard`,
      icon: <DashboardIcon/>
    },
    {
      title: 'Code',
      href: `/repo/${userRepoId}/code`,
      icon: <CodeIcon/>
    },
    {
      title: 'Reviews',
      href: `/repo/${userRepoId}/reviews`,
      icon: <AssignmentIcon/>
    },
    {
      title: 'Issues',
      href: `/repo/${userRepoId}/issues`,
      icon: <ErrorIcon/>
    },
    {
      type: 'divider'
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: <SettingsIcon />
    }
  );

  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >
      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <Profile />
        <Divider className={classes.divider} />
        <SidebarNav
          className={classes.nav}
          pages={pages}
        />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
