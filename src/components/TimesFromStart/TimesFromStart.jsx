import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";

function TimesFromStartContainer(props) {
  let delta = ((props.time - props.startTime) / 1000) >> 0;
  const minus = delta < 0;
  delta = Math.abs(delta);

  const sec = delta % 60;
  const min = ((delta / 60) >> 0) % 60;
  const hour = ((delta / 3600) >> 0) % 24;
  const days = (delta / 86400) >> 0;

  let time = `${days > 0 ? days + " d " : ""} \
${(hour < 10 ? "0" : "") + hour}:\
${(min < 10 ? "0" : "") + min}:\
${(sec < 10 ? "0" : "") + sec}`;

  if (!props.back) {
    time = (minus ? "-" : "") + time;
  }

  if (minus && props.back) {
    if (props.labelBack) {
      time = props.t(props.labelBack, { time });
    }
    return <span title={props.t("startMenu.times.timeToStart")}>{time}</span>;
  } else {
    if (props.label) {
      time = props.t(props.label, { time });
    }
    return <span title={props.t("startMenu.times.timeFromStart")}>{time}</span>;
  }
}

TimesFromStartContainer.propTypes = {
  time: PropTypes.number,
  startTime: PropTypes.number,
  t: PropTypes.func,
  back: PropTypes.bool,
  label: PropTypes.string,
  labelBack: PropTypes.string,
};

TimesFromStartContainer.defaultProps = {
  back: false,
};

export const TimesFromStart = connect(state => ({
  startTime: state.contest.contestStarts,
}))(withTranslation()(TimesFromStartContainer));
