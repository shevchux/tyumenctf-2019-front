import React from "react";
import { StartButton } from "./StartButton/StartButton";
import { SystemTray } from "./SystemTray/SystemTray";
import "./styles.scss";
import { LanguageToggler } from "../LanguageToggler/LaguageToggler";
import { TabsArea } from "./TabsArea/TabsArea";

export const ControlPanel = () => {
  return (
    <div className="cpanel-container">
      <div className="cpanel-left">
        <StartButton />
      </div>
      <div className="cpanel-right">
        <SystemTray />
      </div>
      <div className="cpanel-pre-right">
        <LanguageToggler />
      </div>
      <div className="cpanel-tabs">
        <TabsArea />
      </div>
      <div className="clearfix" />
    </div>
  );
};
