import React from "react";
import PropTypes from "prop-types";
import * as UI from "../UI";

export const WindowMessage = props => {
  const { title, onClose, icon, children, button, onButton } = props;
  return (
    <UI.Window title={title} onClose={onClose} width="550px">
      <table
        cellPadding="0"
        cellSpacing="0"
        border="0"
        style={{ padding: "15px" }}
      >
        <tbody>
          <tr>
            <td style={{ verticalAlign: "top" }}>
              {icon && <UI.Icon id={icon} style={{ marginRight: "20px" }} />}
            </td>
            <td>{children}</td>
          </tr>
        </tbody>
      </table>
      <div align="center" style={{ paddingBottom: "15px" }}>
        <UI.Button onClick={onButton || onClose}>{button || "Oк"}</UI.Button>
      </div>
    </UI.Window>
  );
};

WindowMessage.propTypes = {
  title: PropTypes.string.isRequired,
  button: PropTypes.string,
  icon: PropTypes.string,
  children: PropTypes.node,
  onClose: PropTypes.func,
  onButton: PropTypes.func,
};
