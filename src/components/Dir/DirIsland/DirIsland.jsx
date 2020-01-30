import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";

export const DirIsland = props => (
  <div className="dir-island">
    <div className="dir-island-head">{props.title}</div>
    <div className="dir-island-content">{props.children}</div>
  </div>
);

DirIsland.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
};
