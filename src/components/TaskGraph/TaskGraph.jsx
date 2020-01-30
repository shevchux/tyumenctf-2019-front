import React from "react";
import PropTypes from "prop-types";

export class TaskGraph extends React.Component {
  static addResizeHandler(element, callback) {
    let elementHeight = element.clientHeight,
      elementWidth = element.clientWidth;
    element.width = elementWidth;
    element.height = elementHeight;
    callback();
    return setInterval(function() {
      if (
        element.clientHeight !== elementHeight ||
        element.clientWidth !== elementWidth
      ) {
        elementHeight = element.clientHeight;
        elementWidth = element.clientWidth;
        element.width = elementWidth;
        element.height = elementHeight;
        callback();
      }
    }, 1000);
  }

  static removeResizeHandler(id) {
    clearInterval(id);
  }

  componentDidMount() {
    const { minPrice, maxPrice, curPrice, curSolved, s } = this.props;
    this.resizeHandlerId = TaskGraph.addResizeHandler(this.canvas, () =>
      TaskGraph.draw(this.canvas, minPrice, maxPrice, curPrice, curSolved, s)
    );
  }

  componentWillUnmount() {
    TaskGraph.removeResizeHandler(this.resizeHandlerId);
  }

  static draw(canvas, minPrice, maxPrice, curPrice, curSolved, s) {
    const f = TaskGraph.func(minPrice, maxPrice, s);

    const xMin = 0;
    const xMax = s * 2;
    const yMin = -250;
    const yMax = maxPrice + 135;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    const ctx = canvas.getContext("2d");
    TaskGraph._setPixelated(ctx);

    // Background
    ctx.fillStyle = TaskGraph.BACKGROUND_COLOR;
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.translate(0.5, 0.5);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = TaskGraph.GRID_COLOR;

    for (let i = -1; i < width; i += TaskGraph.CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, -1);
      ctx.lineTo(i, height);
      ctx.stroke();
    }

    for (let i = -1; i < height; i += TaskGraph.CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(-1, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw function

    const cx = x => (x * width) / (xMax - xMin);
    const cy = y => ((yMax - y) * height) / (yMax - yMin);

    ctx.translate(0.5, 0.5);
    ctx.lineWidth = 1.3;
    ctx.strokeStyle = TaskGraph.FUNCTION_COLOR;
    ctx.beginPath();

    ctx.moveTo(cx(xMin - 1), cy(f(xMin - 1)));
    for (let x = xMin - 1; x <= xMax; x += 1) {
      ctx.lineTo(cx(x), cy(f(x)));
    }
    ctx.stroke();

    // Draw labels

    ctx.font = "10px Tahoma";
    ctx.fillStyle = TaskGraph.FUNCTION_COLOR;
    ctx.textAlign = "right";
    ctx.fillText("min: " + minPrice + " points", width - 4, cy(minPrice) - 5);

    console.log(Math.round(f(curSolved)))
    
    for (let i = 0; i < 3; i++) {
      ctx.font = "10px Tahoma";
      ctx.fillStyle = TaskGraph.CROSS_COLOR;
      ctx.textAlign = "right";
      ctx.fillText(
        "current: " + curPrice + " points",
        width - 4,
        cy(f(curSolved)) + 10
      );
    }

    ctx.font = "10px Tahoma";
    ctx.fillStyle = TaskGraph.GRID_COLOR;
    ctx.textAlign = "left";
    ctx.fillText("0", 0, height - 5);
    ctx.fillText("0", 0, height - 5);

    ctx.textAlign = "center";
    ctx.fillText(s + " solves", cx(s), height - 5);
    ctx.fillText(s + " solves", cx(s), height - 5);

    ctx.font = "10px Tahoma";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.fillText(curSolved + " solves", cx(curSolved) + 3, height - 5);

    // Draw cross

    ctx.strokeStyle = TaskGraph.CROSS_COLOR;
    ctx.beginPath();

    for (let i = 0; i < 3; i++) {
      ctx.moveTo(cx(curSolved), -1);
      ctx.lineTo(cx(curSolved), height + 1);

      ctx.moveTo(-1, cy(f(curSolved)));
      ctx.lineTo(width + 1, cy(f(curSolved)));
    }
    ctx.stroke();

    ctx.fillStyle = TaskGraph.CROSS_COLOR;
    ctx.fillRect(cx(curSolved) - 3, cy(f(curSolved)) - 3, 6, 6);
  }

  static _setPixelated(ctx) {
    ctx["imageSmoothingEnabled"] = false; /* standard */
    ctx["mozImageSmoothingEnabled"] = false; /* Firefox */
    ctx["oImageSmoothingEnabled"] = false; /* Opera */
    ctx["webkitImageSmoothingEnabled"] = false; /* Safari */
    ctx["msImageSmoothingEnabled"] = false; /* IE */
  }

  render() {
    return (
      <canvas
        id="canvas"
        width="400"
        height="125"
        ref={ref => (this.canvas = ref)}
      />
    );
  }
}

TaskGraph.BACKGROUND_COLOR = "#000";
TaskGraph.GRID_COLOR = "#008040";
TaskGraph.FUNCTION_COLOR = "#0f0";
TaskGraph.CROSS_COLOR = "#f00";
TaskGraph.CELL_SIZE = 15;

TaskGraph.func = (min, max, s) => x =>
  Math.max(min, ((min - max) * (s ** (x / s / 2) - 1)) / (s ** 0.5 - 1) + max);

TaskGraph.propTypes = {
  minPrice: PropTypes.number,
  maxPrice: PropTypes.number,
  curPrice: PropTypes.number,
  curSolved: PropTypes.number,
  s: PropTypes.number,
};
