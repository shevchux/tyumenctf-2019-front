import React from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";

class TimesLeftContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { timesLeft: 0 };
  }

  componentDidMount() {
    this.intervalId = setInterval(() => {
      this.setState({ timesLeft: Date.now() - this.props.time });
    }, 5000);
    this.setState({ timesLeft: Date.now() - this.props.time });
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.setState({ timesLeft: Date.now() - props.time });
  }

  beautifyTimesLeft(seconds) {
    if (seconds < 60) {
      return this.props.t("startMenu.times.leftBySec", {
        count: Math.round(seconds / 5) * 5,
      });
    }
    return this.props.t("startMenu.times.leftByMin", {
      count: Math.round(seconds / 60),
    });
  }

  render() {
    return (
      <span>
        {this.beautifyTimesLeft(Math.round(this.state.timesLeft / 1000))}
      </span>
    );
  }
}

TimesLeftContainer.propTypes = {
  time: PropTypes.number,
  t: PropTypes.func,
};

export const TimesLeft = withTranslation()(TimesLeftContainer);
