import { handleActions, combineActions } from "redux-actions";
import {
  setSoundVolume,
  addSound,
  removeSound,
  setEmulatorMode,
  addTab,
  removeTab,
  frontTab,
  setRenderOptions,
  setPayload,
  hideTab,
  enableGameMode,
  setWallpapers,
  setActiveWallpaper,
} from "../actions/desktop";
import { DEFAULT_SOUND_VOLUME, DEFAULT_EMULATOR_MODE } from "../config";
import defaultWallpaperImage from "../components/Workspace/wallpaper.jpg";
import UTMNWallpaperImage from "../components/Workspace/coop_bg.jpg";

const defaultState = {
  soundVolume: DEFAULT_SOUND_VOLUME,
  sounds: [],
  tabs: [],
  emulatorMode: DEFAULT_EMULATOR_MODE,
  gameMode: false,
  wallpapers: [
    { name: "Default Windows XP Wallpaper", url: defaultWallpaperImage },
    { name: "UTMN Wallpaper", url: UTMNWallpaperImage },
  ],
  activeWallpaper: 0,
};

const desktopReducer = handleActions(
  {
    [combineActions(
      setSoundVolume,
      setEmulatorMode,
      enableGameMode,
      setWallpapers,
      setActiveWallpaper
    )]: (state, { payload }) => ({
      ...state,
      ...payload,
    }),
    [addSound]: (state, { payload }) => ({
      ...state,
      sounds: [...state.sounds, payload],
    }),
    [removeSound]: (state, { payload }) => ({
      ...state,
      sounds: state.sounds.filter(({ id }) => id !== payload.id),
    }),
    [addTab]: (state, { payload: tab }) => ({
      ...state,
      tabs: [...state.tabs, tab],
    }),
    [removeTab]: (state, { payload: { id } }) => ({
      ...state,
      tabs: state.tabs.filter(tab => tab.id !== id),
    }),
    [hideTab]: (state, { payload: { id } }) => {
      const tabs = [...state.tabs].sort(t1 => (t1.id === id ? -1 : 1));
      // Replacing selected tab in the start
      tabs[0].render.hidden = true;
      return { ...state, tabs };
    },
    [frontTab]: (state, { payload: { id } }) => {
      const tabs = [...state.tabs].sort((_, t2) => (t2.id === id ? -1 : 1));
      // Replacing selected tab in the start
      tabs[tabs.length - 1].render.hidden = false;
      return { ...state, tabs };
    },
    [setPayload]: (state, { payload: { id, payload } }) => ({
      ...state,
      tabs: state.tabs.map(tab => ({
        ...tab,
        payload: { ...tab.payload, ...(tab.id === id ? payload : {}) },
      })),
    }),
    [setRenderOptions]: (state, { payload: { id, renderOptions } }) => ({
      ...state,
      tabs: state.tabs.map(tab => ({
        ...tab,
        render: { ...tab.render, ...(tab.id === id ? renderOptions : {}) },
      })),
    }),
  },
  defaultState
);

export default desktopReducer;
