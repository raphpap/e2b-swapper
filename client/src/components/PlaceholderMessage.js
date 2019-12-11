import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    width: '100%'
  }
});

export default function PlaceholderMessage(props) {
  const classes = useStyles();
  const {eBtcAddress} = props;

  return (
    <div className={classes.root}>
      <Grid container item xs={12}>
        <Grid item xs>
          <Typography variant="h6" color="inherit">
            {eBtcAddress === "" ? (
              "Please enter a Contract Identifier (BTC address)"
            ) : (
              "Please select an action"
            )}
          </Typography>
        </Grid>
      </Grid>
    </div>
  );
}
