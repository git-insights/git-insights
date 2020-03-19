import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Divider, Drawer } from '@material-ui/core';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ErrorIcon from '@material-ui/icons/Error';
import AssignmentIcon from '@material-ui/icons/Assignment';
import CodeIcon from '@material-ui/icons/Code';
import PeopleIcon from '@material-ui/icons/People';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import ImageIcon from '@material-ui/icons/Image';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import SettingsIcon from '@material-ui/icons/Settings';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { useUser } from 'context';

import { Profile, SidebarNav } from './components';

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
  const { user } = useUser();

  const classes = useStyles();

  const pages = [];

  pages.push(
    {
      title: 'Dashboard',
      href: `/repo/${user.primaryRepo}/dashboard`,
      icon: <DashboardIcon/>
    },
    {
      title: 'Code',
      href: `/repo/${user.primaryRepo}/code`,
      icon: <CodeIcon/>
    },
    {
      title: 'Reviews',
      href: `/repo/${user.primaryRepo}/reviews`,
      icon: <AssignmentIcon/>
    },
    {
      title: 'Issues',
      href: `/repo/${user.primaryRepo}/issues`,
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
