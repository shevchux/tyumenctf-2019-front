import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  setRenderOptions,
  setActiveWallpaper,
  pushWallpaper,
} from "../../../actions/desktop";
import * as UI from "../../../components/UI";
import { WindowTabs } from "../../WindowsTabs/WindowTabs";
import { withTranslation } from "react-i18next";

class WallpaperWindowContainer extends React.Component {
  constructor(props) {
    super(props);
    this.addWallpaperUrl = this.addWallpaperUrl.bind(this);
    this.setWallpaperUrl = this.setWallpaperUrl.bind(this);
  }

  componentDidMount() {
    const { firstRender, tabId, setRenderOptions, t } = this.props;

    if (firstRender) {
      setRenderOptions(tabId, {
        firstRender: false,
        title: t("w-wallpaper.title"),
        icon: "computer",
        minSize: { height: 400, width: 350 },
        size: { height: 400, width: 350 },
        resizable: false,
      });
    }
  }

  addWallpaperUrl(e) {
    e.preventDefault();
    const { url } = e.target;
    const { t } = this.props;


    if (url.value.substr(0, 5).toLowerCase() === "data:") {
      alert(t("w-wallpaper.noURL"));
      return;
    }

    const img = new Image();
    img.onload = () => {
      this.props.pushWallpaper(url.value, url.value);
      url.value = "";
    };
    img.onerror = () => {
      alert(t("w-wallpaper.noImage"));
    };
    img.src = url.value;
  }

  setWallpaperUrl(e) {
    e.preventDefault();
    this.props.setActiveWallpaper(parseInt(e.target.value));
  }

  render() {
    const { wallpapers, activeWallpaper, t } = this.props;
    return (
      <WindowTabs activeTabId={1}>
        <WindowTabs.Tab id={1} name={t("w-wallpaper.tabTitle")}>
          <div style={{ fontSize: 12, marginBottom: 10 }}>
            {t("w-wallpaper.info")}
          </div>
          <select
            size="5"
            style={{ height: "100%" }}
            onChange={this.setWallpaperUrl}
            value={activeWallpaper}
          >
            {wallpapers.map(({ name }, index) => (
              <option
                key={index}
                value={index}
              >
                {name}
              </option>
            ))}
          </select>
          <form onSubmit={this.addWallpaperUrl}>
            <table
              cellPadding="0"
              cellSpacing="0"
              border="0"
              style={{ margin: "10px 0" }}
            >
              <tbody>
                <tr>
                  <td style={{ width: "100%", paddingRight: 10 }}>
                    <UI.TextInput
                      name="url"
                      type="url"
                      placeholder={t("w-wallpaper.placeholder")}
                      style={{ width: "100%" }}
                      autoComplete="off"
                    />
                  </td>
                  <td>
                    <UI.Button type="submit">{t("w-wallpaper.button")}</UI.Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </WindowTabs.Tab>
      </WindowTabs>
    );
  }
}

WallpaperWindowContainer.propTypes = {
  setRenderOptions: PropTypes.func,
  taskId: PropTypes.number,
  tabId: PropTypes.number,
  firstRender: PropTypes.bool,
  setActiveWallpaper: PropTypes.func,
  pushWallpaper: PropTypes.func,
  wallpapers: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      url: PropTypes.string,
    })
  ),
  activeWallpaper: PropTypes.number,
  t: PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
  firstRender: state.desktop.tabs.find(tab => tab.id === ownProps.tabId).render
    .firstRender,
  wallpapers: state.desktop.wallpapers,
  activeWallpaper: state.desktop.activeWallpaper,
});

const mapDispatchToProps = dispatch => ({
  setRenderOptions: (id, renderOptions) =>
    dispatch(setRenderOptions(id, renderOptions)),
  setActiveWallpaper: index => dispatch(setActiveWallpaper(index)),
  pushWallpaper: (url, name) => dispatch(pushWallpaper(url, name)),
});

export const WallpaperWindow = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(WallpaperWindowContainer));
