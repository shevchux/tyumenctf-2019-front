import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Installer } from "../Installer/Installer";
import { withTranslation } from "react-i18next";
import { CONTEST_STATUS } from "../../config";

class TimelineWidgetComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tick: 0 };

    this.intervalId = null;
    this.clientTimeDelta = props.clientNow - props.now;

    this.tick = this.tick.bind(this);
  }

  componentDidMount() {
    this.tick();
    this.intervalId = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  tick() {
    this.setState({ tick: this.state.tick + 1 });
  }

  getIntervalPercentage(a, b, position) {
    return Math.floor(((position - a) / (b - a)) * 1000) / 10;
  }

  beautifyTimeWaitFor(ms) {
    ms = (ms / 1000) >> 0;
    const sec = ms % 60;
    const min = ((ms / 60) >> 0) % 60;
    const hour = ((ms / 3600) >> 0) % 24;
    const days = (ms / 86400) >> 0;

    if (days) {
      return this.props.t("startMenu.times.byDays", { days, hour, min });
    }

    return this.props.t("startMenu.times.byHours", { hour, min, sec });
  }

  getProgress(now, { type, from, until }) {
    const { t } = this.props;
    if (type === CONTEST_STATUS.REGISTRATION_RUNNING) {
      return {
        info: t("startMenu.times.regopen.info"),
        status: t("startMenu.times.regopen.status"),
        progress: {
          label: this.beautifyTimeWaitFor(until - now),
          percent: this.getIntervalPercentage(from, until, now),
          className: "status-wait",
        },
      };
    } else if (type === CONTEST_STATUS.BEFORE_CONTEST_START) {
      return {
        info: t("startMenu.times.before.info"),
        status: t("startMenu.times.before.status"),
        progress: {
          label: this.beautifyTimeWaitFor(until - now),
          percent: this.getIntervalPercentage(from, until, now),
          className: "status-wait",
        },
      };
    } else if (type === CONTEST_STATUS.CONTEST_RUNNING) {
      return {
        info: t("startMenu.times.moment.info"),
        status: t("startMenu.times.moment.status"),
        progress: {
          label: this.beautifyTimeWaitFor(until - now),
          percent: this.getIntervalPercentage(from, until, now),
          className: "status-contest",
        },
      };
    } else if (type === CONTEST_STATUS.SOLVE_UP_RUNNING) {
      return {
        info: t("startMenu.times.after.info"),
        status: t("startMenu.times.after.status"),
        progress: {
          label: this.beautifyTimeWaitFor(until - now),
          percent: this.getIntervalPercentage(from, until, now),
          className: "status-after",
        },
      };
    }
  }

  render() {
    const { status, t } = this.props;
    const progress = this.getProgress(
      Date.now() - this.clientTimeDelta,
      status
    );
    if (!progress)
      return (
        <div className="smenu-installer-body">
          <div className="smenu-installer-info">
            {t("startMenu.times.after.info")}
          </div>
        </div>
      );
    progress.status += ":";
    return <Installer {...progress} />;
  }
}

TimelineWidgetComponent.propTypes = {
  now: PropTypes.number,
  clientNow: PropTypes.number,
  status: PropTypes.shape({
    type: PropTypes.string,
    from: PropTypes.number,
    until: PropTypes.number,
  }),
  t: PropTypes.func,
};

const mapStateToProps = state => ({
  now: state.contest.now,
  clientNow: state.contest.clientNow,
  status: state.contest.status,
});

export const TimelineWidget = connect(mapStateToProps)(
  withTranslation()(TimelineWidgetComponent)
);
