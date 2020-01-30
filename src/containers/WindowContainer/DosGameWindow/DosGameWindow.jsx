import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setRenderOptions, frontTab } from "../../../actions/desktop";

export const DosGames = [
  {
    id: 1,
    title: "Disney's Aladdin",
    path: "./ajde2-luketic.zip",
    run: "./ALADDIN.EXE",
  },
  {
    id: 2,
    title: "Digger",
    path: "./digger.zip",
    run: "./DIGGER.COM",
  },
  {
    id: 3,
    title: "XONIX",
    path: "./xonix.zip",
    run: "./XONIX.EXE",
  },
  {
    id: 4,
    title: "Grand Prix Circuit",
    path: "./grand-colin.zip",
    run: "./GPEGA.EXE",
  },
  {
    id: 5,
    title: "DOOM 2",
    path: "./DOOM2.zip",
    run: "./DOOM2/DOOM2.EXE",
  }, 
  {
    id: 6,
    title: "Bomberman",
    path: "./bomberman.zip",
    run: "./execute.bat",
  }
];

class DosGameWindowContainer extends React.Component {
  constructor(props) {
    super(props);
    this.game = DosGames.find(game => game.id === this.props.dosGameId);
  }

  componentDidMount() {
    this.props.setRenderOptions(this.props.tabId, {
      title: this.game ? this.game.title : "GAME NOT FOUND",
      icon: "game-cube",
      size: { height: 430, width: 646 },
      minSize: { height: 430, width: 646 },
      onExpand: () => {
        this.iframe.contentWindow.dosbox.module.requestFullscreen();
        this.iframe.contentWindow.focus();
      },
      resizable: false,
    });

    this.iframe.contentWindow.addEventListener("click", () => {
      this.iframe.contentWindow.focus();
      this.props.frontTab(this.props.tabId);
    });

    this.iframe.onload = () => {
      if (!this.game) return;
      this.iframe.contentWindow.postMessage(JSON.stringify(this.game));
    };
  }

  render() {
    return (
      <iframe
        src={"games/"}
        ref={ref => (this.iframe = ref)}
        width="640"
        height="400"
        frameBorder="0"
        allowFullscreen="on"
      />
    );
  }
}

DosGameWindowContainer.propTypes = {
  setRenderOptions: PropTypes.func,
  tabId: PropTypes.number,
  dosGameId: PropTypes.number,
  frontTab: PropTypes.func,
};

const mapDispatchToProps = dispatch => ({
  setRenderOptions: (id, renderOptions) =>
    dispatch(setRenderOptions(id, renderOptions)),
  frontTab: id => dispatch(frontTab(id)),
});

export const DosGameWindow = connect(
  null,
  mapDispatchToProps
)(DosGameWindowContainer);
