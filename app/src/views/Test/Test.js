import React, { Component } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import { GithubLogin } from '../../components';

// import { Notifications, Password } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

class Test extends Component {
  constructor() {
    super();
    this.state = {
      isAuthenticated: false,
      user: null,
      token: ''
    };
  }

  componentDidMount() {
    const code =
      window.location.href.match(/\?code=(.*)/) &&
      window.location.href.match(/\?code=(.*)/)[1];
    if (code) {
      // this.setState({ status: STATUS.LOADING });
      const tokenBlob = new Blob([JSON.stringify({verification_code: code}, null, 2)], {type : 'application/json'});
      const options = {
          method: 'POST',
          body: tokenBlob,
          mode: 'cors',
          cache: 'default'
      };
      fetch('http://localhost:8000/auth/github', options)
        .then(r => {
          const token = r.headers.get('x-auth-token');
          r.json().then(user => {
              if (token) {
                this.setState({
                  isAuthenticated: true,
                  user,
                  token
                });
              }
          });
        })
    }
  }

  logout = () => {
    this.setState({isAuthenticated: false, token: '', user: null})
  };

  onFailure = (error) => {
    alert(error);
  };

  githubResponse = (response) => {
    const tokenBlob = new Blob([JSON.stringify({access_token: response.accessToken}, null, 2)], {type : 'application/json'});
    const options = {
        method: 'POST',
        body: tokenBlob,
        mode: 'cors',
        cache: 'default'
    };
    fetch('http://localhost:8000/auth/github', options).then(r => {
        const token = r.headers.get('x-auth-token');
        r.json().then(user => {
            if (token) {
                this.setState({isAuthenticated: true, user, token})
            }
        });
    })
  };

  render() {
    let content = !!this.state.isAuthenticated ?
    (
        <div>
            <p>Authenticated</p>
            <div>
                {this.state.user.email}
            </div>
            <div>
                <button onClick={this.logout} className="button">
                    Log out
                </button>
            </div>
        </div>
    ) :
    (
        <div>
          login
            <GithubLogin
                // clientId={config.GOOGLE_CLIENT_ID}
                buttonText="Login"
                // onSuccess={this.googleResponse}
                onFailure={this.onFailure}
            />
        </div>
    );

    return (
        <div className="App">
            {content}
        </div>
    );
  }
};

export default Test;
