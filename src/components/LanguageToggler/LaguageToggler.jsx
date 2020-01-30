import React from "react";
import { useTranslation } from "react-i18next";
import { TOGGLE_LANG } from "../../config";

export const LanguageToggler = () => {
  const { i18n, t } = useTranslation();
  return (
    <div
      onClick={() => {
        const newLanguage = TOGGLE_LANG[i18n.language];
        i18n.changeLanguage(newLanguage);
        document.getElementsByTagName("html")[0].lang = newLanguage;
      }}
      title={t("config.lang.name")}
      style={{
        color: "#fff",
        cursor: "pointer",
        background: "#316ac5",
        display: "inline-block",
        width: "20px",
        lineHeight: "17px",
      }}
      className="noselect"
    >
      {t("config.lang.current")}
    </div>
  );
};
