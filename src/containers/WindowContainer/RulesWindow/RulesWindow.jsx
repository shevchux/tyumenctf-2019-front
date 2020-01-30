import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { setRenderOptions } from "../../../actions/desktop";
import * as UI from "../../../components/UI";
import "./styles.scss";
import { withTranslation } from "react-i18next";

class RulesWindowContainer extends React.Component {
  componentDidMount() {
    const { firstRender, t, tabId, setRenderOptions } = this.props;

    if (firstRender) {
      setRenderOptions(tabId, {
        firstRender: false,
        title: t("w-rules.title"),
        icon: "rules",
        size: { height: 450, width: 600 },
        minSize: { height: 300, width: 400 },
        resizable: true,
      });
    }
  }

  render() {
    const { t } = this.props;
    return (
      <div className="rules-container">
        <div className="rules-head-container">
          <div>
            <strong>{t("w-rules.title-full")}</strong>
          </div>
          <div style={{ margin: "7px 0 7px 20px" }}>
            {t("w-rules.subtitle")}
          </div>
        </div>
        <div className="rules-description-container">
          <table cellPadding="0" cellSpacing="0" border="0">
            <tbody>
              <tr>
                <td style={{ width: 60 }}>
                  <UI.Icon
                    id="rules"
                    style={{
                      display: "block",
                      float: "right",
                      marginRight: 10,
                    }}
                  />
                </td>
                <td>{t("w-rules.info")}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="rules-content-container">
          <div className="rules-content-wrapper">
            <div className="rules-content-border" dangerouslySetInnerHTML={{ __html: t("w-rules.rules-body")}}/>
          </div>
        </div>
      </div>
    );
  }
}

RulesWindowContainer.propTypes = {
  setRenderOptions: PropTypes.func,
  tabId: PropTypes.number,
  firstRender: PropTypes.bool,
  t: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  firstRender: state.desktop.tabs.find(tab => tab.id === ownProps.tabId).render
    .firstRender,
});

const mapDispatchToProps = dispatch => ({
  setRenderOptions: (id, renderOptions) =>
    dispatch(setRenderOptions(id, renderOptions)),
});

export const RulesWindow = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(RulesWindowContainer));
