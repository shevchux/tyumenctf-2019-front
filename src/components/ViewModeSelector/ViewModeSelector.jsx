import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./styles.scss";
import { setEmulatorMode } from "../../actions/desktop";
import { fullscreen } from "../../utils/fullscreen";
import { withTranslation } from "react-i18next";

class ViewModeSelectorContainer extends React.Component {
  constructor(props) {
    super(props);

    this.setFullscreenMode = this.setFullscreenMode.bind(this);
    this.setStandartMode = this.setStandartMode.bind(this);
    this.setEmulatorMode = this.setEmulatorMode.bind(this);
  }

  setFullscreenMode() {
    fullscreen.requestFullscreen();
    this.props.toEmulator(false);
    this.props.hidePopup();
  }

  setStandartMode() {
    fullscreen.exitFullscreen();
    this.props.toEmulator(false);
    this.props.hidePopup();
  }

  setEmulatorMode() {
    fullscreen.exitFullscreen();
    this.props.toEmulator(true);
    this.props.hidePopup();
  }

  render() {
    return (
      <div className="cpanel-popup-list">
        <ul>
          {fullscreen.isFullscreenEnabled && (
            <li>
              <button
                className="cpanel-popup-list-button"
                onClick={this.setFullscreenMode}
              >
                {this.props.t("cpanel.tray.viewMode.fullscreen")}
              </button>
            </li>
          )}
          <li>
            <button
              className="cpanel-popup-list-button"
              onClick={this.setStandartMode}
            >
              {this.props.t("cpanel.tray.viewMode.regular")}
            </button>
          </li>
          <li>
            <button
              className="cpanel-popup-list-button"
              onClick={this.setEmulatorMode}
            >
              {this.props.t("cpanel.tray.viewMode.bottomOffset")}
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

ViewModeSelectorContainer.propTypes = {
  toEmulator: PropTypes.func,
  hidePopup: PropTypes.func,
  t: PropTypes.func
};

const mapDispatchToProps = dispatch => ({
  toEmulator: emulatorMode => dispatch(setEmulatorMode(emulatorMode)),
});

export const ViewModeSelector = connect(
  null,
  mapDispatchToProps
)(withTranslation()(ViewModeSelectorContainer));
