// @flow weak

import React, { Component, PropTypes } from 'react';
import Drawer from 'material-ui/Drawer';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { spacing, typography, zIndex } from 'material-ui/styles';
import { cyan500 } from 'material-ui/styles/colors';

const SelectableList = makeSelectable(List);

const styles = {
  logo: {
    cursor: 'pointer',
    fontSize: 24,
    color: typography.textFullWhite,
    lineHeight: `${spacing.desktopKeylineIncrement}px`,
    fontWeight: typography.fontWeightLight,
    backgroundColor: cyan500,
    paddingLeft: spacing.desktopGutter,
    marginBottom: 8,
  },
  version: {
    paddingLeft: spacing.desktopGutterLess,
    fontSize: 16,
  },
};

class AppNavDrawer extends Component {
  static propTypes = {
    docked: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    onChangeList: PropTypes.func.isRequired,
    onRequestChangeNavDrawer: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    style: PropTypes.object,
  };

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired,
    router: PropTypes.object.isRequired,
  };

  state = {
    muiVersions: [],
  };

  // componentDidMount() {
  //   const self = this;
  //   const url = '/versions.json';
  //   const request = new XMLHttpRequest();

  //   request.onreadystatechange = function() {
  //     if (request.readyState === 4 && request.status === 200) {
  //       self.setState({
  //         muiVersions: JSON.parse(request.responseText),
  //         version: JSON.parse(request.responseText)[0],
  //       });
  //     }
  //   };

  //   request.open('GET', url, true);
  //   request.send();
  // }

  firstNonPreReleaseVersion() {
    let version;
    for (let i = 0; i < this.state.muiVersions.length; i++) {
      version = this.state.muiVersions[i];
      // If the version doesn't contain '-' and isn't 'HEAD'
      if (!/-/.test(version) && version !== 'HEAD') {
        break;
      }
    }
    return version;
  }

  handleVersionChange = (event, index, value) => {
    if (value === this.firstNonPreReleaseVersion()) {
      window.location = 'http://www.material-ui.com/';
    } else {
      window.location = `http://www.material-ui.com/${value}`;
    }
  };

  currentVersion() {
    if (window.location.hostname === 'localhost') return this.state.muiVersions[0];
    if (window.location.pathname === '/') {
      return this.firstNonPreReleaseVersion();
    }

    return window.location.pathname.replace(/\//g, '');
  }

  handleRequestChangeLink = (event, value) => {
    window.location = value;
  };

  handleTouchTapHeader = () => {
    this.context.router.push('/');
    this.props.onRequestChangeNavDrawer(false);
  };

  render() {
    const {
      location,
      docked,
      onRequestChangeNavDrawer,
      onChangeList,
      open,
      style,
    } = this.props;

    return (
      <Drawer
        style={style}
        docked={docked}
        open={open}
        onRequestChange={onRequestChangeNavDrawer}
        containerStyle={{ zIndex: zIndex.drawer - 100 }}
      >
        <div style={styles.logo} onTouchTap={this.handleTouchTapHeader}>
          Material-UI
        </div>
        <span style={styles.version}>Version:</span>
        <DropDownMenu
          value={this.currentVersion()}
          onChange={this.handleVersionChange}
          maxHeight={300}
          style={{ width: 181 }}
        >
          {this.state.muiVersions.map((version) => (
            <MenuItem
              key={version}
              value={version}
              primaryText={version}
            />
          ))}
        </DropDownMenu>
        <SelectableList
          value={location.pathname}
          onChange={onChangeList}
        >
          <ListItem
            primaryText="Get Started"
            primaryTogglesNestedList
            nestedItems={[
              <ListItem primaryText="Required Knowledge" value="/get-started/required-knowledge" />,
              <ListItem primaryText="Installation" value="/get-started/installation" />,
              <ListItem primaryText="Usage" value="/get-started/usage" />,
              <ListItem primaryText="Server Rendering" value="/get-started/server-rendering" />,
              <ListItem primaryText="Examples" value="/get-started/examples" />,
            ]}
          />
          <ListItem
            primaryText="Customization"
            primaryTogglesNestedList
            nestedItems={[
              <ListItem primaryText="Themes" value="/customization/themes" />,
              <ListItem primaryText="Styles" value="/customization/styles" />,
              <ListItem primaryText="Colors" value="/customization/colors" />,
            ]}
          />
          <ListItem
            primaryText="Components"
            primaryTogglesNestedList
            nestedItems={[
              <ListItem
                primaryText="App Bar"
                value="/components/app-bar"
                href="#/components/app-bar"
              />,
              <ListItem
                primaryText="Auto Complete"
                value="/components/auto-complete"
                href="#/components/auto-complete"
              />,
              <ListItem
                primaryText="Avatar"
                value="/components/avatar"
                href="#/components/avatar"
              />,
              <ListItem
                primaryText="Badge"
                value="/components/badge"
                href="#/components/badge"
              />,
            ]}
          />
          <ListItem
            primaryText="Discover More"
            primaryTogglesNestedList
            nestedItems={[
              <ListItem primaryText="Community" value="/discover-more/community" />,
              <ListItem primaryText="Contributing" value="/discover-more/contributing" />,
              <ListItem primaryText="Related projects" value="/discover-more/related-projects" />,
            ]}
          />
        </SelectableList>
        <Divider />
        <SelectableList
          value=""
          onChange={this.handleRequestChangeLink}
        >
          <Subheader>Resources</Subheader>
          <ListItem primaryText="GitHub" value="https://github.com/callemall/material-ui" />
          <ListItem primaryText="React" value="http://facebook.github.io/react" />
          <ListItem
            primaryText="Material Design"
            value="https://www.google.com/design/spec/material-design/introduction.html"
          />
        </SelectableList>
      </Drawer>
    );
  }
}

export default AppNavDrawer;
