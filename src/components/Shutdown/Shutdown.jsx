import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { WindowMessage } from "../WindowMessage/WindowMessage";
import { setClearLogout } from "../../actions/logout";
import { addSound } from "../../actions/desktop";
import logoutSound from "./logout.mp3";
import { withTranslation } from "react-i18next";

class ShutdownContainer extends React.Component {
  componentDidMount() {
    this.props.playSound(logoutSound);
  }

  render() {
    const { error, back, t } = this.props;
    return (
      <div className="win">
        <div className="win-head">
          <div className="head-logo" />
        </div>
        <div className="win-head-separator" />
        <div
          className="win-body"
          style={{
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Arial",
          }}
        >
          {error ? (
            <WindowMessage
              title={t("shutdown.logoutError.title")}
              button={t("shutdown.logoutError.button")}
              icon="attention"
              onButton={back}
            >
              <span style={{ color: "#000000" }}>
                {t("shutdown.logoutError.body")}
              </span>
            </WindowMessage>
          ) : (
            <div className="member-image" style={{ zoom: 0.75 }}>
              <div className="member-logo" />
              <div className="clearfix" />
              <div
                className="members-text"
                style={{
                  fontSize: "20px",
                  margin: "40px 18px 10px 0",
                }}
              >
                {t("shutdown.description")}
              </div>
            </div>
          )}
        </div>
        <div className="win-footer-separator" />
        <div className="win-footer" style={{ height: 120 }} />
      </div>
    );
  }
}

ShutdownContainer.propTypes = {
  error: PropTypes.bool,
  back: PropTypes.func,
  playSound: PropTypes.func,
  t: PropTypes.func,
};

const mapStateToProps = state => ({
  error: state.logout.error,
});

const mapDispatchToProps = dispatch => ({
  back: () => dispatch(setClearLogout()),
  playSound: url => dispatch(addSound(url)),
});

export const Shutdown = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ShutdownContainer));
