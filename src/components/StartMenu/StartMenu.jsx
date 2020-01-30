import React from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import { connect } from "react-redux";
import * as UI from "../UI";
import { fetchLogout } from "../../actions/logout";
import { withTranslation } from "react-i18next";
import { addTab, TabType } from "../../actions/desktop";
import { Popup } from "../../containers/Popup/Popup";
import { DosGames } from "../../containers/WindowContainer/DosGameWindow/DosGameWindow";
import { TimelineWidget } from "../TimelineWidget/TimelineWidget";
import { refresh } from "../../actions/contest";
import { FINAL_RATING_URL, CONTEST_STATUS } from "../../config";

class StartMenuContainer extends React.Component {
  render() {
    const {
      logo,
      name,
      categories,
      openCategory,
      hidePopup: hidePopup,
      openRules,
      openExecute,
      openRating,
      teamId,
      openNews,
      status,
      openDosGame,
      newsCount,
      refresh,
      t,
      score,
      refreshLoading,
      place,
      openTeam,
    } = this.props;

    return (
      <div className="smenu-container noselect">
        <div className="smenu-head-container">
          <div className="smenu-head-content">
            <div className="smenu-head-team">
              <img
                src={logo}
                alt="photo"
                className="smenu-head-team-photo"
                onClick={() => {
                  hidePopup();
                  openTeam(teamId);
                }}
              />
              <div className="smenu-head-team-info">
                <div
                  className="smenu-head-team-name"
                  title={name}
                  onClick={() => {
                    hidePopup();
                    openTeam(teamId);
                  }}
                >
                  {name}
                </div>
                <div className="smenu-head-team-status">
                  {refreshLoading ? (
                    t("startMenu.head.rating_loading")
                  ) : (
                    <React.Fragment>
                      <span
                        title={t("startMenu.links.menu.rating")}
                        onClick={() => {
                          openRating();
                          hidePopup();
                        }}
                      >
                        {score === undefined
                          ? t("startMenu.head.rating_label_default")
                          : t("startMenu.head.rating_label", {
                              count: score,
                              place,
                            })}
                      </span>
                      <span
                        title={t("startMenu.head.update_title")}
                        onClick={() => {
                          refresh();
                        }}
                        className="smenu-head-refresh-button"
                      >
                        ↺
                      </span>
                    </React.Fragment>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="smenu-head-content-separator" />
        <div className="smenu-content-container">
          <div className="smenu-content-left">
            <div className="smenu-content-list">
              <ul>
                <li
                  onClick={() => {
                    window.open("https://vk.com/tyumenctf");
                    hidePopup();
                  }}
                >
                  <div className="smenu-list-icon social-icon social-icon-vk" />
                  <div className="smenu-list-content">
                    <strong>{t("startMenu.links.social.vk.title")}</strong>
                    <br />
                    <span>{t("startMenu.links.social.vk.subtitle")}</span>
                  </div>
                </li>
                <li
                  onClick={() => {
                    window.open("https://t.me/tyumenctf");
                    hidePopup();
                  }}
                >
                  <div className="smenu-list-icon social-icon social-icon-tg" />
                  <div className="smenu-list-content">
                    <strong>
                      {t("startMenu.links.social.telegram.title")}
                    </strong>
                    <br />
                    <span>{t("startMenu.links.social.telegram.subtitle")}</span>
                  </div>
                </li>
                <li
                  onClick={() => {
                    location.href = "mailto:team@tyumenctf.ru";
                    hidePopup();
                  }}
                >
                  <div className="smenu-list-icon social-icon social-icon-email" />
                  <div className="smenu-list-content">
                    <strong>{t("startMenu.links.social.email.title")}</strong>
                    <br />
                    <span>team@tyumenctf.ru</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="smenu-content-sep" />
            <div className="smenu-content-list">
              <ul>
                <li
                  onClick={() => {
                    openRules();
                    hidePopup();
                  }}
                >
                  <UI.Icon id="rules" className="smenu-list-icon" />
                  <div className="smenu-list-content">
                    {t("startMenu.links.menu.rules")}
                  </div>
                </li>
                <li
                  onClick={() => {
                    openRating();
                    hidePopup();
                  }}
                >
                  <UI.Icon id="star" className="smenu-list-icon" />
                  <div className="smenu-list-content">
                    {t("startMenu.links.menu.rating")}
                  </div>
                </li>
                <li
                  onClick={() => {
                    openNews();
                    hidePopup();
                  }}
                >
                  <UI.Icon id="letter" className="smenu-list-icon" />
                  <div
                    className="smenu-list-content"
                    dangerouslySetInnerHTML={{
                      __html:
                        t("startMenu.links.menu.news") + " (" + newsCount + ")",
                    }}
                  />
                </li>
              </ul>
            </div>
            {status && status.type === CONTEST_STATUS.SOLVE_UP_RUNNING && (
              <React.Fragment>
                <div className="smenu-content-sep" />
                <div className="smenu-content-list">
                  <ul>
                    <li
                      onClick={() => {
                        window.open(FINAL_RATING_URL);
                        hidePopup();
                      }}
                    >
                      <UI.Icon id="lock" className="smenu-list-icon" />
                      <div
                        className="smenu-list-content"
                        dangerouslySetInnerHTML={{
                          __html: t("startMenu.links.menu.results"),
                        }}
                      />
                    </li>
                  </ul>
                </div>
              </React.Fragment>
            )}
            <div className="smenu-content-sep" />
            <TimelineWidget />
          </div>
          <div className="smenu-content-right">
            {categories.length > 0 && (
              <React.Fragment>
                <div className="smenu-content-list">
                  <ul>
                    {categories.map(category => (
                      <li
                        key={category.id}
                        onClick={() => {
                          openCategory(category.id);
                          hidePopup();
                        }}
                      >
                        <UI.Icon
                          id={category.icon}
                          className="smenu-list-icon smenu-list-icon-small"
                        />
                        <div className="smenu-list-content">
                          <strong>{category.name}</strong>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="smenu-content-sep" />
              </React.Fragment>
            )}
            {this.props.gameMode && (
              <React.Fragment>
                <div className="smenu-content-list">
                  <ul>
                    <li>
                      <Popup className="smenu-game-button-pointer">
                        <Popup.Element className="smenu-game-button-menu">
                          <div className="smenu-content-list">
                            <ul>
                              {DosGames.map(game => (
                                <li
                                  onClick={() => {
                                    hidePopup();
                                    openDosGame(game.id);
                                  }}
                                  key={game.id}
                                >
                                  <div className="smenu-list-content">
                                    {game.title}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </Popup.Element>
                        <Popup.Button className="smenu-game-button">
                          <UI.Icon
                            id="game-cube"
                            className="smenu-list-icon smenu-list-icon-small"
                          />
                          <div className="smenu-list-content">
                            {t("startMenu.links.menu.games")}
                            <span
                              style={{
                                color: "inherit",
                                position: "absolute",
                                top: 4,
                                right: 0,
                              }}
                            >
                              ⯈
                            </span>
                          </div>
                        </Popup.Button>
                      </Popup>
                    </li>
                  </ul>
                </div>
                <div className="smenu-content-sep" />
              </React.Fragment>
            )}
            <div className="smenu-content-list">
              <ul>
                <li
                  onClick={() => {
                    openExecute();
                    hidePopup();
                  }}
                >
                  <UI.Icon
                    id="execute"
                    className="smenu-list-icon smenu-list-icon-small"
                  />
                  <div className="smenu-list-content">
                    {t("startMenu.links.menu.exec")}
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="smenu-footer-container">
          <div className="smenu-footer-content">
            <button
              className="smenu-footer-button"
              onClick={() => {
                hidePopup();
                this.props.logout();
              }}
            >
              <UI.Icon
                id="logout-key"
                style={{ display: "inline-block", verticalAlign: "middle" }}
              />
              {t("startMenu.footer.logout")}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

StartMenuContainer.propTypes = {
  logo: PropTypes.string,
  name: PropTypes.string,
  logout: PropTypes.func,
  gameMode: PropTypes.bool,
  hidePopup: PropTypes.func,
  openCategory: PropTypes.func,
  openExecute: PropTypes.func,
  openRules: PropTypes.func,
  openRating: PropTypes.func,
  openNews: PropTypes.func,
  newsCount: PropTypes.number,
  openDosGame: PropTypes.func,
  categories: PropTypes.arrayOf(PropTypes.shape({})),
  t: PropTypes.func,
  place: PropTypes.number,
  status: PropTypes.shape({
    type: PropTypes.string,
    until: PropTypes.number,
  }),
  score: PropTypes.number,
  refresh: PropTypes.func,
  refreshLoading: PropTypes.bool,
  openTeam: PropTypes.func,
  teamId: PropTypes.number,
};

const mapStateToProps = state => ({
  logo: state.team.logo,
  name: state.team.name,
  teamId: state.team.teamId,
  status: state.contest.status,
  categories: state.tasks.categories,
  gameMode: state.desktop.gameMode,
  newsCount: state.contest.news.count,
  place: state.team.place,
  score: state.team.score,
  refreshLoading: state.contest.refreshLoading,
});

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(fetchLogout()),
  openCategory: categoryId =>
    dispatch(addTab(TabType.CATEGORY_TASKS, { categoryId })),
  openExecute: () => dispatch(addTab(TabType.EXECUTE)),
  openRating: () => dispatch(addTab(TabType.RATING)),
  openRules: () => dispatch(addTab(TabType.RULES)),
  openNews: () => dispatch(addTab(TabType.NEWS)),
  openDosGame: dosGameId => dispatch(addTab(TabType.DOS_GAME, { dosGameId })),
  refresh: () => dispatch(refresh()),
  openTeam: teamId => dispatch(addTab(TabType.TEAM, { teamId })),
});

export const StartMenu = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(StartMenuContainer));
