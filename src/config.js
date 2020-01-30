export const DEFAULT_LANG = "ru";
export const TOGGLE_LANG = {
  ru: "en",
  en: "ru",
};
export const DEFAULT_SOUND_VOLUME = 100;
export const DEFAULT_EMULATOR_MODE = true;

export const USE_CLIENT_MOCK_API = true;
export const CLIENT_MOCK_WITH_LOGIN_PAGE = false;


export const REFRESH_INTERVAL = 2 * 60 * 1000; // 2 min
export const REFRESH_INTERVAL_DELTA = 5 * 1000; // +- 5 sec

export const FINAL_RATING_URL = "https://tyumenctf.ru/rating";

export const CONTEST_STATUS = {
  REGISTRATION_RUNNING: "0_REGISTRATION_RUNNING",
  BEFORE_CONTEST_START: "1_BEFORE_CONTEST_START",
  CONTEST_RUNNING: "2_CONTEST_RUNNING",
  SOLVE_UP_RUNNING: "3_SOLVE_UP_RUNNING",
  SOLVE_UP_ENDS: "4_SOLVE_UP_ENDS"
}

export const TEAM_GROUPS = {
  0: "Все команды",
  1: "Студенты",
  2: "Школьники",
  4: "Вне зачёта",
};

export const CATEGORY_ICONS = {
  0: "folder",
  "pwn": "folder-pwn",
  "ppc": "folder-ppc",
  "forensic": "folder-forensic",
  "web": "folder-web",
  "misc": "folder-misc",
  "crypto": "folder-crypto",
  "joy": "folder-joy",
  "osint": "folder-osint",
  "reverse": "folder-reverse",
  "stegano": "folder-stegano",
};

/* if beenLoggedIn and not beenLoggedIn before LOADING_TIMEOUT and GREETING_TIMEOUT */
export const GETTEAM_TIMEOUT = 1000;
/* if beenLoggedIn */
export const LOADING_TIMEOUT = 1000;
/* if not beenLoggedIn */
export const GREETING_TIMEOUT = 2000;
/* endif */

export const SHUTDOWN_TIMEOUT = 2000;

export const FEEDBACK_URL = "https://forms.gle/6gYWJdCuDtmKWr3e7";