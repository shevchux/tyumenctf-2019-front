import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Greeting } from "../Greeting/Greeting";
import { LoadingScreen } from "../LoadingScreen/LoadingScreen";
import { fetchTasks } from "../../actions/tasks";
import { WindowMessage } from "../WindowMessage/WindowMessage";
import { Workspace } from "../Workspace/Workspace";
import { ControlPanel } from "../ControlPanel/ControlPanel";
import { syncDesktopWithLocalStorage } from "../../actions/desktop";
import { Shutdown } from "../Shutdown/Shutdown";
import { withTranslation } from "react-i18next";

class DesktopContainer extends React.Component {
  componentDidMount() {
    this.props.getTasks();
    this.props.syncDesktopWithLocalStorage();
  }

  render() {
    const {
      tasksLoading,
      logoutSending,
      tasksSuccess,
      tasksError,
      beenLoggedIn,
      loggedIn,
      t
    } = this.props;

    if (logoutSending) {
      return <Shutdown />;
    }

    if (tasksLoading) {
      return beenLoggedIn ? <LoadingScreen /> : <Greeting />;
    }

    if (tasksError) {
      return (
        <WindowMessage
          icon="attention"
          title={t("init.getTasksError.title")}
          button={t("init.getTasksError.button")}
          onButton={() => this.props.getTasks()}
        >
          {t("init.getTasksError.body")}
        </WindowMessage>
      );
    }

    if (tasksSuccess && loggedIn) {
      return (
        <React.Fragment>
          <Workspace />
          <ControlPanel />
        </React.Fragment>
      );
    }

    return null;
  }
}

DesktopContainer.propTypes = {
  tasksLoading: PropTypes.bool,
  tasksSuccess: PropTypes.bool,
  tasksError: PropTypes.bool,
  beenLoggedIn: PropTypes.bool,
  loggedIn: PropTypes.bool,
  soundVolume: PropTypes.bool,
  logoutSending: PropTypes.bool,
  getTasks: PropTypes.func,
  syncDesktopWithLocalStorage: PropTypes.func,
  t: PropTypes.func
};

const mapStateToProps = state => ({
  tasksLoading: state.tasks.loading,
  tasksSuccess: state.tasks.success,
  tasksError: state.tasks.error,
  logoutSending: state.logout.sending,
  beenLoggedIn: state.team.beenLoggedIn,
  loggedIn: state.team.loggedIn,
});

const mapDispatchToProps = dispatch => ({
  getTasks: () => dispatch(fetchTasks()),
  syncDesktopWithLocalStorage: () => dispatch(syncDesktopWithLocalStorage()),
});

export const Desktop = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(DesktopContainer));
