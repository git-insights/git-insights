import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Avatar, Typography } from '@material-ui/core';
import { useUser } from 'context';
import ContentLoader from "react-content-loader"

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 'fit-content'
  },
  avatar: {
    width: 60,
    height: 60
  },
  name: {
    marginTop: theme.spacing(1)
  }
}));

const ProfileLoader = () => (
  <ContentLoader
    height={130}
    width={240}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="60" y="80" rx="1" ry="1" width="120" height="24" />
    <rect x="85" y="110" rx="1" ry="1" width="70" height="18" />
    <circle cx="120" cy="30" r="30" />
  </ContentLoader>
)

const Profile = props => {
  const { className, ...rest } = props;
  let { user } = useUser();

  const classes = useStyles();

  return (
    !user
    ?
      <ProfileLoader/>
    :
    <div
      {...rest}
      className={clsx(classes.root, className)}
    >
      <Avatar
        alt="Person"
        className={classes.avatar}
        component={RouterLink}
        src={user.picture}
        to="/settings"
      />
      <Typography
        className={classes.name}
        variant="h4"
      >
        {`${user.firstName} ${user.lastName}`}
      </Typography>
      <Typography variant="body2">{user.location}</Typography>
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
