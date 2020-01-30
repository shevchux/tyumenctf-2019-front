import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchAuth, clearAuth } from "../../actions/login";
import * as UI from "../UI";

import "./styles.scss";
import { LanguageToggler } from "../LanguageToggler/LaguageToggler";
import { WindowMessage } from "../WindowMessage/WindowMessage";
import { withTranslation } from "react-i18next";
import { getQueryParams } from "../../utils/query";
import { USE_CLIENT_MOCK_API } from "../../config";

class LoginContainer extends React.Component {
  constructor(props) {
    super(props);
    this.loginValue = getQueryParams(document.location.search)["login"];
    this.passwordValue = null;
    console.log();
  }

  onSubmitHandler(e) {
    e.preventDefault();
    this.props.auth(this.loginValue, this.passwordValue);
  }

  render() {
    const { error, sending, errorCode, clearError, t } = this.props;

    const errorMessages = t("init.login.error.codeMessage", {
      returnObjects: true,
    });

    if (error) {
      return (
        <WindowMessage
          icon="attention"
          title={t("init.login.error.title")}
          onClose={clearError}
        >
          {errorMessages[errorCode] || errorMessages[0]}
        </WindowMessage>
      );
    }

    return (
      <UI.Window title={t("init.login.title")}>
        <div className="login-window-head" />
        <form
          onSubmit={e => this.onSubmitHandler(e)}
          style={{ padding: "20px 10px" }}
        >
          <table cellPadding="0" cellSpacing="0" border="0">
            <tbody>
              <tr>
                <td style={{ width: "100px", height: 28 }}>
                  {t("init.login.table.team")}
                </td>
                <td>
                  <UI.TextInput
                    type="text"
                    name="login"
                    width="250px"
                    autoComplete="off"
                    autoFocus="on"
                    required
                    onChange={e => (this.loginValue = e.target.value)}
                    defaultValue={USE_CLIENT_MOCK_API ? "Demo account (Click Sign In or Press Enter)" : this.loginValue}
                  />
                </td>
              </tr>
              <tr style={{ height: 28 }}>
                <td>{t("init.login.table.password")}</td>
                <td>
                  <UI.TextInput
                    type="password"
                    name="password"
                    width="250px"
                    autoComplete="off"
                    required
                    onChange={e => (this.passwordValue = e.target.value)}
                    defaultValue={USE_CLIENT_MOCK_API ? "AnyP@a$$w0rd" : this.passwordValue}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <div style={{ padding: "10px 0 10px" }}>
                    <LanguageToggler />
                  </div>
                </td>
                <td style={{ verticalAlign: "bottom" }}>
                  {sending ? (
                    <UI.Button type="submit" disabled>
                      {t("init.login.table.loadingButtonLabel")}
                    </UI.Button>
                  ) : (
                    <UI.Button type="submit">
                      {t("init.login.table.loginButtonLabel")}
                    </UI.Button>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </UI.Window>
    );
  }
}

LoginContainer.propTypes = {
  sending: PropTypes.bool,
  error: PropTypes.bool,
  errorCode: PropTypes.number,
  auth: PropTypes.func,
  clearError: PropTypes.func,
  t: PropTypes.func,
};

const mapStateToProps = state => ({
  sending: state.login.sending,
  error: state.login.error,
  errorCode: state.login.errorCode,
});

const mapDispatchToProps = dispatch => ({
  auth: (login, password) => dispatch(fetchAuth(login, password)),
  clearError: () => dispatch(clearAuth()),
});

export const Login = connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslation()(LoginContainer));
