import React from "react";
import "./styles.scss";
import { StartMenu } from "../../StartMenu/StartMenu";
import { Popup } from "../../../containers/Popup/Popup";
import { useTranslation } from "react-i18next";

export function StartButton() {
  const { t } = useTranslation();
  return (
    <Popup className="cpanel-start-menu-pointer">
      <Popup.Element className="cpanel-start-menu">
        <StartMenu />
      </Popup.Element>
      <Popup.Button
        className={
          "cpanel-start-button" +
          (t("config.lang.current") === "RU" ? " cpanel-start-button-ru" : "")
        }
      >
        {t("cpanel.start")}
      </Popup.Button>
    </Popup>
  );
}
