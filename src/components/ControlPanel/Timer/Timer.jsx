import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { CONTEST_STATUS } from "../../../config";
import api from "../../../utils/api";
import { fetchTasks } from "../../../actions/tasks";
import { addSound } from "../../../actions/desktop";
import soundStart from "./opening_new.mp3";
import soundEnd from "./winner-of-tour.mp3";

class TimerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tick: 0 };

    this.intervalId = null;
    this.clientTimeDelta = props.clientNow - props.now;

    this.tick = this.tick.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // Работа с текущим и обновленным статусом после загрузки страницы
    if (nextProps.status.type === CONTEST_STATUS.SOLVE_UP_ENDS) {
      api.logout().then(() => window.location.reload());
      return;
    }

    if (this.props.status.type === nextProps.status.type) {
      return;
    }

    // Работа только с обновлённым статусом
    if (nextProps.status.type === CONTEST_STATUS.CONTEST_RUNNING) {
      nextProps.getTasks();
      nextProps.playSound(soundStart);
      return;
    }

    if (nextProps.status.type === CONTEST_STATUS.SOLVE_UP_RUNNING) {
      nextProps.playSound(soundEnd);
    }
  }

  componentDidMount() {
    this.tick();
    this.intervalId = setInterval(this.tick, 1000);
    this.UNSAFE_componentWillReceiveProps(this.props);
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

    return (
      (days ? `${days.toString().padStart(2, "0")} d. ` : "") +
      `${hour.toString().padStart(2, "0")}:${min
        .toString()
        .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`
    );
  }

  getProgress(now, { type, until }) {
    const { t } = this.props;
    let text, title;

    if (type === CONTEST_STATUS.REGISTRATION_RUNNING) {
      text =
        t("startMenu.times.regopen.status") +
        ": " +
        this.beautifyTimeWaitFor(until - now);
      title = t("startMenu.times.regopen.status");
    } else if (type === CONTEST_STATUS.BEFORE_CONTEST_START) {
      text =
        t("startMenu.times.before.status") +
        ": " +
        this.beautifyTimeWaitFor(until - now);
      title = t("startMenu.times.before.status");
    } else if (type === CONTEST_STATUS.CONTEST_RUNNING) {
      text = this.beautifyTimeWaitFor(until - now);
      title = t("startMenu.times.moment.status");
    } else if (type === CONTEST_STATUS.SOLVE_UP_RUNNING) {
      text =
        t("startMenu.times.after.status") +
        ": " +
        this.beautifyTimeWaitFor(until - now);
      title = t("startMenu.times.after.status");
    } else {
      text = t("startMenu.times.timeout");
      title = null;
    }

    return { text, title };
  }

  render() {
    const { status } = this.props;
    const { text, title } = this.getProgress(
      Date.now() - this.clientTimeDelta,
      status
    );

    return <span title={title}>{text}</span>;
  }
}

TimerComponent.propTypes = {
  now: PropTypes.number,
  clientNow: PropTypes.number,
  status: PropTypes.shape({
    type: PropTypes.string,
    until: PropTypes.number,
  }),
  t: PropTypes.func,
  getTasks: PropTypes.func,
  playSound: PropTypes.func
};

const mapStateToProps = state => ({
  now: state.contest.now,
  clientNow: state.contest.clientNow,
  status: state.contest.status,
});

const mapStateToDispatch = dispatch => ({
  getTasks: () => dispatch(fetchTasks()),
  playSound: url => dispatch(addSound(url))
});

export const Timer = connect(mapStateToProps, mapStateToDispatch)(
  withTranslation()(TimerComponent)
);
