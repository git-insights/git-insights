import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  useUserState,
} from 'context';
import {
  useParams,
  useLocation,
  useHistory,
} from "react-router-dom";
import {
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Container,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
      // list-style-type:none;
      padding: 0,
      justifyContent: "flex-end"
  },
  repoControl: {
    minWidth: 120,
    marginRight: 'auto',
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(-2),
  },
  dateControl: {
    minWidth: 120,
    marginBottom: theme.spacing(3),
    marginTop: theme.spacing(-2),
  }
}));

const RepositoryNavigator = props => {
  const { repositories } = useUserState();
  const { repoid } = useParams();
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();

  const handleChange = (event) => {
    const targetRepoId = event.target.value;
    const path = location.pathname.split('/');
    path[2] = targetRepoId;
    history.push(path.join('/'));
  }

  return (
    <Container className={classes.root} maxWidth="xl">
      <FormControl className={classes.repoControl}>
        <InputLabel id="repo-select-label">Repository</InputLabel>
        <Select
          labelId="repo-select-label"
          id="repo-select"
          value={repoid}
          onChange={handleChange}
        >
          {
            repositories.map(repo => {
              return (<MenuItem key={repo.id} value={repo.id}>{repo.full_name}</MenuItem>)
            })
          }
        </Select>
      </FormControl>
      <FormControl className={classes.dateControl}>
        <InputLabel id="date-select-label">Time Frame</InputLabel>
        <Select
          labelId="date-select-label"
          id="date-select"
          value={1}
        >
          <MenuItem value={1}>Last 14 days</MenuItem>
        </Select>
      </FormControl>
    </Container>
  );
}

export default RepositoryNavigator;
