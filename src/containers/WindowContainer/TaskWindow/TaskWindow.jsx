import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  setRenderOptions,
  addTab,
  TabType,
  addSound,
} from "../../../actions/desktop";
import "./styles.scss";
import { fetchTask, makeTaskSolved } from "../../../actions/tasks";
import { WindowTabs } from "../../WindowsTabs/WindowTabs";
import * as UI from "../../../components/UI";
import api from "../../../utils/api";
import { TimesLeft } from "../../../components/TimesLeft/TimesLeft";
import { withTranslation } from "react-i18next";
import checkFailSound from "./check-fail.mp3";
import checkSuccessSound from "./check-success.mp3";
import { TaskGraph } from "../../../components/TaskGraph/TaskGraph";

class TaskWindowContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { flagSending: false, errorCode: null };
    this.sendFlag = this.sendFlag.bind(this);
  }

  sendFlag(e) {
    e.preventDefault();
    const {
      flag: { value: flag },
    } = e.target;
    const {
      s,
      task: { minPrice, maxPrice, solvedTeams },
    } = this.props;
    this.setState({ flagSending: true });
    api
      .sendFlag(this.props.task.id, flag)
      .then(result => {
        const { errorCode = -1 } = result;
        if (errorCode === 0 || errorCode === 2) {
          this.props.playSound(checkSuccessSound);
          this.props.makeTaskSolved(
            this.props.task.id,
            Math.round(
              TaskGraph.func(minPrice, maxPrice, s)(solvedTeams.length + 1)
            )
          );
        } else {
          this.props.playSound(checkFailSound);
        }
        this.setState({ flagSending: false, errorCode });
      })
      .catch(() => {
        this.props.playSound(checkFailSound);
        this.setState({ flagSending: false, errorCode: -1 });
      });
  }

  componentDidMount() {
    const {
      firstRender,
      tabId,
      taskId,
      setRenderOptions,
      fetchTask,
      task,
      t,
    } = this.props;

    if (!task) {
      fetchTask(taskId);
      return;
    }

    if (firstRender) {
      setRenderOptions(tabId, {
        firstRender: false,
        title: t("w-task.title", { name: task.name }),
        icon: task.solved ? "task-solved" : "task",
        minSize: { height: 500, width: 450 },
        size: { height: 500, width: 450 },
        resizable: true,
      });
    }

    if (!task.loaded) {
      fetchTask(taskId);
    }
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (!this.props.task || !props.task) return;
    if (
      this.props.task.name !== props.task.name ||
      this.props.task.solved !== props.task.solved
    ) {
      props.setRenderOptions(props.tabId, {
        title: props.t("w-task.title", { name: props.task.name }),
        icon: props.task.solved ? "task-solved" : "task",
      });
    }
  }

  render() {
    const { task, taskCategory, fetchTask, t } = this.props;
    const errorCodes = t("w-task.tab1.codes", {
      returnObjects: true,
    });
    const codeUnknown = t("w-task.tab1.code_unknown");
    const lang = this.props.i18n.language;
    if (!task) return null;
    return (
      <div className="task__container">
        <WindowTabs activeTabId={1}>
          <WindowTabs.Tab id={1} name={t("w-task.tab1.title")}>
            <React.Fragment>
              <table cellPadding="0" cellSpacing="0" border="0">
                <tbody>
                  <tr>
                    <td
                      className="task__property-cell"
                      title={taskCategory.name}
                    >
                      <UI.Icon id={taskCategory.icon} />{" "}
                    </td>
                    <td
                      className="task__property-cell"
                      style={{ paddingTop: 10, width: "100%" }}
                    >
                      <UI.TextInput
                        value={task.name}
                        disabled
                        style={{ width: "100%" }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="task__property-sep" />
              <table cellPadding="0" cellSpacing="0" border="0">
                <tbody>
                  <tr>
                    <td className="task__property-cell">
                      {t("w-task.tab1.price")}
                    </td>
                    <td className="task__property-cell">
                      {t("w-task.tab1.points", { count: task.price })}
                    </td>
                  </tr>
                  <tr>
                    <td className="task__property-cell">
                      {t("w-task.tab1.solved")}
                    </td>
                    <td className="task__property-cell">
                      {t("w-task.tab1.teams", { count: task.solvedCount })}
                    </td>
                  </tr>
                  <tr>
                    <td className="task__property-cell">
                      {t("w-task.tab1.updated")}
                    </td>
                    <td
                      className="task__property-cell"
                      style={{ width: "100%" }}
                    >
                      {task.loading ? (
                        <span style={{ color: "gray" }}>
                          {t("w-task.tab1.updating")}
                        </span>
                      ) : (
                        <span>
                          <TimesLeft time={task.loaded} /> (
                          <span
                            className="task__refresh-link"
                            onClick={() => fetchTask(task.id)}
                          >
                            {t("w-task.tab1.update")}
                          </span>
                          )
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div
                className="task__description-container"
                dangerouslySetInnerHTML={{
                  __html: task.description
                    ? task.description[lang]
                    : t("w-task.tab1.loading"),
                }}
              />
              {task.attaches && task.attaches.length > 0 && (
                <React.Fragment>
                  <table cellPadding="0" cellSpacing="0" border="0">
                    <tbody>
                      <tr>
                        <td className="task__property-cell">
                          {t("w-task.tab1.attaches")}
                        </td>
                        <td
                          className="task__property-cell"
                          style={{ width: "100%" }}
                        >
                          <ul className="task__property-attaches">
                            {task.attaches.map((attch, index) => (
                              <li key={index}>
                                <a href={attch.path} download>
                                  <UI.Icon id="attach" small />
                                  <span>{attch.name}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="task__property-sep" />
                </React.Fragment>
              )}
              <table cellPadding="0" cellSpacing="0" border="0">
                <tbody>
                  <tr>
                    <td className="task__property-cell">
                      {t("w-task.tab1.status")}
                    </td>
                    <td
                      className="task__property-cell"
                      style={{ width: "100%" }}
                    >
                      {task.solved ? (
                        <span style={{ color: "green" }}>
                          {t("w-task.tab1.status_solved")}
                        </span>
                      ) : (
                        <span>{t("w-task.tab1.status_not_solved")}</span>
                      )}
                    </td>
                  </tr>
                  {!task.solved && (
                    <tr>
                      <td className="task__property-cell">
                        {t("w-task.tab1.flag")}
                      </td>
                      <td
                        className="task__property-cell"
                        style={{ width: "100%" }}
                      >
                        <form onSubmit={this.sendFlag}>
                          <UI.TextInput
                            name="flag"
                            placeholder="TyumenCTF{any_symbols_here}"
                            style={{ width: "100%", marginTop: -2 }}
                            autoComplete="off"
                            required
                          />
                          <UI.Button
                            type="submit"
                            style={{ marginTop: 7, float: "right" }}
                            disabled={this.state.flagSending}
                          >
                            {this.state.flagSending
                              ? t("w-task.tab1.sending")
                              : t("w-task.tab1.send")}
                          </UI.Button>
                          {!this.state.flagSending &&
                            +this.state.errorCode !== 0 && (
                              <div className="task__error-message">
                                {errorCodes[this.state.errorCode] ||
                                  codeUnknown}
                              </div>
                            )}
                        </form>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </React.Fragment>
          </WindowTabs.Tab>
          <WindowTabs.Tab
            id={2}
            name={t("w-task.tab2.title", { count: task.solvedCount })}
          >
            {task.description ? (
              this.renderSolvedTeams()
            ) : (
              <div>{t("w-task.tab2.loading")}</div>
            )}
          </WindowTabs.Tab>
        </WindowTabs>
      </div>
    );
  }

  renderSolvedTeams() {
    const {
      task: { solvedTeams, price, minPrice, maxPrice },
      openTeam,
      s,
      t,
    } = this.props;
    return (
      <React.Fragment>
        <TaskGraph
          minPrice={minPrice}
          maxPrice={maxPrice}
          curPrice={price}
          s={s}
          curSolved={solvedTeams.length}
        />
        <div className="task__solved-teams-count">
          {t("w-task.tab2.subtitle", { count: solvedTeams.length })}
        </div>
        {solvedTeams.length > 0 && (
          <ul
            className={
              "task__description-container task__solved-teams" +
              (solvedTeams.length > 10 ? " task__solved-teams-compact" : "")
            }
          >
            {solvedTeams.map(st => (
              <li key={st.id} onClick={() => openTeam(st.id)}>
                {st.name}
              </li>
            ))}
          </ul>
        )}
      </React.Fragment>
    );
  }
}

TaskWindowContainer.propTypes = {
  setRenderOptions: PropTypes.func,
  taskId: PropTypes.number,
  tabId: PropTypes.number,
  firstRender: PropTypes.bool,
  fetchTask: PropTypes.func,
  task: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    solved: PropTypes.bool,
  }),
  taskCategory: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    icon: PropTypes.string,
  }),
  openTeam: PropTypes.func,
  makeTaskSolved: PropTypes.func,
  t: PropTypes.func,
  i18n: PropTypes.shape({}),
  playSound: PropTypes.func,
  s: PropTypes.number,
};

const mapStateToProps = (state, ownProps) => {
  const task = state.tasks.items.find(task => task.id === ownProps.taskId);
  return {
    firstRender: state.desktop.tabs.find(tab => tab.id === ownProps.tabId)
      .render.firstRender,
    task,
    taskCategory: state.tasks.categories.find(
      c => task && c.id === task.categoryId
    ) || { icon: "folder", name: "Undefined" },
    s: state.contest.s,
  };
};

const mapDispatchToProps = dispatch => ({
  setRenderOptions: (id, renderOptions) =>
    dispatch(setRenderOptions(id, renderOptions)),
  fetchTask: taskId => dispatch(fetchTask(taskId)),
  openTeam: teamId => dispatch(addTab(TabType.TEAM, { teamId })),
  makeTaskSolved: (taskId, price) => dispatch(makeTaskSolved(taskId, price)),
  playSound: url => dispatch(addSound(url)),
});

export const TaskWindow = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(TaskWindowContainer));
