import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";

export const Icon = (props) => {
  const { id, className, small = false, ...otherProps } = props;
  return (
    <div
      className={`${small ? "ui-icon-small" : "ui-icon"} ui-icon-${id}${className ? " " + className : ""}`}
      {...otherProps}
    />
  );
};

Icon.propTypes = {
  id: PropTypes.string.isRequired,
  className: PropTypes.string,
  small: PropTypes.bool
};
