import { combineReducers } from "redux";
import login from "./login";
import logout from "./logout";
import team from "./team";
import contest from "./contest";
import tasks from "./tasks";
import desktop from "./desktop";

export default combineReducers({
  login,
  logout,
  team,
  contest,
  tasks,
  desktop
});
