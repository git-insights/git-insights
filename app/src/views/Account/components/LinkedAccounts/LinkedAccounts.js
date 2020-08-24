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
} from '@material-ui/core';
import { useUserState } from 'context';
import {
  Github
} from 'icons';

const useStyles = makeStyles(theme => ({
  root: {},
  button: {
    margin: theme.spacing(1)
  }
}));

const AccountDetails = props => {
  const { className, ...rest } = props;
  const { profile: user } = useUserState();
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
          title="Linked Accounts"
        />
        <Divider />
        <CardContent>
          <Typography gutterBottom>
            If you are the owner of any organizations or repos, revoking your GitHub authorization will result in an interruption of service. No new commits will be imported.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            className={classes.button}
            startIcon={<Github />}
            href={`https://github.com/settings/installations/${user.githubAppId}`}
            target='_blank'
          >
            Manage Github Connection
          </Button>
        </CardContent>
      </form>
    </Card>
  );
};

AccountDetails.propTypes = {
  className: PropTypes.string
};

export default AccountDetails;
