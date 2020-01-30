import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  setRenderOptions,
  removeTab,
  enableGameMode,
  pushWallpaper,
  addSound,
} from "../../../actions/desktop";
import * as UI from "../../../components/UI";
import { withTranslation } from "react-i18next";
import elonImage from "./elon.gif";
import playModeOnSound from "./sms-headshot.mp3";

class ExecuteWindowContainer extends React.Component {
  componentDidMount() {
    const { firstRender, t, tabId, setRenderOptions } = this.props;

    if (firstRender) {
      setRenderOptions(tabId, {
        firstRender: false,
        title: t("w-exec.title"),
        icon: "execute",
        size: { height: 180, width: 320 },
        minSize: { height: 180, width: 320 },
        resizable: false,
      });
    }
  }

  youWillBeenPranked() {
    const { t } = this.props;

    document.body.innerHTML = `<div style="position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 34px;
    font-family: Consolas;
    color: red;">${t("w-exec.cases.kick")}</div>`;

    setTimeout(() => {
      document.body.innerHTML = `<div style="position: absolute;
    background: #fff;
    top: 50%;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 34px;
    font-family: Consolas;
    color: green;">${t("w-exec.cases.kick_prank")}</div>`;
    }, 2000);
  }

  onSubmit(e) {
    e.preventDefault();
    const {
      command: { value: command },
    } = e.target;
    const { t } = this.props;
    let removeExecuteWindow = true;
    switch (command.trim().toLowerCase()) {
    case "cmd":
      removeExecuteWindow = false;
      alert(t("w-exec.cases.use_gui"));
      break;
    case "exit":
      removeExecuteWindow = true;
      break;
    case "rm -rf /*":
    case "rm -rf *":
    case "rm -rf":
    case "rm rf":
    case "format c":
    case "format c:":
      document.head.getElementsByTagName("link")[1].remove();
      break;
    case "regedit":
      this.props.pushWallpaper(elonImage, "GENIOUS.gif");
      break;
    case "mmc":
      this.youWillBeenPranked();
      break;
    case "hack_this_channel":
    case "/hack_this_channel":
      this.props.enableGameMode();
      this.props.pushWallpaper(
        "http://s00.yaplakal.com/pics/pics_original/5/1/2/4641215.jpg",
        "OLD_GAME_CLUB.gif"
      );
      this.props.playSound(playModeOnSound);
      alert(t("w-exec.cases.old_games"));
      break;
    default:
      removeExecuteWindow = false;
      alert(t("w-exec.cases.unknown_command"));
    }

    removeExecuteWindow && this.props.close(this.props.tabId);
  }

  render() {
    const { tabId, close, t } = this.props;
    return (
      <form onSubmit={e => this.onSubmit(e)}>
        <table
          cellPadding="0"
          cellSpacing="0"
          border="0"
          style={{ padding: "15px 12px", fontSize: "12px", width: "100%" }}
        >
          <thead>
            <tr>
              <td>
                <UI.Icon id="execute" />
              </td>
              <td title={t("w-exec.hint")}>{t("w-exec.subtitle")}</td>
            </tr>
            <tr style={{ height: 12 }}>
              <td />
            </tr>
            <tr>
              <td style={{ fontSize: "11px", paddingRight: "7px" }}>
                {t("w-exec.open")}
              </td>
              <td>
                <UI.TextInput
                  autoFocus
                  required
                  autoComplete="off"
                  type="text"
                  name="command"
                  style={{ width: "100%" }}
                />
              </td>
            </tr>
            <tr style={{ height: 20 }}>
              <td />
            </tr>
            <tr>
              <td />
              <td align="right">
                <UI.Button style={{ width: 70, marginRight: 8 }}>ОК</UI.Button>
                <UI.Button
                  type="button"
                  style={{ width: 70 }}
                  onClick={() => close(tabId)}
                >
                  {t("w-exec.cancel")}
                </UI.Button>
              </td>
            </tr>
          </thead>
        </table>
      </form>
    );
  }
}

ExecuteWindowContainer.propTypes = {
  setRenderOptions: PropTypes.func,
  enableGameMode: PropTypes.func,
  tabId: PropTypes.number,
  close: PropTypes.func,
  firstRender: PropTypes.bool,
  t: PropTypes.func,
  pushWallpaper: PropTypes.func,
  playSound: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  firstRender: state.desktop.tabs.find(tab => tab.id === ownProps.tabId).render
    .firstRender,
});

const mapDispatchToProps = dispatch => ({
  setRenderOptions: (id, renderOptions) =>
    dispatch(setRenderOptions(id, renderOptions)),
  close: tabId => dispatch(removeTab(tabId)),
  enableGameMode: () => dispatch(enableGameMode()),
  pushWallpaper: (url, name) => dispatch(pushWallpaper(url, name)),
  playSound: url => dispatch(addSound(url)),
});

export const ExecuteWindow = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(ExecuteWindowContainer));
