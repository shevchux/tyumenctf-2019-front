import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";

export const Button = props => {
  return <button {...props} className="ui-button">{props.children}</button>;
};

Button.propTypes = {
  children: PropTypes.node,
};
