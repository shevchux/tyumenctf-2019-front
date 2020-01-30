import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import * as UI from "../../UI";
import { Rnd } from "react-rnd";

export class Window extends React.Component {
  renderBody() {
    const {
      icon,
      title,
      children,
      styles,
      className,
      defaultExpanded = false,
      inactive = false,
      width = Window.DEFAULT_WIDTH,
      height = Window.DEFAULT_HEIGHT,
      onHide,
      onExpand,
      onNarrow,
      onClose,
      draggable,
      ...otherProps
    } = this.props;
    return (
      <div
        ref={ref => {
          this.window = ref;
        }}
        className={
          "ui-window" +
          (inactive ? " ui-window-inactive" : "") +
          (className ? " " + className : "")
        }
        style={draggable ? styles : { width, height, ...styles }}
        {...otherProps}
      >
        <div
          className="ui-window-head"
          ref={ref => {
            this.head = ref;
          }}
        >
          <div className="ui-window-head-content">
            {icon && <UI.Icon className="ui-window-icon" small id={icon} />}
            <div className="ui-window-head-buttons">
              {onHide && (
                <button
                  className="ui-window-head-button ui-window-head-button-hide"
                  onMouseUp={e => {
                    e.preventDefault();
                    onHide(e);
                  }}
                >
                  Hide
                </button>
              )}
              {onExpand && !defaultExpanded && (
                <button
                  className="ui-window-head-button ui-window-head-button-expand"
                  onMouseUp={e => {
                    e.preventDefault();
                    onExpand(e);
                  }}
                >
                  Expand
                </button>
              )}
              {onNarrow && defaultExpanded && (
                <button
                  className="ui-window-head-button ui-window-head-button-narrow"
                  onMouseUp={e => {
                    e.preventDefault();
                    onNarrow(e);
                  }}
                >
                  Expand
                </button>
              )}
              {onClose && (
                <button
                  className="ui-window-head-button ui-window-head-button-close"
                  onMouseUp={e => {
                    e.preventDefault();
                    onClose(e);
                  }}
                >
                  Close
                </button>
              )}
            </div>
            <div className="ui-window-title noselect">{title}</div>
            <div className="cleartype" />
          </div>
        </div>
        <div className="ui-window-content">{children}</div>
      </div>
    );
  }

  render() {
    const { draggable } = this.props;
    if (draggable) {
      return <Rnd {...draggable}>{this.renderBody()}</Rnd>;
    } else {
      return <React.Fragment>{this.renderBody()}</React.Fragment>;
    }
  }
}

Window.DEFAULT_WIDTH = "500px";
Window.DEFAULT_HEIGHT = "auto";

Window.propTypes = {
  children: PropTypes.node,
  styles: PropTypes.shape({}),
  inactive: PropTypes.bool,
  className: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  draggable: PropTypes.shape({}),
  defaultExpanded: PropTypes.bool,
  onMouseDown: PropTypes.func,
  icon: PropTypes.string,
  onHide: PropTypes.func,
  onExpand: PropTypes.func,
  onClose: PropTypes.func,
  onNarrow: PropTypes.func,
};
