import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Sound from "react-sound";
import { removeSound } from "../../actions/desktop";

class SoundQueueContainer extends React.Component {
  render() {
    const { sounds, volume, removeSound } = this.props;
    return sounds.map(({ id, url }) => (
      <Sound
        key={id}
        url={url}
        volume={volume}
        playStatus={Sound.status.PLAYING}
        onFinishedPlaying={() => removeSound(id)}
      />
    ));
  }
}

SoundQueueContainer.propTypes = {
  sounds: PropTypes.array,
  volume: PropTypes.number,
  removeSound: PropTypes.func,
};

const mapStateToProps = state => ({
  sounds: state.desktop.sounds,
  volume: state.desktop.soundVolume,
});

const mapDispatchToProps = dispatch => ({
  removeSound: id => dispatch(removeSound(id)),
});

export const SoundQueue = connect(
  mapStateToProps,
  mapDispatchToProps
)(SoundQueueContainer);
