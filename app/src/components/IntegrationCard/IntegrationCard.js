import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, CardActions, Divider, Typography, Button } from '@material-ui/core';

// The usage of React.forwardRef will no longer be required for react-router-dom v6.
// see https://github.com/ReactTraining/react-router/issues/6056
// const AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />);

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: '4px',
    alignItems: 'center',
    padding: theme.spacing(1),
    display: 'flex',
    flexBasis: 420
  },

  input: {
    flexGrow: 1,
    fontSize: '14px',
    lineHeight: '16px',
    letterSpacing: '-0.05px'
  },

  icon: {
    width: '64px',
    height: '64px',
    marginBottom: theme.spacing(1)
  },
  card: {
    minWidth: 275,
  },
  cardContents: {
    textAlign: 'center'
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  pos: {
    marginBottom: 12,
  },
}));

const IntegrationCard = props => {
  const {
    actionDisabled,
    actionLabel,
    icon,
    serviceDesc,
    serviceName,
    // onChange,
    url = '#',
    // ...rest
  } = props;

  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent
        className={classes.cardContents}
      >
        <img
          alt="Under development"
          className={classes.icon}
          src={icon}
        />
        <Typography className={classes.title} gutterBottom>
          {serviceName}
        </Typography>
        <Typography variant="body2" component="p">
          {serviceDesc}
        </Typography>
      </CardContent>
      <Divider variant="middle" />
      <CardActions>
        <Button
          // component={AdapterLink}
          size="small"
          color="primary"
          variant="outlined"
          disabled={actionDisabled}
          href={url}
        >
          {actionLabel}
        </Button>
      </CardActions>
    </Card>
  );
};

IntegrationCard.propTypes = {
  actionDisabled: PropTypes.bool,
  actionLabel: PropTypes.string,
  url: PropTypes.string,
  onChange: PropTypes.func,
  icon: PropTypes.string,
  serviceName: PropTypes.string,
  serviceDesc: PropTypes.string,
};

export default IntegrationCard;
