import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setSoundVolume } from "../../actions/desktop";
import Slider from "react-rangeslider";

import "./styles.scss";
import { withTranslation } from "react-i18next";

class SoundVolumeRangeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(soundVolume) {
    this.props.setSoundVolume(soundVolume);
  }

  render() {
    const { soundVolume, t } = this.props;
    return (
      <div className="cpanel-volume-range-panel">
        <div>{t("cpanel.tray.soundVolume.title")}</div>
        <Slider
          value={soundVolume}
          orientation="vertical"
          step={10}
          onChange={this.onChange}
        />
        <div>{soundVolume}%</div>
      </div>
    );
  }
}

SoundVolumeRangeContainer.propTypes = {
  soundVolume: PropTypes.number,
  setSoundVolume: PropTypes.func,
  t: PropTypes.func
};

const mapStateToProps = state => ({
  soundVolume: state.desktop.soundVolume,
});

const mapDispatchToProps = dispatch => ({
  setSoundVolume: soundVolume => dispatch(setSoundVolume(soundVolume)),
});

export const SoundVolumeRange = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(SoundVolumeRangeContainer));
