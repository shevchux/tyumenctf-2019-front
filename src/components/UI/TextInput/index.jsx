import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";

export const TextInput = (props) => {
  const { width, ...otherProps } = props;
  return <input className="ui-textinput" style={{ width }} {...otherProps} />
}

TextInput.propTypes = {
  width: PropTypes.string
}