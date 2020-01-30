import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setRenderOptions } from "../../../actions/desktop";
import "./styles.scss";
import { DirHead } from "../../../components/Dir/DirHead/DirHead";
import { TimesLeft } from "../../../components/TimesLeft/TimesLeft";
import { withTranslation } from "react-i18next";
import { fetchAllNews } from "../../../actions/contest";
import { TimesFromStart } from "../../../components/TimesFromStart/TimesFromStart";
import { FEEDBACK_URL } from "../../../config";
import { CONTEST_STATUS } from "../../../config";

class NewsWindowContainer extends React.Component {
  componentDidMount() {
    const {
      firstRender,
      tabId,
      setRenderOptions,
      news,
      fetchAllNews,
      fromTray,
      t,
    } = this.props;

    if (firstRender) {
      setRenderOptions(tabId, {
        firstRender: false,
        title: t("w-news.title"),
        icon: "letter",
        resizable: true,
        minSize: { height: 300, width: 650 },
        size: { height: 460, width: 750 },
      });
    }

    if ((!news.loaded && !news.loading) || fromTray) {
      fetchAllNews();
    }
  }

  render() {
    const { t, news, statusType, fetchAllNews } = this.props;
    return (
      <div className="news-window-container">
        <DirHead
          path={"SERV://TyumenCTF/2019/News"}
          loading={news.loading}
          status={
            news.loading ? (
              <span>{t("w-dir.refresh-loading")}</span>
            ) : (
              <span>
                {t("w-dir.refresh-loaded")} <TimesLeft time={news.loaded} />
              </span>
            )
          }
          onClick={fetchAllNews}
        />
        <div className="news-container">
          {!news.loaded ? (
            <div className="news-loading">{t("w-news.loading")}</div>
          ) : (
            <div className="news-content-container">
              {statusType >= CONTEST_STATUS.SOLVE_UP_RUNNING && (
                <div
                  className="news-item"
                  style={{ borderColor: "#cc9027", marginBottom: 30 }}
                >
                  <div className="news-title" style={{ background: "#e6d4c3" }}>
                    <div
                      className="news-title-left"
                      style={{ color: "#6f2f00" }}
                    >
                      <strong>{t("w-news.feedback.title")}</strong>
                    </div>
                    <div className="clearfix" />
                  </div>
                  <div className="news-body" style={{ background: "#f4f2ed" }}>
                    {t("w-news.feedback.body")}{" "}
                    <a href={FEEDBACK_URL} target="_blank" rel="noopener noreferrer">
                      {FEEDBACK_URL}
                    </a>{" "}
                    <img
                      src="http://www.kolobok.us/smiles/standart/good.gif"
                      alt=""
                    />
                  </div>
                </div>
              )}
              <h3 className="news-container-title">
                {t("w-news.h3", { count: news.items.length })}
              </h3>
              {news.loaded && !news.items.length && (
                <div className="news-loading">{t("w-news.empty")}</div>
              )}
              {news.items.map((n, index) => (
                <div className="news-item" key={index}>
                  <div className="news-title">
                    <div className="news-title-left">
                      #{news.items.length - index} <strong>{n.title}</strong>
                    </div>
                    <div className="news-title-right">
                      <TimesFromStart
                        time={n.time}
                        back
                        label="w-news.time_from"
                        labelBack="w-news.time_to"
                      />
                    </div>
                  </div>
                  <div
                    className="news-body"
                    dangerouslySetInnerHTML={{ __html: n.body }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

NewsWindowContainer.propTypes = {
  setRenderOptions: PropTypes.func,
  tabId: PropTypes.number,
  firstRender: PropTypes.bool,
  fromTray: PropTypes.bool,
  t: PropTypes.func,
  fetchAllNews: PropTypes.func,
  news: PropTypes.shape({
    count: PropTypes.number,
    loading: PropTypes.bool,
    loaded: PropTypes.number,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        body: PropTypes.string,
        time: PropTypes.number,
      })
    ),
  }),
  statusType: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => ({
  firstRender: state.desktop.tabs.find(tab => tab.id === ownProps.tabId).render
    .firstRender,
  news: state.contest.news,
  statusType: state.contest.status.type,
});

const mapDispatchToProps = dispatch => ({
  setRenderOptions: (id, renderOptions) =>
    dispatch(setRenderOptions(id, renderOptions)),
  fetchAllNews: () => dispatch(fetchAllNews()),
});

export const NewsWindow = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(NewsWindowContainer));
