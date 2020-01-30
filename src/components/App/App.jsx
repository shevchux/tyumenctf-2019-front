import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Login } from "../Login/Login";
import { Desktop } from "../Desktop/Desktop";
import { LoadingScreen } from "../LoadingScreen/LoadingScreen";
import { fetchTeam } from "../../actions/team";

import "./styles.scss";
import { WindowMessage } from "../WindowMessage/WindowMessage";
import { withTranslation } from "react-i18next";

class AppContainer extends React.Component {
  componentDidMount() {
    this.props.getTeam();
  }

  renderContent() {
    const { teamLoading, teamError, loggedIn, t } = this.props;

    if (teamLoading) {
      return <LoadingScreen />;
    }

    if (teamError) {
      return (
        <WindowMessage
          title={t("init.getTeamError.title")}
          icon="attention"
          button={t("init.getTeamError.button")}
          onButton={() => this.componentDidMount()}
        >
          {t("init.getTeamError.body")}
        </WindowMessage>
      );
    }

    return loggedIn ? <Desktop /> : <Login />;
  }

  render() {
    const { emulatorMode } = this.props;
    return (
      <div className={`desktop-wrapper${emulatorMode ? " emulator" : ""}`}>
        {this.renderContent()}
      </div>
    );
  }
}

AppContainer.propTypes = {
  teamLoading: PropTypes.bool,
  teamError: PropTypes.bool,
  loggedIn: PropTypes.bool,
  emulatorMode: PropTypes.bool,
  getTeam: PropTypes.func,
  t: PropTypes.func,
};

const mapStateToProps = state => ({
  teamLoading: state.team.loading,
  teamError: state.team.error,
  emulatorMode: state.desktop.emulatorMode,
  loggedIn: state.team.loggedIn,
});

const mapDispatchToProps = dispatch => ({
  getTeam: () => dispatch(fetchTeam()),
});

export const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(AppContainer));
