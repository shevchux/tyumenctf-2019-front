import { createAction } from "redux-actions";
import { DEFAULT_SOUND_VOLUME, DEFAULT_EMULATOR_MODE, USE_CLIENT_MOCK_API } from "../config";

/* Tabs */

let tabId = 0;

const getNextPosition = (() => {
  let offset = { x: 100, y: 20 };
  let positionDelta = { x: 30, y: 30 };
  let positionLimit = { x: 450, y: 150 };

  let position = { x: 0 - positionDelta.x, y: 0 - positionDelta.y };
  return () => {
    position.x += positionDelta.x;
    position.y += positionDelta.y;
    return {
      x: offset.x + (position.x % positionLimit.x),
      y: offset.y + (position.y % positionLimit.y),
    };
  };
})();

export const TabType = {
  CATEGORY_TASKS: "CATEGORY_TASKS",
  DOS_GAME: "DOS_GAME",
  TASK: "TASK",
  EXECUTE: "EXECUTE",
  ABOUT: "ABOUT",
  RATING: "RATING",
  RULES: "RULES",
  NEWS: "NEWS",
  TEAM: "TEAM",
  WALLPAPER: "WALLPAPER",
};

export const addTab = createAction(
  "DESKTOP_ADD_TAB",
  (type, payload = {}, renderOptions = {}) => ({
    id: tabId++,
    type,
    payload,
    render: {
      title: null,
      icon: null,
      hidden: false,
      firstRender: true,
      position: getNextPosition(),
      size: { height: 200, width: 300 },
      resizable: false,
      minSize: { height: 200, width: 300 },
      ...renderOptions,
    },
  })
);

export const removeTab = createAction("DESKTOP_REMOVE_TAB", id => ({ id }));

export const frontTab = createAction("DESKTOP_FRONT_TAB", id => ({ id }));

export const hideTab = createAction("DESKTOP_HIDE_TAB", id => ({ id }));

export const setRenderOptions = createAction(
  "DESKTOP_SET_RENDER_OPRIONS",
  (id, renderOptions = {}) => ({ id, renderOptions })
);

export const setPayload = createAction(
  "DESKTOP_SET_PAYLOAD",
  (id, payload = {}) => ({ id, payload })
);

/* Sounds Queue */

export const setSoundVolume = createAction(
  "DESKTOP_SET_SOUND_VOLUME",
  soundVolume => {
    localStorage.setItem("soundVolume", soundVolume);
    return { soundVolume };
  }
);

let soundId = 0;

export const addSound = createAction("DESKTOP_ADD_SOUND", url => ({
  id: soundId++,
  url,
}));

export const removeSound = createAction("DESKTOP_REMOVE_SOUND", id => ({
  id,
}));

/* Display mode */

export const setEmulatorMode = createAction(
  "DESKTOP_SET_EMULATOR_MODE",
  emulatorMode => {
    localStorage.setItem("emulatorMode", emulatorMode);
    return { emulatorMode };
  }
);

/* Game mode */

export const enableGameMode = createAction("DESKTOP_ENABLE_GAME_MODE", () => {
  localStorage.setItem("gameMode", "true");
  return { gameMode: true };
});

/* WALLPAPER */

export const setActiveWallpaper = createAction(
  "DESKTOP_SET_ACTIVE_WALLPAPER",
  activeWallpaper => {
    localStorage.setItem("activeWallpaper", activeWallpaper.toString());
    return { activeWallpaper };
  }
);

export const setWallpapers = createAction(
  "DESKTOP_ADD_WALLPAPERS",
  wallpapers => ({
    wallpapers,
  })
);

export const pushWallpaper = (url, name) => (dispatch, getState) => {
  const wallpapers = [...getState().desktop.wallpapers, { url, name }];
  localStorage.setItem("wallpapers", JSON.stringify(wallpapers));
  dispatch(setWallpapers(wallpapers));
  dispatch(setActiveWallpaper(wallpapers.length - 1));
};

/* Sync with LocalStorage */

export const syncDesktopWithLocalStorage = () => dispatch => {
  const soundVolume = localStorage.getItem("soundVolume");
  dispatch(
    setSoundVolume(soundVolume === null ? DEFAULT_SOUND_VOLUME : +soundVolume)
  );

  const emulatorMode = localStorage.getItem("emulatorMode");
  dispatch(
    setEmulatorMode(
      emulatorMode === undefined
        ? DEFAULT_EMULATOR_MODE
        : emulatorMode === "true"
    )
  );

  const gameMode = "true" === localStorage.getItem("gameMode") || USE_CLIENT_MOCK_API;
  gameMode && dispatch(enableGameMode());

  const wallpapers = localStorage.getItem("wallpapers");
  wallpapers && dispatch(setWallpapers(JSON.parse(wallpapers)));

  const activeWallpaper = +localStorage.getItem("activeWallpaper");
  !isNaN(activeWallpaper) && dispatch(setActiveWallpaper(activeWallpaper));
};
