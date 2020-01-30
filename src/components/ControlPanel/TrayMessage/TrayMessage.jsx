import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import * as UI from "../../UI";

export class TrayMessage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { icon, title, info } = this.props;
    return (
      <div className="wtm-content">
        <div className="wtm-title">
          <UI.Icon id={icon} small />
          <span>{title}</span>
        </div>
        <div>{info}</div>
      </div>
    );
  }
}

TrayMessage.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  info: PropTypes.string,
};
