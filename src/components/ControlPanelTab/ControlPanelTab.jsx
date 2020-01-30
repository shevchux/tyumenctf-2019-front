import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import * as UI from "../UI";
import { connect } from "react-redux";
import { frontTab, hideTab } from "../../actions/desktop";

class ControlPanelTabContainer extends React.Component {
  render() {
    const { id, title, icon, active, hidden, frontTab, hideTab } = this.props;
    return (
      <div
        className={`cpanel-tab${active ? " cpanel-tab-active" : ""}`}
        onClick={() => active ? hideTab(id) : frontTab(id)}
        title={title + (hidden ? " (скрыто)" : "")}
      >
        <div className="cpanel-tab-content">
          {icon && <UI.Icon small id={icon} className="cpanel-tab-icon" />}
          {title}
        </div>
      </div>
    );
  }
}

ControlPanelTabContainer.propTypes = {
  id: PropTypes.number,
  active: PropTypes.bool,
  hidden: PropTypes.bool,
  icon: PropTypes.string,
  title: PropTypes.string,
  frontTab: PropTypes.func,
  hideTab: PropTypes.func
};

const mapStateToProps = (state, ownProps) => {
  const tabIndex = state.desktop.tabs.findIndex(tab => tab.id === ownProps.id);
  const tab = state.desktop.tabs[tabIndex];
  const { title, icon, hidden } = tab.render;
  return {
    active: !tab.render.hidden && state.desktop.tabs.length - 1 === tabIndex,
    title,
    icon,
    hidden,
  };
};

const mapDispatchToProps = dispatch => ({
  frontTab: id => dispatch(frontTab(id)),
  hideTab: id => dispatch(hideTab(id)),
});

export const ControlPanelTab = connect(
  mapStateToProps,
  mapDispatchToProps
)(ControlPanelTabContainer);
