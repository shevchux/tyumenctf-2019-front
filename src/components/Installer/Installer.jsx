import React from "react";
import "./styles.scss";
import PropTypes from "prop-types";

export function Installer(props) {
  return (
    <div className="smenu-installer-body">
      <div className="smenu-installer-info">{props.info}</div>
      <div>
        <div className="smenu-installer-status">{props.status}</div>
        <div className="smenu-installer-progress">
          {props.progress && <ProgressBar {...props.progress} />}
        </div>
      </div>
    </div>
  );
}

Installer.propTypes = {
  info: PropTypes.node,
  status: PropTypes.string,
  progress: PropTypes.shape({
    label: PropTypes.string.isRequired,
    percent: PropTypes.number.isRequired,
    className: PropTypes.string,
  }),
};

function ProgressBar(props) {
  const { percent, label, className } = props;
  return (
    <React.Fragment>
      <div className="smenu-installer-label">{label}</div>
      <div className={`smenu-installer-progress-bar${className ? " " + className : ""}`} title={(percent || 0) + "%"}>
        <div
          className="smenu-installer-progress-bar-line"
          style={{ width: (percent || 0) + "%" }}
        />
      </div>
    </React.Fragment>
  );
}

ProgressBar.propTypes = {
  percent: PropTypes.number.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
};
