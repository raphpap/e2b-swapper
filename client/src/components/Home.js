import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { NavLink } from "react-router-dom";
import { Button, Paper, Grid, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    width: '100%'
  },
  titleContainer: {
    textAlign: 'left',
    padding: '60px 100px 0 100px',
  },
  message: {
    marginTop: '24px',
    maxWidth: '600px'
  },
  link: {
    textDecoration: 'none'
  },
  start: {
    marginTop: '24px'
  },
  howToUseContainer: {
    textAlign: 'center',
    padding: '60px 100px 0 100px',
  },
  steps: {
    marginTop: '36px',
  },
  ethPaper: {
    margin: '0 8px',
    overflow: 'hidden',
    textAlign: 'left'
  },
  ethHeader: {
    background: '#33365f',
    color: '#fff',
    padding: '8px 48px',
    textAlign: 'center'
  },
  btcPaper: {
    margin: '0 8px',
    overflow: 'hidden',
    textAlign: 'left'
  },
  btcHeader: {
    background: '#ff8800',
    color: '#fff',
    padding: '8px',
    textAlign: 'center'
  },
  ethItem: {
    display: 'block',
    textDecoration: 'none',
    margin: '24px 12px 0',
    borderBottom: `2px solid transparent`,
    "&.active": {
      borderBottom: `2px solid #33365f`
    }
  },
  btcItem: {
    display: 'block',
    textDecoration: 'none',
    margin: '24px 12px 0',
    borderBottom: `2px solid transparent`,
    "&.active": {
      borderBottom: `2px solid #FF8800`
    }
  },
  ethButton: {
    fontSize: '15px',
    padding: '0px 4px',
    fontWeight: 500,
    color: '#33365f'
  },
  btcButton: {
    fontSize: '15px',
    padding: '0px 4px',
    fontWeight: 500,
    color: '#FF8800'
  },
  text: {
    marginLeft: '16px',
    marginBottom: '24px'
  }
});

export default function Home() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <Typography variant="h3" color="inherit" className={classes.title}>
          Welcome to LinkSwap
        </Typography>
        <Typography variant="h6" color="inherit" className={classes.message}>
          LinkSwap is the first step towards a truly trustless way to trade Ethereum for Bitcoin in a peer-to-peer fashion.
        </Typography>


        <NavLink to="/contract/create" className={classes.link}>
          <Button
            color="secondary"
            className={classes.start}
            variant="contained"
          >
            Get Started
          </Button>
        </NavLink>
      </div>

      <div className={classes.howToUseContainer}>
        <Typography variant="h3" color="inherit" className={classes.title}>
          How To Use
        </Typography>

        <Grid container direction="row" className={classes.steps}>
          <Grid item xs={12} md={6}>
            <Paper className={classes.ethPaper}>
              <Typography variant="h6" className={classes.ethHeader}>
                Trade your ETH
              </Typography>

              <NavLink to="/contract/create" className={classes.ethItem}>
                <Button className={classes.ethButton}>
                  Step 1 - Create contract
                </Button>
              </NavLink>
              <Typography variant="body2" className={classes.text}>
                Creates a contract with an offer (ETH), a request (BTC) and a requested collateral (ETH). Indentify the contract using you own BTC address. Ideally, that address would be brand new and have a length of less than 32 characters.
              </Typography>

              <NavLink to="/contract/cancel" className={classes.ethItem}>
                <Button className={classes.ethButton}>
                  Optionnal - Cancel contract
                </Button>
              </NavLink>
              <Typography variant="body2" className={classes.text}>
                You can cancel the contract and retrieve your funds if it hasn't been accepted yet, or if the timelapse (4 hours) has passed after acceptation. Once cancelled, the contract cannot be seen anymore and that address cannot be used once again.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper className={classes.btcPaper}>
              <Typography variant="h6" className={classes.btcHeader}>
                Trade your BTC
              </Typography>

              <NavLink to="/contract/accept" className={classes.btcItem}>
                <Button color="secondary" className={classes.btcButton}>
                  Step 1 - Accept contract
                </Button>
              </NavLink>
              <Typography variant="body2" className={classes.text}>
                Use an external platform (such as a subreddit) to find someone offering to trade ETH. You can view his contract's information by inputting his requesting BTC address.
              </Typography>

              <div className={classes.btcItem}>
                <Button color="secondary" className={classes.btcButton}>
                  Step 2 - BTC payment
                </Button>
              </div>
              <Typography variant="body2" className={classes.text}>
                From you own BTC private wallet, send the <b>exact</b> BTC amount to the requester's BTC address <b>in a single transaction</b>. <b>Keep note of the transaction ID</b>.
              </Typography>

              <NavLink to="/contract/fullfill" className={classes.btcItem}>
                <Button color="secondary" className={classes.btcButton}>
                  Step 3 - Fullfill contract
                </Button>
              </NavLink>
              <Typography variant="body2" className={classes.text}>
                Once your BTC transaction has reached at least 6 confirmations, trigger the contract validation. The contract will validate the external BTC transaction using the Honeycomb Oracle through Tatum's Blockchain API. If the confirmation is validated, you will receive the requester's ETH as well as your collateral back.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
