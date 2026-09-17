import React, { Component } from "react";
import {
  canPromptInstall,
  canUsePush,
  disablePushNotifications,
  enablePushNotifications,
  getPushStatus,
  initPwa,
  isIos,
  isStandalone,
  promptInstall,
} from "./pwa";

class PwaControls extends Component {
  constructor(props) {
    super(props);
    this.state = {
      installable: false,
      installed: isStandalone(),
      pushEnabled: false,
      pushSupported: canUsePush(),
      busy: false,
      tip: null,
      error: null,
    };
  }

  componentDidMount() {
    initPwa();
    this.refreshPush();
    this.setState({ installable: canPromptInstall() });

    this.onInstallable = () => this.setState({ installable: true });
    this.onInstalled = () =>
      this.setState({ installable: false, installed: true, tip: null });
    this.onSwReady = () => this.refreshPush();

    window.addEventListener("pwa-installable", this.onInstallable);
    window.addEventListener("pwa-installed", this.onInstalled);
    window.addEventListener("pwa-sw-ready", this.onSwReady);
  }

  componentWillUnmount() {
    window.removeEventListener("pwa-installable", this.onInstallable);
    window.removeEventListener("pwa-installed", this.onInstalled);
    window.removeEventListener("pwa-sw-ready", this.onSwReady);
  }

  refreshPush = async () => {
    try {
      const status = await getPushStatus();
      this.setState({
        pushSupported: status.supported,
        pushEnabled: status.enabled,
      });
    } catch (e) {
      /* ignore */
    }
  };

  handleInstall = async (e) => {
    e.preventDefault();
    this.setState({ error: null, tip: null });

    if (this.state.installed) return;

    if (canPromptInstall()) {
      this.setState({ busy: true });
      try {
        await promptInstall();
      } finally {
        this.setState({ busy: false, installable: canPromptInstall() });
      }
      return;
    }

    if (isIos()) {
      this.setState({
        tip:
          "No iPhone/iPad: toque em Compartilhar e depois em \"Adicionar à Tela de Início\".",
      });
      return;
    }

    this.setState({
      tip:
        "Abra o menu do navegador e use \"Instalar aplicativo\" / \"Adicionar à tela inicial\".",
    });
  };

  handlePushToggle = async (e) => {
    e.preventDefault();
    if (!this.state.pushSupported || this.state.busy) return;

    this.setState({ busy: true, error: null, tip: null });
    try {
      if (this.state.pushEnabled) {
        await disablePushNotifications();
        this.setState({
          pushEnabled: false,
          tip: "Notificações desativadas.",
        });
      } else {
        await enablePushNotifications();
        this.setState({
          pushEnabled: true,
          tip: "Você será avisado 5 minutos antes do próximo sinal.",
        });
      }
    } catch (err) {
      this.setState({
        error:
          (err && err.response && err.response.data && err.response.data.message) ||
          (err && err.message) ||
          "Não foi possível alterar as notificações.",
      });
      await this.refreshPush();
    } finally {
      this.setState({ busy: false });
    }
  };

  render() {
    const {
      installable,
      installed,
      pushEnabled,
      pushSupported,
      busy,
      tip,
      error,
    } = this.state;

    const showInstall = !installed || installable || isIos();

    return (
      <li className="nav-item d-flex align-items-center" style={{ gap: "2px" }}>
        {showInstall && (
          <a
            href="#!"
            className="nav-link"
            title="Instalar no dispositivo"
            onClick={this.handleInstall}
            style={{ opacity: busy ? 0.6 : 1 }}
          >
            <i className="fas fa-download" />
            <span className="d-none d-md-inline ml-1" style={{ fontSize: "0.85rem" }}>
              Instalar
            </span>
          </a>
        )}
        {pushSupported && (
          <a
            href="#!"
            className="nav-link"
            title={
              pushEnabled
                ? "Desativar avisos de sinal"
                : "Ativar aviso 5 min antes do sinal"
            }
            onClick={this.handlePushToggle}
            style={{ opacity: busy ? 0.6 : 1 }}
          >
            <i
              className={`fas ${pushEnabled ? "fa-bell" : "fa-bell-slash"}`}
              style={{ color: pushEnabled ? "#ffc107" : undefined }}
            />
            <span className="d-none d-md-inline ml-1" style={{ fontSize: "0.85rem" }}>
              {pushEnabled ? "Avisos on" : "Avisos"}
            </span>
          </a>
        )}
        {(tip || error) && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 8,
              zIndex: 1050,
              maxWidth: 280,
              marginTop: 4,
              padding: "8px 10px",
              borderRadius: 6,
              background: error ? "#dc3545" : "#212529",
              color: "#fff",
              fontSize: "0.8rem",
              boxShadow: "0 4px 12px rgba(0,0,0,.25)",
            }}
            onClick={() => this.setState({ tip: null, error: null })}
          >
            {error || tip}
          </div>
        )}
      </li>
    );
  }
}

export default PwaControls;
