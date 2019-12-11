import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { TextField } from "@material-ui/core";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    padding: '24px',
    width: 'calc(100% - 48px)'
  },
  input: {
    marginBottom: '24px',
    textAlign: 'left'
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
    paddingLeft: '8px'
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
    voutValue
  } = props;

  return (
    <div className={classes.root}>
      <Grid container justify="center" align="center" item xs={12}>
        <Grid item xs={12}>
          <TextField
            id="eBtcAddress"
            className={classes.input}
            value={eBtcAddress}
            onChange={e => onChange(e.target.value)}
            label="Contract Identifier (Btc Address)"
            fullWidth
            variant="outlined"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid container item xs={12} direction="row">
          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>Contract exists: </Grid>
            <Grid item xs={8} className={classes.value}>{exists ? "Yes" : "No"}</Grid>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>Offered ETH: </Grid>
            <Grid item xs={8} className={classes.value}>{offeredEth && web3.utils.fromWei(offeredEth, 'ether')} ETH</Grid>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>Requested BTC: </Grid>
            <Grid item xs={8} className={classes.value}>{requestedBtc} BTC</Grid>
          </Grid>


          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>Requested ETH collateral: </Grid>
            <Grid item xs={8} className={classes.value}>{requestedEthCollateral && web3.utils.fromWei(requestedEthCollateral, 'ether')} ETH</Grid>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>Ends at: </Grid>
            <Grid item xs={8} className={classes.value}>{(endsAt === '0' || endsAt === null) ? '' : new Date(parseInt(endsAt)*1000).toISOString()}</Grid>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>E-user ETH address: </Grid>
            <Grid item xs={8} className={classes.value}>{eEthAddress}</Grid>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>E-user BTC address: </Grid>
            <Grid item xs={8} className={classes.value}>{eBtcAddress}</Grid>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>B-user ETH address: </Grid>
            <Grid item xs={8} className={classes.value}>{bEthAddress !== '0x0000000000000000000000000000000000000000' && bEthAddress}</Grid>
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
            <Grid item xs={4} className={classes.title}>vOut address: </Grid>
            <Grid item xs={8} className={classes.value}>{voutAddress}</Grid>
          </Grid>

          <Grid container item xs={12} className={classes.row}>
            <Grid item xs={4} className={classes.title}>vOut value: </Grid>
            <Grid item xs={8} className={classes.value}>{voutValue}</Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
