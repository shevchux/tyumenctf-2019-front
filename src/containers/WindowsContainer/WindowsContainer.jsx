import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./styles.scss";
import { WindowContainer } from "../WindowContainer/WindowContainer";

class _WindowsContainer extends React.Component {
  render() {
    return (
      <div className="windows-container" ref={ref => (this.container = ref)}>
        {this.props.tabIds.map(id => (
          <WindowContainer tabId={id} key={id} />
        ))}
      </div>
    );
  }
}

_WindowsContainer.propTypes = {
  tabIds: PropTypes.arrayOf(PropTypes.number),
};

const mapStateToProps = state => ({
  tabIds: state.desktop.tabs.map(({ id }) => id).sort((a, b) => a - b),
});

export const WindowsContainer = connect(mapStateToProps)(_WindowsContainer);
