import React from 'react';
import PropTypes from 'prop-types';
import GithubLogin from './GithubLogin';
import { Github as GithubIcon } from 'icons';
import { Button } from '@material-ui/core';
// import { makeStyles } from '@material-ui/styles';

// const useStyles = makeStyles(theme => ({
//   socialIcon: {
//     marginRight: theme.spacing(1)
//   },
// }));

// https://www.w3.org/TR/html5/disabled-elements.html#disabled-elements
const _shouldAddDisabledProp = (tag) => [
  'button',
  'input',
  'select',
  'textarea',
  'optgroup',
  'option',
  'fieldset',
].indexOf((tag + '').toLowerCase()) >= 0;

// TODO: rewrite this as react function
class GithubLoginButton extends React.Component {
  static propTypes = {
    textButton: PropTypes.string,
    typeButton: PropTypes.string,
    size: PropTypes.string,
    cssClass: PropTypes.string,
    icon: PropTypes.any,
    containerStyle: PropTypes.object,
    buttonStyle: PropTypes.object,
    tag: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  static defaultProps = {
    textButton: 'Login with Facebook',
    typeButton: 'button',
    size: 'metro',
    fields: 'name',
    cssClass: 'kep-login-facebook',
    tag: 'button',
  };

  // style() {
  //   const defaultCSS = this.constructor.defaultProps.cssClass;
  //   if (this.props.cssClass === defaultCSS) {
  //     return <style dangerouslySetInnerHTML={{ __html: styles }}></style>;
  //   }
  //   return false;
  // }

  containerStyle(renderProps) {
    const { isProcessing, isSdkLoaded, isDisabled } = renderProps;

    const style = { transition: 'opacity 0.5s' };
    if (isProcessing || !isSdkLoaded || isDisabled) {
      style.opacity = 0.6;
    }
    return Object.assign(style, this.props.containerStyle);
  }

  renderOwnButton(renderProps) {
    // const classes = useStyles();

    const { onClick, isDisabled } = renderProps;

    const optionalProps = {};
    if (isDisabled && _shouldAddDisabledProp(this.props.tag)) {
      optionalProps.disabled = true;
    }
    return (
      <Button
        color="primary"
        onClick={onClick}
        size="large"
        variant="contained"
        {...optionalProps}
      >
        {/* <GithubIcon className={classes.socialIcon} /> */}
        <GithubIcon style={{ marginRight: '10px' }}/>
        Login with Github
      </Button>
    );
  }

  render() {
    return (
      <GithubLogin {...this.props} render={renderProps => this.renderOwnButton(renderProps)} />
    );
  }
}

export default GithubLoginButton;