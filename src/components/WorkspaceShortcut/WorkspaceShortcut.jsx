import React from "react";
import PropTypes from "prop-types";
import * as UI from "../UI";
import "./styles.scss";

export const WorkspaceShortcut = props => {
  const { name, id, onClick } = props;
  return (
    <button className="wspace-shortcut-container noselect" onDoubleClick={onClick}>
      <UI.Icon id={id} className="wspace-shortcut-icon" />
      <div className="wspace-shortcut-name">{name}</div>
    </button>
  );
};

WorkspaceShortcut.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  onClick: PropTypes.func,
};
