import React from 'react';
import PropTypes from 'prop-types';
import { objectToParams } from 'helpers';

const getIsMobile = () => {
  let isMobile = false;

  try {
    isMobile = !!((window.navigator && window.navigator.standalone) || navigator.userAgent.match('CriOS') || navigator.userAgent.match(/mobile/i));
  } catch (ex) {
    // continue regardless of error
  }

  return isMobile;
};

class GithubLogin extends React.Component {

  static propTypes = {
    isDisabled: PropTypes.bool,
    // callback: PropTypes.func.isRequired,
    // appId: PropTypes.string.isRequired,
    xfbml: PropTypes.bool,
    cookie: PropTypes.bool,
    authType: PropTypes.string,
    scope: PropTypes.string,
    state: PropTypes.string,
    responseType: PropTypes.string,
    returnScopes: PropTypes.bool,
    redirectUri: PropTypes.string,
    autoLoad: PropTypes.bool,
    disableMobileRedirect: PropTypes.bool,
    isMobile: PropTypes.bool,
    fields: PropTypes.string,
    version: PropTypes.string,
    language: PropTypes.string,
    onClick: PropTypes.func,
    onFailure: PropTypes.func,
    render: PropTypes.func.isRequired,
  };

  static defaultProps = {
    redirectUri: typeof window !== 'undefined' ? window.location.href : '/',
    scope: 'public_profile,email',
    returnScopes: false,
    xfbml: false,
    cookie: false,
    authType: '',
    fields: 'name',
    version: '3.1',
    language: 'en_US',
    disableMobileRedirect: false,
    isMobile: getIsMobile(),
    onFailure: null,
    state: 'facebookdirect',
    responseType: 'code',
  };

  state = {
    isProcessing: false,
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  setStateIfMounted(state) {
    if (this._isMounted) {
      this.setState(state);
    }
  }

  checkLoginState = (response) => {
    this.setStateIfMounted({ isProcessing: false });
    if (response.authResponse) {
      this.responseApi(response.authResponse);
    } else {
      if (this.props.onFailure) {
        this.props.onFailure({ status: response.status });
      } else {
        this.props.callback({ status: response.status });
      }
    }
  };

  checkLoginAfterRefresh = (response) => {
    if (response.status === 'connected') {
      this.checkLoginState(response);
    } else {
      window.FB.login(loginResponse => this.checkLoginState(loginResponse), true);
    }
  };

  click = (e) => {
    if (this.state.isProcessing || this.props.isDisabled) {
      return;
    }
    this.setState({ isProcessing: true });
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick(e);
      if (e.defaultPrevented) {
        this.setState({ isProcessing: false });
        return;
      }
    }

    const params = {
      client_id: process.env.REACT_APP_GH_ID,
      redirect_uri: process.env.REACT_APP_GH_REDIRECT_URL,
      // state,
      // login
    };

    window.location.href = `${process.env.REACT_APP_API_SERVER}/api/auth/github${objectToParams(params)}`;
  };

  render() {
    const { render } = this.props;

    if (!render) {
      throw new Error('ReactGithubLogin requires a render prop to render');
    }

    const propsForRender = {
      onClick: this.click,
      isDisabled: !!this.props.isDisabled,
      isProcessing: this.state.isProcessing,
    };
    return this.props.render(propsForRender);
  }
}

export default GithubLogin;
