import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setRenderOptions, addTab, TabType } from "../../../actions/desktop";
import { WindowTabs } from "../../WindowsTabs/WindowTabs";
import api from "../../../utils/api";
import * as UI from "../../../components/UI";
import { TimesLeft } from "../../../components/TimesLeft/TimesLeft";
import { TEAM_GROUPS } from "../../../config";
import "./styles.scss";
import { TimesFromStart } from "../../../components/TimesFromStart/TimesFromStart";
import { withTranslation } from "react-i18next";

class TeamWindowContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, loaded: null };
  }

  componentDidMount() {
    const { firstRender, tabId, setRenderOptions, t } = this.props;

    if (firstRender) {
      setRenderOptions(tabId, {
        firstRender: false,
        title: t("w-team.title"),
        icon: "group",
        size: { height: 450, width: 400 },
        minSize: { height: 450, width: 400 },
        resizable: true,
      });
    }

    this.refresh();
  }

  refresh() {
    this.setState({ loading: true });
    api
      .getTeamInfo(this.props.teamId)
      .then(
        ({
          id,
          name,
          logo,
          groupId,
          personCount,
          place,
          globalPlace,
          score,
          solvedTasks,
        }) => {
          this.setState({
            loading: false,
            loaded: {
              id,
              name,
              logo,
              groupId,
              membersCount: personCount,
              place,
              globalPlace,
              score,
              time: Date.now(),
              solvedTasks: solvedTasks.reverse().map(({ id, name, curPrice, time }) => ({
                id,
                name,
                price: curPrice,
                time: time * 1000,
              })),
            },
          });
          this.props.setRenderOptions(this.props.tabId, {
            title: name,
          });
        }
      )
      .catch(() => this.setState({ loading: false, loaded: false }));
  }

  render() {
    const { loading, loaded: team } = this.state;
    const { tasksCount, t } = this.props;
    const teamGroups = t("config.teamGroups", { returnObjects: true });
    return (
      <WindowTabs activeTabId={1}>
        <WindowTabs.Tab id={1} name={t("w-team.subtitle")}>
          {loading && !team && (
            <div style={{ padding: "20px 0", textAlign: "center" }}>
              {t("w-team.loading")}
            </div>
          )}
          {!loading && team === false && (
            <div style={{ padding: "20px 0", textAlign: "center" }}>
              {t("w-team.error")}
              <br />
              <br />
              <UI.Button onClick={() => this.refresh()}>
                {t("w-team.retry")}
              </UI.Button>
            </div>
          )}
          {team && (
            <React.Fragment>
              <table cellPadding="0" cellSpacing="0" border="0">
                <tbody>
                  <tr>
                    <td className="task__property-cell">
                      <img src={team.logo} alt="photo" />
                    </td>
                    <td
                      className="task__property-cell"
                      style={{ paddingTop: 10, width: "100%" }}
                    >
                      <UI.TextInput
                        value={team.name}
                        disabled
                        style={{ width: "100%" }}
                      />
                      <div style={{ marginTop: 5 }}>
                        {t("w-team.members", { count: team.membersCount })}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="task__property-sep" />
              <table cellPadding="0" cellSpacing="0" border="0">
                <tbody>
                  <tr>
                    <td className="task__property-cell">
                      {t("w-team.solved")}
                    </td>
                    <td
                      className="task__property-cell"
                      style={{ width: "100%" }}
                    >
                      {t("w-team.tasks", {
                        count: team.solvedTasks.length,
                        outOfCount: tasksCount,
                      })}
                      {tasksCount > 0 &&
                        " (" +
                          Math.round(
                            (team.solvedTasks.length / tasksCount) * 1000
                          ) /
                            10 +
                          "%)"}
                    </td>
                  </tr>
                  <tr>
                    <td className="task__property-cell">
                      {t("w-team.updated")}
                    </td>
                    <td className="task__property-cell">
                      {loading ? (
                        <span style={{ color: "gray" }}>
                          {t("w-team.updating")}
                        </span>
                      ) : (
                        <span>
                          <TimesLeft time={team.time} /> (
                          <span
                            className="task__refresh-link"
                            onClick={() => this.refresh()}
                          >
                            {t("w-team.update")}
                          </span>
                          )
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="task__description-container">
                {team.solvedTasks.length === 0 && t("w-team.emptyTaskList")}
                <ol className="tcard__solved-tasks">
                  {team.solvedTasks.map(st => (
                    <li key={st.id}>
                      <div>
                        <strong
                          onClick={() => this.props.openTask(st.id)}
                          className="tcard__task-link"
                        >
                          {st.name}
                        </strong>
                      </div>
                      <div style={{ fontSize: 11 }}>
                        +{t("w-team.points", { count: st.price })}{" "}
                        <span style={{ color: "gray", marginLeft: 2 }}>
                          <TimesFromStart time={st.time} />
                        </span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              <table cellPadding="0" cellSpacing="0" border="0">
                <tbody>
                  <tr>
                    <td className="task__property-cell">{t("w-team.score")}</td>
                    <td
                      className="task__property-cell"
                      style={{ width: "100%" }}
                    >
                      {t("w-team.points", { count: team.score })}
                    </td>
                  </tr>
                  <tr>
                    <td className="task__property-cell">{t("w-team.place")}</td>
                    <td className="task__property-cell">
                      {team.place} ({teamGroups[team.groupId]})
                    </td>
                  </tr>
                  <tr>
                    <td className="task__property-cell">{t("w-rating.position.globalPlace")}</td>
                    <td className="task__property-cell">
                      {team.globalPlace}
                    </td>
                  </tr>
                </tbody>
              </table>
            </React.Fragment>
          )}
        </WindowTabs.Tab>
      </WindowTabs>
    );
  }
}

TeamWindowContainer.propTypes = {
  setRenderOptions: PropTypes.func,
  tabId: PropTypes.number,
  teamId: PropTypes.number,
  firstRender: PropTypes.bool,
  tasksCount: PropTypes.number,
  openTask: PropTypes.func,
  t: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  firstRender: state.desktop.tabs.find(tab => tab.id === ownProps.tabId).render
    .firstRender,
  tasksCount: state.tasks.items.length,
});

const mapDispatchToProps = dispatch => ({
  setRenderOptions: (id, renderOptions) =>
    dispatch(setRenderOptions(id, renderOptions)),
  openTask: taskId => dispatch(addTab(TabType.TASK, { taskId })),
});

export const TeamWindow = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(TeamWindowContainer));
