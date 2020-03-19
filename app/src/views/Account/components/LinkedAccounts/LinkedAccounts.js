import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Grid,
  Button,
  TextField,
  Typography,
} from '@material-ui/core';
import { useUser } from 'context';
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
  const { user, fns } = useUser();

  const classes = useStyles();

  // const [values, setValues] = useState({
  //   firstName: 'Shen',
  //   lastName: 'Zhi',
  //   email: 'shen.zhi@devias.io',
  //   phone: '',
  //   state: 'Alabama',
  //   country: 'USA'
  // });

  // const handleChange = event => {
  //   setValues({
  //     ...values,
  //     [event.target.name]: event.target.value
  //   });
  // };

  // const states = [
  //   {
  //     value: 'alabama',
  //     label: 'Alabama'
  //   },
  //   {
  //     value: 'new-york',
  //     label: 'New York'
  //   },
  //   {
  //     value: 'san-francisco',
  //     label: 'San Francisco'
  //   }
  // ];

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
