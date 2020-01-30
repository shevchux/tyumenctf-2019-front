import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import * as UI from "../../UI";
import "./styles.scss";

export const DirHead = props => {
  const { t } = useTranslation();
  const AltTabs = t("w-dir.altTabs", { returnObjects: true });
  const { loading = false, onClick } = props;
  return (
    <div className="dir-head-container">
      <div className="dir-head-alt-tabs noselect">
        <ul>
          {AltTabs.map((altTab, index) => (
            <li key={index}>{altTab}</li>
          ))}
        </ul>
      </div>
      <div className="dir-head-line">
        <div className="dir-head-line-address-title">{t("w-dir.address")}</div>
        <div
          className={
            "dir-head-line-button" +
            (loading ? " dir-head-line-button-loading" : "")
          }
          onClick={() => !loading && onClick()}
        >
          <UI.Icon id="refresh" className="dir-head-line-button-icon" small />
          {t("w-dir.refresh")}
        </div>
        <div className="dir-head-line-address">
          <UI.Icon id="folder" className="dir-head-line-address-icon" small />
          <div className="dir-head-line-address-status">{props.status}</div>
          <div className="dir-head-line-address-path">{props.path}</div>
          <div className="clearfix" />
        </div>
        <div className="clearfix" />
      </div>
    </div>
  );
};

DirHead.propTypes = {
  path: PropTypes.string,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  status: PropTypes.node,
};
