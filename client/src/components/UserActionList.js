import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import { Button, Grid } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    display: 'block',
    width: '100%'
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0
  },
  item: {
    display: 'block',
    textDecoration: 'none'
  },
  button: {
    fontSize: '14px',
    margin: '12px',
    padding: '8px',
    fontWeight: 500
  }
});

export default function UserActionList() {
  const classes = useStyles();

  return (
    <nav className={classes.root}>
      <ul className={classes.menu}>
        <li>
          <Link to="/create" className={classes.item}>
            <Button color="secondary" className={classes.button}>
              Create contract
            </Button>
          </Link>
        </li>
        <li >
          <Link to="/cancel" className={classes.item}>
            <Button color="secondary" className={classes.button}>
              Cancel contract
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/accept" className={classes.item}>
            <Button color="secondary" className={classes.button}>
              Accept contract
            </Button>
          </Link>
        </li>
        <li>
          <Link to="/fullfill" className={classes.item}>
            <Button color="secondary" className={classes.button}>
              Fullfill contract
            </Button>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
