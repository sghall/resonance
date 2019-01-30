// @flow

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Link from 'react-router/lib/Link'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import SunburstDemo from './demos/node-group/Example3'

const styles = () => ({
  root: {
    marginTop: 30,
    textAlign: 'center',
  },
})

function Home(props) {
  const classes = props.classes

  return (
    <Grid container alignItems="center" justify="space-around">
      <Grid item xs={12} className={classes.root}>
        <Typography variant="h3">
          Resonance
        </Typography>
        <Typography variant="body1">
          React Animation Library
        </Typography>
      </Grid>
      <Grid item xs={12} md={8} className={classes.root}>
        <SunburstDemo />
      </Grid>
      <Grid item xs={12} className={classes.root}>
        <Button component={Link} variant="outlined" to="/demos/node-group">
          More Demos
        </Button>
      </Grid>
    </Grid>
  )
}

Home.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(Home)
