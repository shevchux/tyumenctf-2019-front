import React from "react";
import PropTypes from "prop-types";

export class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: props.expanded };
    this.handleClick = props.expanded || this.handleClick.bind(this);
    this.handleOutsideClick = props.expanded || this.handleOutsideClick.bind(this);
  }

  handleClick() {
    if (!this.state.expanded) {
      document.addEventListener("mousedown", this.handleOutsideClick, false);
    } else {
      document.removeEventListener("mousedown", this.handleOutsideClick, false);
    }

    this.toggleExpanded();
  }

  handleOutsideClick(e) {
    // ignore clicks on the component itself
    if (this.node && this.node.contains(e.target)) {
      return;
    }

    this.handleClick();
  }

  toggleExpanded() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { expanded, children, ...otherProps } = this.props;

    return (
      <div
        {...otherProps}
        ref={node => {
          this.node = node;
        }}
      >
        {React.Children.map(children, child => {
          if (child.type.displayName === "Popup.Element") {
            return (
              this.state.expanded &&
              React.cloneElement(child, {
                hidePopup: () => this.handleClick(),
              })
            );
          }
          if (child.type.displayName === "Popup.Button") {
            return React.cloneElement(child, {
              onClick: () => this.handleClick(),
            });
          }
          return null;
        })}
      </div>
    );
  }
}

Popup.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  expanded: PropTypes.bool,
};

Popup.defaultProps = {
  expanded: false,
};

Popup.Element = function(props) {
  const { children, hidePopup, ...otherProps } = props;
  return (
    <div {...otherProps}>
      {React.cloneElement(children, {
        hidePopup,
      })}
    </div>
  );
};
Popup.Element.displayName = "Popup.Element";

Popup.Element.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  hidePopup: PropTypes.func
};

Popup.Button = function(props) {
  const { children, onClick, ...otherProps } = props;
  return (
    <button onClick={onClick} {...otherProps}>
      {children}
    </button>
  );
};
Popup.Button.displayName = "Popup.Button";

Popup.Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
