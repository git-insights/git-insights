import React, { useState, useEffect } from 'react';
import { Link as RouterLink, withRouter, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import validate from 'validate.js';
import { makeStyles } from '@material-ui/styles';
import {
  Grid,
  Button,
  IconButton,
  TextField,
  Link,
  Typography
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
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

const SignIn = props => {
  const { history } = props;
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [isError, setIsError] = useState(false);
  // const { authTokens, setAuthTokens } = useAuth();
  // const { setUser } = useUser();

  const classes = useStyles();

  // const handleSignIn = event => {
  //   event.preventDefault();
  //   history.push('/');
  // };

  // useEffect(() => {
  //   console.log('Inside useEffect')

  //   const code =
  //   window.location.href.match(/\?code=(.*)/) &&
  //   window.location.href.match(/\?code=(.*)/)[1];

  //   if (code) {
  //     console.log('here')
  //     // this.setState({ status: STATUS.LOADING });
  //     const tokenBlob = new Blob(
  //       [JSON.stringify({verification_code: code}, null, 2)],
  //       { type: 'application/json' }
  //     );
  //     const options = {
  //       method: 'POST',
  //       body: tokenBlob,
  //       mode: 'cors',
  //       cache: 'default'
  //     };
  //     fetch(`${process.env.REACT_APP_API_SERVER}/api/auth/github`, options)
  //       .then(result => {
  //         if (result.status === 200) {
  //           const token = result.headers.get('x-auth-token');
  //           result.json().then(user => {
  //             if (token) {
  //               setUser(user);
  //               setAuthTokens({token});
  //               setLoggedIn(true);
  //             }
  //           }).catch(e => {
  //             console.log(`Err: ${e}`);
  //             setIsError(true);
  //           }) ;
  //         } else {
  //           console.log(`Error`);
  //           setIsError(true);
  //         }
  //       }).catch(e => {
  //         console.log(`Err: ${e}`);
  //         setIsError(true);
  //       })
  //   }
  // }, []);

  // if (isLoggedIn || authTokens) {
  //   return <Redirect to="/" push={true} />;
  // }

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
              {/* <div className={classes.person}>
                <Typography
                  className={classes.name}
                  variant="body1"
                >
                  Rohan Relan
                </Typography>
                <Typography
                  className={classes.bio}
                  variant="body2"
                >
                  4x entrepreneur, former Tech Lead at Google
                </Typography>
              </div> */}
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
            {/* <div className={classes.contentHeader}>
              <IconButton onClick={handleBack}>
                <ArrowBackIcon />
              </IconButton>
            </div> */}
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
