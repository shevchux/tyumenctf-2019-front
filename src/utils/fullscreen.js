export const fullscreen = {
  get isFullscreenEnabled() {
    return (
      (document.fullscreenEnabled && document.fullscreenEnabled !== null) ||
      (document.webkitFullscreenEnabled &&
        document.webkitFullscreenEnabled !== null) ||
      (document.mozFullscreenEnabled &&
        document.mozFullscreenEnabled !== null) ||
      (document.msFullscreenEnabled && document.msFullscreenEnabled !== null) ||
      false
    );
  },
  get isFullscreenOn() {
    return (
      (document.fullscreenElement && document.fullscreenElement !== null) ||
      (document.webkitFullscreenElement &&
        document.webkitFullscreenElement !== null) ||
      (document.mozFullScreenElement &&
        document.mozFullScreenElement !== null) ||
      (document.msFullscreenElement && document.msFullscreenElement !== null) ||
      false
    );
  },
  requestFullscreen() {
    var docElm = document.body;
    if (docElm.requestFullscreen) {
      docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
      docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullScreen) {
      docElm.webkitRequestFullScreen();
    } else if (docElm.msRequestFullscreen) {
      docElm.msRequestFullscreen();
    }
  },
  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  },
};
