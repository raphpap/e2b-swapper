import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { Grid } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

export default function CancelForm() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid item xs>
        <Typography variant="h6" color="inherit">
          Cancel
        </Typography>
      </Grid>
    </div>
  );
}
