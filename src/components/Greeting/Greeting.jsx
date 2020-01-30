import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import enImg from "./lang-en.png";
import ruImg from "./lang-ru.png";
import "./styles.scss";
import { TOGGLE_LANG } from "../../config";

class GreetingContainer extends React.Component {
  render() {
    const { logo, name, t, i18n } = this.props;
    const { language } = i18n;
    return (
      <div className="win">
        <div className="win-head">
          <div className="head-logo" />
        </div>
        <div className="win-head-separator" />
        <div className="win-body">
          <div className="members">
            <div className="left">
              <div className="vertical-center">
                <div className="greeting-word">{t("greeteng.title")}</div>
              </div>
            </div>
            <div className="separator" />
            <div className="right">
              <div className="member-container vertical-center">
                <div className="member-container-offset">
                  <div className="member-item">
                    <img className="member-photo" src={logo} />
                    <div className="member-info">
                      <div className="member-name">{name}</div>
                      <div className="member-university">
                        {t("greeteng.description")}
                      </div>
                    </div>
                    <div className="clearfix" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="win-footer-separator" />
        <div className="win-footer">
          <div className="footer-copyright">
            <button
              onClick={() => {
                const newLanguage = TOGGLE_LANG[i18n.language];
                i18n.changeLanguage(newLanguage);
                document.getElementsByTagName("html")[0].lang = newLanguage;
              }}
              className="footer-toggle-language"
            >
              <img
                src={language === "ru" ? ruImg : enImg}
                alt={t("config.lang.current")}
              />
              {t("config.lang.current")}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

GreetingContainer.propTypes = {
  name: PropTypes.string,
  logo: PropTypes.string,
  t: PropTypes.func,
  i18n: PropTypes.object,
};

const mapStateToProps = state => ({
  name: state.team.name,
  logo: state.team.logo,
});

export const Greeting = connect(mapStateToProps)(
  withTranslation()(GreetingContainer)
);
