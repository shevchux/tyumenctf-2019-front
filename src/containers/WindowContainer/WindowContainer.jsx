import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import * as UI from "../../components/UI";
import {
  removeTab,
  setRenderOptions,
  frontTab,
  hideTab,
  TabType,
} from "../../actions/desktop";
import { CategoryTasksWindow } from "./CategoryTasksWindow/CategoryTasksWindow";
import { DosGameWindow } from "./DosGameWindow/DosGameWindow";
import { TaskWindow } from "./TaskWindow/TaskWindow";
import { ExecuteWindow } from "./ExecuteWindow/ExecuteWindow";
import { RatingWindow } from "./RatingWindow/RatingWindow";
import { RulesWindow } from "./RulesWindow/RulesWindow";
import { NewsWindow } from "./NewsWindow/NewsWindow";
import { TeamWindow } from "./TeamWindow/TeamWindow";
import { WallpaperWindow } from "./WallpaperWindow/WallpaperWindow";

class _WindowContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { size: { height: 0, width: 0 } };
    this.onStopDrag = this.onStopDrag.bind(this);
    this.onResizeStop = this.onResizeStop.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return { size: nextProps.tab.render.size };
  }

  onStopDrag(_, { x, y }) {
    this.props.savePosition(this.props.tab.id, { x, y });
  }

  onResizeStop(_, __, elem) {
    this.props.saveSize(this.props.tab.id, {
      height: elem.offsetHeight,
      width: elem.offsetWidth,
    });
  }

  render() {
    const {
      tab: {
        id,
        type,
        payload,
        render: {
          title,
          icon,
          minSize: { height: minHeight, width: minWidth },
          resizable,
          position: { x, y },
          onExpand,
          hidden,
        },
        active,
        zIndex,
      },
      removeTab,
      hideTab,
      frontTab,
    } = this.props;

    return (
      <UI.Window
        title={title}
        icon={icon}
        inactive={!active}
        onClose={() => removeTab(id)}
        onExpand={onExpand}
        onHide={() => hideTab(id)}
        draggable={{
          dragHandleClassName: "ui-window-head-content",
          bounds: ".windows-container",
          style: {
            zIndex,
            ...(hidden
              ? { clip: "rect(1px 1px 1px 1px)", pointerEvents: "none" }
              : {}),
          },
          enableResizing: {
            top: resizable,
            right: resizable,
            bottom: resizable,
            left: resizable,
            topRight: resizable,
            bottomRight: resizable,
            bottomLeft: resizable,
            topLeft: resizable,
          },
          minWidth: minWidth,
          minHeight: minHeight,
          size: this.state.size,
          default: { x, y },
          onDragStop: this.onStopDrag,
          onResizeStop: this.onResizeStop,
        }}
        onMouseDown={() => !active && frontTab(id)}
      >
        {this.renderContent(id, type, payload)}
      </UI.Window>
    );
  }

  renderContent(id, type, payload) {
    switch (type) {
    case TabType.CATEGORY_TASKS:
      return <CategoryTasksWindow tabId={id} {...payload} />;
    case TabType.DOS_GAME:
      return <DosGameWindow tabId={id} {...payload} />;
    case TabType.TASK:
      return <TaskWindow tabId={id} {...payload} />;
    case TabType.EXECUTE:
      return <ExecuteWindow tabId={id} {...payload} />;
    case TabType.RATING:
      return <RatingWindow tabId={id} {...payload} />;
    case TabType.RULES:
      return <RulesWindow tabId={id} {...payload} />;
    case TabType.NEWS:
      return <NewsWindow tabId={id} {...payload} />;
    case TabType.TEAM:
      return <TeamWindow tabId={id} {...payload} />;
    case TabType.WALLPAPER:
      return <WallpaperWindow tabId={id} {...payload} />;
    default:
      return null;
    }
  }
}

_WindowContainer.propTypes = {
  tabId: PropTypes.number,
  tab: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.string,
    payload: PropTypes.shape({}),
    render: PropTypes.shape({
      title: PropTypes.string,
      icon: PropTypes.string,
      size: PropTypes.shape({}),
      position: PropTypes.shape({}),
      hidden: PropTypes.bool,
      active: PropTypes.bool,
    }),
    active: PropTypes.bool,
    zIndex: PropTypes.number,
  }),
  removeTab: PropTypes.func,
  frontTab: PropTypes.func,
  hideTab: PropTypes.func,
  savePosition: PropTypes.func,
  saveSize: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
  const tabIndex = state.desktop.tabs.findIndex(
    tab => tab.id === ownProps.tabId
  );
  return {
    tab: {
      ...state.desktop.tabs[tabIndex],
      active: state.desktop.tabs.length - 1 === tabIndex,
      zIndex: tabIndex,
    },
  };
};

const mapDispatchToProps = dispatch => ({
  removeTab: id => dispatch(removeTab(id)),
  frontTab: id => dispatch(frontTab(id)),
  hideTab: id => dispatch(hideTab(id)),
  savePosition: (id, position) => dispatch(setRenderOptions(id, { position })),
  saveSize: (id, size) => dispatch(setRenderOptions(id, { size })),
});

export const WindowContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(_WindowContainer);
