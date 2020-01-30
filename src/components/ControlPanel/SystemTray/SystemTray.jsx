import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./styles.scss";
import * as UI from "../../UI";
import { Popup } from "../../../containers/Popup/Popup";
import { SoundVolumeRange } from "../../SoundVolumeRange/SoundVolumeRange";
import { ViewModeSelector } from "../../ViewModeSelector/ViewModeSelector";
import { withTranslation } from "react-i18next";
import { Timer } from "../Timer/Timer";
import { refresh } from "../../../actions/contest";
import { REFRESH_INTERVAL, REFRESH_INTERVAL_DELTA } from "../../../config";
import { addTab, TabType } from "../../../actions/desktop";
import { TrayMessage } from "../TrayMessage/TrayMessage";
import { Delay } from "../../../utils/api";

class SystemTrayContainer extends React.Component {
  componentDidMount() {
    this.props.refresh();

    (async () => {
      while (true) {
        const delta = (2 * Math.random() - 1) * REFRESH_INTERVAL_DELTA;
        await Delay(REFRESH_INTERVAL + delta).then(() => {
          this && this.props.refresh();
        });
      }
    })();
  }

  render() {
    const {
      soundVolume,
      t,
      openWallpaper,
      openNews,
      newsCount,
      newsLoaded,
      newsLoadedCount,
    } = this.props;
    const viewModeTitle = t("cpanel.tray.viewMode.title");
    const soundVolumeTitle = soundVolume
      ? t("cpanel.tray.soundVolume.titleSoundOn")
      : t("cpanel.tray.soundVolume.titleSoundOff");
    return (
      <div className="cpanel-stray-container">
        <div className="cpanel-stray-buttons">
          <ul>
            {newsLoaded && newsCount > newsLoadedCount && (
              <li>
                <Popup className="cpanel-stray-volume-pointer" expanded>
                  <Popup.Element className="cpanel-stray-volume-range">
                    <div onClick={openNews}>
                      <TrayMessage
                        icon="letter"
                        title={t("cpanel.tray.news.title")}
                        info={t("cpanel.tray.news.body")}
                      />
                    </div>
                  </Popup.Element>
                  <Popup.Button
                    className="cpanel-stray-button"
                    title={viewModeTitle}
                  >
                    <UI.Icon
                      id={"letter"}
                      small
                      title={t("cpanel.tray.news.title")}
                      onClick={openNews}
                    />
                    {t("cpanel.tray.news.title")}
                  </Popup.Button>
                </Popup>
              </li>
            )}
            <li>
              <UI.Icon
                id={"computer"}
                small
                title={t("cpanel.tray.wallpaper.title")}
                onClick={openWallpaper}
              />
            </li>
            <li>
              <Popup className="cpanel-stray-volume-pointer">
                <Popup.Element className="cpanel-stray-volume-range">
                  <ViewModeSelector />
                </Popup.Element>
                <Popup.Button
                  className="cpanel-stray-button"
                  title={viewModeTitle}
                >
                  <UI.Icon id={"photo"} small />
                  {viewModeTitle}
                </Popup.Button>
              </Popup>
            </li>
            <li>
              <Popup className="cpanel-stray-volume-pointer">
                <Popup.Element className="cpanel-stray-volume-range">
                  <SoundVolumeRange />
                </Popup.Element>
                <Popup.Button
                  className="cpanel-stray-button"
                  title={soundVolumeTitle}
                >
                  <UI.Icon
                    id={soundVolume ? "volume-on" : "volume-off"}
                    small
                  />
                  {soundVolumeTitle}
                </Popup.Button>
              </Popup>
            </li>
          </ul>
        </div>
        <div className="cpanel-stray-clocks noselect">
          <Timer />
        </div>
      </div>
    );
  }
}

SystemTrayContainer.propTypes = {
  soundVolume: PropTypes.number,
  soundVolumeOn: PropTypes.func,
  soundVolumeOff: PropTypes.func,
  newsLoaded: PropTypes.bool,
  t: PropTypes.func,
  refresh: PropTypes.func,
  openWallpaper: PropTypes.func,
  openNews: PropTypes.func,
  newsCount: PropTypes.number,
  newsLoadedCount: PropTypes.number,
};

const mapStateToProps = state => ({
  soundVolume: state.desktop.soundVolume,
  newsCount: state.contest.news.count,
  newsLoaded: !!state.contest.news.loaded,
  newsLoadedCount: state.contest.news.items.length,
});

const mapDispatchToProps = dispatch => ({
  refresh: () => dispatch(refresh()),
  openWallpaper: () => dispatch(addTab(TabType.WALLPAPER)),
  openNews: () => dispatch(addTab(TabType.NEWS, { fromTray: true })),
});

export const SystemTray = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(SystemTrayContainer));
