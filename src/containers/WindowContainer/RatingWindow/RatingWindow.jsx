import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setRenderOptions, addTab, TabType } from "../../../actions/desktop";
import { Dir } from "../../../components/Dir/Dir";
import { DirHead } from "../../../components/Dir/DirHead/DirHead";
import "./styles.scss";
import { fetchRating } from "../../../actions/contest";
import { DirIsland } from "../../../components/Dir/DirIsland/DirIsland";
import * as UI from "./../../../components/UI";
import { withTranslation } from "react-i18next";
import { TimesLeft } from "../../../components/TimesLeft/TimesLeft";
import { TimesFromStart } from "../../../components/TimesFromStart/TimesFromStart";
import { CONTEST_STATUS, FINAL_RATING_URL } from "../../../config";

class RatingWindowContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { groupId: null };
  }

  componentDidMount() {
    const { firstRender, t, tabId, setRenderOptions, groupId } = this.props;

    if (firstRender) {
      setRenderOptions(tabId, {
        firstRender: false,
        title: t("w-rating.title"),
        icon: "star",
        minSize: { height: 300, width: 650 },
        size: { height: 460, width: 750 },
        resizable: true,
      });
    }

    this.setGroup(groupId);
  }

  setGroup(groupId) {
    this.setState({ groupId });
    const rating = this.props.rating.find(rat => rat.id === groupId);
    if (!rating.loaded && !rating.loading) {
      this.props.getRating(groupId);
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const prev = this.props.rating.find(x => x.id === this.state.groupId);
    const next = nextProps.rating.find(x => x.id === this.state.groupId);
    if (prev && next && prev.loading && !next.loading) {
      this.scrollToCurrentTeam();
    }
  }

  scrollToCurrentTeam() {
    if (this.container && this.teamRow) {
      this.container.parentNode.scrollTo &&
        this.container.parentNode.scrollTo(0, this.teamRow.offsetTop - 35);
    }
  }

  render() {
    const { groupId } = this.state;
    const { t, statusType } = this.props;
    const teamGroups = t("config.teamGroups", { returnObjects: true });

    if (groupId === null) {
      return null;
    }

    const rating = this.props.rating.find(rat => rat.id === groupId);
    const { getRating, openTeam, team } = this.props;

    return (
      <Dir>
        <Dir.Head>
          <DirHead
            path={"SERV://TyumenCTF/2019/Rating/" + teamGroups[groupId]}
            loading={rating.loading}
            status={
              rating.loading ? (
                <span>{t("w-dir.refresh-loading")}</span>
              ) : (
                <span>
                  {t("w-dir.refresh-loaded")} <TimesLeft time={rating.loaded} />
                </span>
              )
            }
            onClick={() => getRating(groupId)}
          />
        </Dir.Head>
        <Dir.Left>
          <DirIsland title={t("w-rating.groups")}>
            <ul className="task-window-catlist">
              {Object.entries(teamGroups).map(([id, name]) => (
                <li
                  key={+id}
                  className="task-window-catitem"
                  onClick={() => this.setGroup(+id)}
                >
                  <UI.Icon id="group" small />
                  {+id === groupId ? (
                    <strong>{name}</strong>
                  ) : (
                    <span>{name}</span>
                  )}
                </li>
              ))}
            </ul>
          </DirIsland>
          <DirIsland
            title={
              t("w-rating.position.title") +
              (statusType >= CONTEST_STATUS.SOLVE_UP_RUNNING
                ? " (" + t("w-rating.position.solveup") + ")"
                : "")
            }
          >
            <p>
              <strong
                className="rating-team-name"
                onClick={() => openTeam(team.teamId)}
              >
                {team.name}
              </strong>
            </p>
            <p>
              <span>
                {t("w-rating.position.score")}{" "}
                {team.score === undefined ? "..." : team.score}
              </span>
              <br />
              <span>
                {t("w-rating.position.place")}{" "}
                {team.place === undefined ? "..." : team.place} (
                {teamGroups[this.props.groupId]})
              </span>
              <br />
              <span>
                {t("w-rating.position.globalPlace")}{" "}
                {team.globalPlace === undefined ? "..." : team.globalPlace}
              </span>
            </p>
          </DirIsland>
          {statusType >= CONTEST_STATUS.SOLVE_UP_RUNNING && (
            <DirIsland title={t("w-rating.position.results")}>
              <ul className="task-window-catlist">
                <li
                  className="task-window-catitem"
                  onClick={() => window.open(FINAL_RATING_URL)}
                >
                  <UI.Icon id="lock" small />
                  <span>{t("w-rating.position.out")}</span>
                </li>
              </ul>
            </DirIsland>
          )}
        </Dir.Left>
        <Dir.Right>
          <table
            cellPadding="0"
            cellSpacing="0"
            border="0"
            className="rating-list-table noselect"
            ref={ref => (this.container = ref)}
          >
            <thead>
              <tr>
                <th>#</th>
                <th>{t("w-rating.table.name")}</th>
                <th>{t("w-rating.table.score")}</th>
                <th>{t("w-rating.table.tasksSolved")}</th>
                <th>{t("w-rating.table.lastSend")}</th>
              </tr>
            </thead>
            <tbody>
              {rating.teams.map(ratingTeam => (
                <tr
                  key={ratingTeam.id}
                  ref={ref => {
                    if (ratingTeam.id === team.teamId) this.teamRow = ref;
                  }}
                  tabIndex="0"
                  onDoubleClick={() => openTeam(ratingTeam.id)}
                  className={
                    ratingTeam.id === team.teamId
                      ? " rating-list-table-teamrow-my"
                      : ""
                  }
                >
                  <td>{ratingTeam.place}</td>
                  <td className={"rating-list-table-teamrow"}>
                    <img src={ratingTeam.logo} alt="" />
                    {ratingTeam.name}{" "}
                    {ratingTeam.id === team.teamId && (
                      <span style={{ fontWeight: "normal" }}>
                        {t("w-rating.table.you")}
                      </span>
                    )}
                  </td>
                  <td>{ratingTeam.score}</td>
                  <td>{ratingTeam.tasksCount}</td>
                  <td style={{ color: "gray" }}>
                    {ratingTeam.tasksCount !== 0 && (
                      <TimesFromStart time={ratingTeam.lastActivity} />
                    )}
                  </td>
                </tr>
              ))}
              <tr>
                <td />
                <td />
              </tr>
            </tbody>
          </table>
        </Dir.Right>
      </Dir>
    );
  }
}

RatingWindowContainer.propTypes = {
  setRenderOptions: PropTypes.func,
  tabId: PropTypes.number,
  firstRender: PropTypes.bool,
  getRating: PropTypes.func,
  groupId: PropTypes.number,
  openTeam: PropTypes.func,
  rating: PropTypes.arrayOf(PropTypes.shape({})),
  team: PropTypes.shape({
    teamId: PropTypes.number,
    name: PropTypes.string,
    score: PropTypes.number,
    place: PropTypes.number,
    globalPlace: PropTypes.number,
  }),
  t: PropTypes.func,
  statusType: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  firstRender: state.desktop.tabs.find(tab => tab.id === ownProps.tabId).render
    .firstRender,
  rating: state.contest.rating,
  team: {
    teamId: state.team.teamId,
    name: state.team.name,
    score: state.team.score,
    place: state.team.place,
    globalPlace: state.team.globalPlace,
  },
  groupId: state.team.groupId,
  statusType: state.contest.status.type,
});

const mapDispatchToProps = dispatch => ({
  setRenderOptions: (id, renderOptions) =>
    dispatch(setRenderOptions(id, renderOptions)),
  getRating: groupId => dispatch(fetchRating(groupId)),
  openTeam: teamId => dispatch(addTab(TabType.TEAM, { teamId })),
});

export const RatingWindow = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(RatingWindowContainer));
