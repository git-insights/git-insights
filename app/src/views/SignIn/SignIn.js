import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Typography
} from '@material-ui/core';
import { GithubLogin } from 'components';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%'
  },
  grid: {
    height: '100%'
  },
  quoteContainer: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    }
  },
  quote: {
    backgroundColor: theme.palette.primary.main,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundImage: 'url(/images/auth.jpg)',
    // backgroundSize: 'cover',
    // backgroundRepeat: 'no-repeat',
    // backgroundPosition: 'center',
    flexDirection: 'column'
  },
  quoteInner: {
    textAlign: 'center',
    flexBasis: '125px'
  },
  logo: {
    textAlign: 'center',
    flexBasis: '80px',
    width: '250px',
  },
  logoSVG: {
    width: '100%',
  },
  quoteText: {
    color: theme.palette.white,
    fontWeight: 300
  },
  name: {
    marginTop: theme.spacing(3),
    color: theme.palette.white
  },
  bio: {
    color: theme.palette.white
  },
  contentContainer: {},
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: theme.spacing(5),
    paddingBototm: theme.spacing(2),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  logoImage: {
    marginLeft: theme.spacing(4)
  },
  contentBody: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.down('md')]: {
      justifyContent: 'center'
    }
  },
  form: {
    paddingLeft: 100,
    paddingRight: 100,
    paddingBottom: 125,
    flexBasis: 700,
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2)
    }
  },
  title: {
    marginTop: theme.spacing(3)
  },
  socialButtons: {
    marginTop: theme.spacing(3)
  },
  socialIcon: {
    marginRight: theme.spacing(1)
  },
  sugestion: {
    marginTop: theme.spacing(2)
  },
  textField: {
    marginTop: theme.spacing(2)
  },
  signInButton: {
    margin: theme.spacing(2, 0)
  }
}));

const SignIn = _props => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        className={classes.grid}
        container
      >
        <Grid
          className={classes.quoteContainer}
          item
          lg={5}
        >
          <div className={classes.quote}>
            <div className={classes.logo}>
              <img
                className={classes.logoSVG}
                alt="Logo"
                src="/images/logos/logo--white.svg"
              />
            </div>
            <div className={classes.quoteInner}>
              <Typography
                className={classes.quoteText}
                variant="h2"
              >
                Gain visibility into your software projects and teams
              </Typography>
            </div>
          </div>
        </Grid>
        <Grid
          className={classes.content}
          item
          lg={7}
          xs={12}
        >
          <div className={classes.content}>
            <div className={classes.contentBody}>
              <div className={classes.form}>
                <Typography
                  className={classes.title}
                  variant="h2"
                >
                  Sign in
                </Typography>
                <Typography
                  color="textSecondary"
                  gutterBottom
                >
                  Sign in with your Github account
                </Typography>
                <Grid
                  className={classes.socialButtons}
                  container
                  spacing={2}
                >
                  <Grid item>
                    <GithubLogin/>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

SignIn.propTypes = {
  history: PropTypes.object
};

export default withRouter(SignIn);
