import React from "react";
import blue from "@material-ui/core/colors/blue";
import { makeStyles } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import { Grid, Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    margin: '24px',
    padding: '24px',
    width: 'calc(100% - 96px)'
  },
  mainTitle: {
    marginBottom: '24px'
  },
  input: {
    marginBottom: '24px',
    textAlign: 'left'
  },
  subtitle: {
    marginTop: '24px',
    background: `${blue[500]}`,
    color: '#fff',
    width: '100%'
  },
  row: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.2)',
    padding: '4px'
  },
  title: {
    fontSize: '14px',
    fontWeight: 500,
    textAlign: 'right',
    overflowY: 'scroll'
  },
  value: {
    fontSize: '14px',
    opacity: 0.8,
    textAlign: 'right',
    overflowY: 'scroll',
    paddingLeft: '8px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});

export default function SwapContractReader(props) {
  const classes = useStyles();
  const {
    web3,
    onChange,
    exists,
    offeredEth,
    requestedBtc,
    requestedEthCollateral,
    endsAt,
    eEthAddress,
    eBtcAddress,
    bEthAddress,
    transactionHash,
    nbConfirmations,
    voutAddress,
    voutValue,
    fullfilled
  } = props;

  return (
    <Paper className={classes.root}>
      <Typography variant="h6" color="inherit" className={classes.mainTitle}>
        Contract Explorer
      </Typography>

      <Grid container justify="center" align="center" item xs={12}>
        <Grid item xs={12}>
          <TextField
            id="eBtcAddress"
            className={classes.input}
            value={eBtcAddress}
            onChange={e => onChange(e.target.value)}
            label="Contract Identifier (Receiving BTC Address)"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid container item xs={12} direction="row">

          <Grid container item xs={12}>
            <Typography variant="subtitle1" color="inherit" className={classes.subtitle}>
              Contract Information
            </Typography>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>Exists: </Grid>
            <Grid item xs={8} className={classes.value}>{exists ? "Yes" : "No"}</Grid>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>Fullfilled: </Grid>
            <Grid item xs={8} className={classes.value}>{fullfilled && "Yes"}</Grid>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>Offered: </Grid>
            <Grid item xs={8} className={classes.value}>{offeredEth && web3.utils.fromWei(offeredEth, 'ether')} ETH</Grid>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>Requested: </Grid>
            <Grid item xs={8} className={classes.value}>{requestedBtc} BTC</Grid>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>Collateral: </Grid>
            <Grid item xs={8} className={classes.value}>{requestedEthCollateral && web3.utils.fromWei(requestedEthCollateral, 'ether')} ETH</Grid>
          </Grid>

          <Grid container item xs={12}>
            <Typography variant="subtitle1" color="inherit" className={classes.subtitle}>
              ETH User Information
            </Typography>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>BTC address: </Grid>
            <Grid item xs={8} className={classes.value}>{eBtcAddress}</Grid>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>ETH address: </Grid>
            <Grid item xs={8} className={classes.value}>{eEthAddress}</Grid>
          </Grid>

          <Grid container item xs={12}>
            <Typography variant="subtitle1" color="inherit" className={classes.subtitle}>
              BTC User Information
            </Typography>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>ETH address: </Grid>
            <Grid item xs={8} className={classes.value}>{bEthAddress !== '0x0000000000000000000000000000000000000000' && bEthAddress}</Grid>
          </Grid>

          <Grid container item xs={12}>
            <Typography variant="subtitle1" color="inherit" className={classes.subtitle}>
              BTC Transaction Confirmation
            </Typography>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>Fullfill before: </Grid>
            <Grid item xs={8} className={classes.value}>{(endsAt === '0' || endsAt === null) ? '' : new Date(parseInt(endsAt)*1000).toISOString()}</Grid>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>Transaction hash: </Grid>
            <Grid item xs={8} className={classes.value}>{transactionHash}</Grid>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>Nb. confirmations: </Grid>
            <Grid item xs={8} className={classes.value}>{nbConfirmations}</Grid>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>Receiving address: </Grid>
            <Grid item xs={8} className={classes.value}>{voutAddress}</Grid>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>Received value: </Grid>
            <Grid item xs={8} className={classes.value}>{voutValue}</Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
