import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { IconButton } from '@material-ui/core';
import InputIcon from '@material-ui/icons/Input';
import { useAuth } from 'context';

const useStyles = makeStyles(theme => ({
  signOutButton: {
    marginLeft: theme.spacing(1)
  }
}));

const LogoutButton = props => {
  const classes = useStyles();
  const { logout } = useAuth();
  const [navigate, setNavigating] = useState(false);

  if (navigate) {
    logout();
    setNavigating(false);
  }

  return (
    <IconButton
      className={classes.signOutButton}
      color="inherit"
      onClick={()=>setNavigating(true)}
    >
      <InputIcon />
    </IconButton>
  )
}

export default LogoutButton;
