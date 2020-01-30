import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";

export class WindowTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeTabId: props.activeTabId };
  }

  componentDidMount() {
    this.tabs = React.Children.map(this.props.children, child => ({
      ...child.props,
    }));
    this.setState({});
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.tabs = React.Children.map(props.children, child => ({
      ...child.props,
    }));
    this.setState({});
  }

  render() {
    if (!this.tabs) return null;
    const currentTab = this.tabs.find(t => t.id === this.state.activeTabId);

    return (
      <div className="wtabs__container">
        <div className="wtabs__tabs-list">
          <ul>
            {this.tabs.map(t => (
              <li key={t.id}>
                <button
                  onClick={() => this.setState({ activeTabId: t.id })}
                  className={
                    "wtabs__tab-item" +
                    (t.id === this.state.activeTabId
                      ? " wtabs__tab-active"
                      : "")
                  }
                >
                  {t.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div
          className={
            "wtabs__body" +
            (this.props.className ? " " + this.props.className : "")
          }
        >
          {currentTab && currentTab.children}
        </div>
      </div>
    );
  }
}

WindowTabs.propTypes = {
  activeTabId: PropTypes.number,
  children: PropTypes.node,
  className: PropTypes.string,
};

WindowTabs.Tab = class Tab extends React.Component {};

WindowTabs.Tab.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string,
  children: PropTypes.node,
};
