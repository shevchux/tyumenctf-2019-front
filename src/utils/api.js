import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { USE_CLIENT_MOCK_API, CLIENT_MOCK_WITH_LOGIN_PAGE } from "../config.js";

const axiosInstance = axios.create({
  responseType: "json",
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
});

const checkLoggedIn = data => {
  if (data && data.loggedIn === false) {
    window.location.reload();
  }
  return data;
};

const appendClientNow = data => {
  if (data && data.times) {
    data.times.clientNow = Date.now();
  }
  return data;
};

if (USE_CLIENT_MOCK_API) {
  const mock = new MockAdapter(axiosInstance, { delayResponse: 250 });

  mock
    .onGet("/getTeam")
    .reply(
      200,
      CLIENT_MOCK_WITH_LOGIN_PAGE
        ? require("./mocks/getTeam.notLoggedIn.json")
        : require("./mocks/getTeam.loggedIn.json")
    )

    .onGet("/getRating")
    .reply(200, require("./mocks/getRating.json"))

    .onGet("/getNews")
    .reply(200, require("./mocks/getNews.json"))

    .onGet("/getTeamInfo")
    .reply(200, require("./mocks/getTeamInfo.json"))

    .onGet("/refresh")
    .reply(200, require("./mocks/refresh.json"))

    .onGet("/getTask")
    .reply(200, require("./mocks/getTask.json"))

    .onGet("/getTasks")
    .reply(200, require("./mocks/getTasks.json"))

    .onPost("/login")
    .reply(200, require("./mocks/login.json"))

    .onPost("/logout")
    .reply(200, require("./mocks/logout.json"))

    .onPost("/checkFlag")
    .reply(200, require("./mocks/sendFlag.json"));
}

export default {
  getNews: () =>
    axiosInstance
      .get("/getNews")
      .then(response => response.data)
      .then(checkLoggedIn),

  getRating: groupId => {
    return axiosInstance
      .get("/getRating", {
        params: {
          group: groupId,
        },
      })
      .then(response => response.data)
      .then(checkLoggedIn);
  },

  getTeamInfo: teamId => {
    return axiosInstance
      .get("/getTeamInfo", {
        params: {
          teamId,
        },
      })
      .then(response => response.data)
      .then(checkLoggedIn);
  },

  refresh: () =>
    axiosInstance
      .get("/refresh")
      .then(response => response.data)
      .then(checkLoggedIn),

  getTask: taskId => {
    return axiosInstance
      .get("/getTask", {
        params: {
          taskId,
        },
      })
      .then(response => response.data)
      .then(checkLoggedIn);
  },

  getTasks: (categoryId = null) => {
    return axiosInstance
      .get("/getTasks", {
        params: {
          categoryId,
        },
      })
      .then(response => response.data)
      .then(checkLoggedIn);
  },

  getTeam: () =>
    axiosInstance
      .get("/getTeam")
      .then(response => response.data)
      .then(appendClientNow),

  login: (login, password) => {
    const formData = new FormData();
    formData.append("login", login);
    formData.append("password", password);
    return axiosInstance
      .post("/login", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(response => response.data)
      .then(appendClientNow);
  },

  logout: () => axiosInstance.post("/logout").then(response => response.data),

  sendFlag: (taskId, flag) => {
    const formData = new FormData();
    formData.append("taskId", taskId);
    formData.append("flag", flag.trim());
    return axiosInstance
      .post("/checkFlag", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(response => response.data)
      .then(checkLoggedIn);
  },
};

export function Delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
