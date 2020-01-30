import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./styles.scss";
import { WorkspaceShortcut } from "../WorkspaceShortcut/WorkspaceShortcut";
import { addTab, TabType, addSound } from "../../actions/desktop";
import { WindowsContainer } from "../../containers/WindowsContainer/WindowsContainer";
import startupSound from "./startup.mp3";
import { setBeenLoggedIn } from "../../actions/team";

class WorkspaceContainer extends React.Component {
  componentDidMount() {
    const {
      beenLoggedIn,
      openRules,
      openNews,
      setBeenLoggedIn,
      playSound,
    } = this.props;
    openNews();
    if (!beenLoggedIn) {
      playSound(startupSound);
      setBeenLoggedIn();
      openRules();
    }
  }

  render() {
    const { categories, openCategoryTasks, wallpaper } = this.props;
    return (
      <div
        className="wspace-container"
        style={{ backgroundImage: `url(${wallpaper})` }}
      >
        <WindowsContainer />
        <div className="wspace-icons-wrapper">
          {categories.map(x => (
            <WorkspaceShortcut
              name={x.name}
              key={x.id}
              id={x.icon}
              onClick={() => openCategoryTasks(x.id)}
            />
          ))}
        </div>
      </div>
    );
  }
}

WorkspaceContainer.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })
  ),
  beenLoggedIn: PropTypes.bool,
  playSound: PropTypes.func,
  setBeenLoggedIn: PropTypes.func,
  openCategoryTasks: PropTypes.func,
  openRules: PropTypes.func,
  openNews: PropTypes.func,
  wallpaper: PropTypes.string,
};

const mapStateToProps = state => ({
  categories: state.tasks.categories,
  beenLoggedIn: state.team.beenLoggedIn,
  wallpaper: state.desktop.wallpapers[state.desktop.activeWallpaper]
    ? state.desktop.wallpapers[state.desktop.activeWallpaper].url
    : "",
});

const mapDispatchToProps = dispatch => ({
  openCategoryTasks: categoryId =>
    dispatch(addTab(TabType.CATEGORY_TASKS, { categoryId })),
  setBeenLoggedIn: () => dispatch(setBeenLoggedIn()),
  playSound: url => dispatch(addSound(url)),
  openRules: () => dispatch(addTab(TabType.RULES)),
  openNews: () => {
    dispatch(addTab(TabType.NEWS));
  },
});

export const Workspace = connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceContainer);
