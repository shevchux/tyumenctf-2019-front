import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";

export const Dir = props => {
  let headElement = null;
  let leftElement = null;
  let rightElement = null;

  React.Children.forEach(props.children, child => {
    switch (child.type.displayName) {
      case Dir.Head.displayName:
        headElement = child;
        break;
      case Dir.Left.displayName:
        leftElement = child;
        break;
      case Dir.Right.displayName:
        rightElement = child;
        break;
    }
  });

  return (
    <div className="dir-content">
      <div className="dir-head-content">{headElement}</div>
      <div className="dir-body-content">
        <div className={"dir-body-left-content" + (props.light ? " dir-body-left-content-light" : "")}>{leftElement}</div>
        <div className="dir-body-right-content">{rightElement}</div>
      </div>
    </div>
  );
};

Dir.propTypes = {
  children: PropTypes.node,
  light: PropTypes.bool
}

Dir.Head = props => props.children;

Dir.Head.displayName = "DirHead";

Dir.Left = props => props.children;

Dir.Left.displayName = "DirLeft";

Dir.Right = props => props.children;

Dir.Right.displayName = "DirRight";
