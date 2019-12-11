import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import { Button, Grid, Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    width: 'calc(100% - 48px)',
    margin: '24px',
  },
  ethPaper: {
    margin: '0 8px',
    overflow: 'hidden'
  },
  ethHeader: {
    background: '#33365f',
    color: '#fff',
    padding: '8px'
  },
  btcPaper: {
    margin: '0 8px',
    overflow: 'hidden'
  },
  btcHeader: {
    background: '#ff8800',
    color: '#fff',
    padding: '8px'
  },
  menu: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    listStyle: 'none',
    margin: 0,
    padding: 0
  },
  ethItem: {
    display: 'block',
    textDecoration: 'none',
    margin: '12px',
    borderBottom: `2px solid transparent`,
    "&.active": {
      borderBottom: `2px solid #33365f`
    }
  },
  btcItem: {
    display: 'block',
    textDecoration: 'none',
    margin: '12px',
    borderBottom: `2px solid transparent`,
    "&.active": {
      borderBottom: `2px solid #FF8800`
    }
  },
  ethButton: {
    fontSize: '13px',
    padding: '0px 4px',
    fontWeight: 500,
    color: '#33365f'
  },
  btcButton: {
    fontSize: '13px',
    padding: '0px 4px',
    fontWeight: 500,
    color: '#FF8800'
  }
});

export default function UserActionList() {
  const classes = useStyles();

  return (
    <nav className={classes.root}>
      <Grid container direction="row">
        <Grid item xs={6}>
          <Paper className={classes.ethPaper}>
            <Typography variant="h6" className={classes.ethHeader}>
              Sell your ETH
            </Typography>

            <ul className={classes.menu}>
              <li>
                <NavLink to="/create" className={classes.ethItem} activeClassName={'active'}>
                  <Button className={classes.ethButton}>
                    Create contract
                  </Button>
                </NavLink>
              </li>
              <li >
                <NavLink to="/cancel" className={classes.ethItem} activeClassName={'active'}>
                  <Button className={classes.ethButton}>
                    Cancel contract
                  </Button>
                </NavLink>
              </li>
            </ul>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.btcPaper}>
            <Typography variant="h6" className={classes.btcHeader}>
              Trade your BTC
            </Typography>

            <ul className={classes.menu}>
              <li>
                <NavLink to="/accept" className={classes.btcItem} activeClassName={'active'}>
                  <Button color="secondary" className={classes.btcButton}>
                    Accept contract
                  </Button>
                </NavLink>
              </li>
              <li>
                <NavLink to="/fullfill" className={classes.btcItem} activeClassName={classes.active}>
                  <Button color="secondary" className={classes.btcButton}>
                    Fullfill contract
                  </Button>
                </NavLink>
              </li>
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </nav>
  );
}
