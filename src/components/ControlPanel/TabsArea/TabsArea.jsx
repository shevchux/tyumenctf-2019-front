import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ControlPanelTab } from "../../ControlPanelTab/ControlPanelTab";
import "./styles.scss";

class TabsAreaContainer extends React.Component {
  render() {
    return (
      <div className="cpanel-tab-list">
        <ul>
          {this.props.tabIds.map(tabId => (
            <li key={tabId}>
              <ControlPanelTab id={tabId} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

TabsAreaContainer.propTypes = {
  tabIds: PropTypes.arrayOf(PropTypes.number),
};

const mapStateToProps = state => ({
  tabIds: state.desktop.tabs.map(({ id }) => id).sort((t1, t2) => t1 - t2),
});

export const TabsArea = connect(mapStateToProps)(TabsAreaContainer);
