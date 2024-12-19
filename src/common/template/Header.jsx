import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  openCloseSideBar,
  openCloseMiniSideBar,
  getNotifications,
} from "./templateActions";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      intervalId: null,
      width: window.innerWidth,
      height: window.innerHeight,
      showNotifications: false,
      selectedNotification: null, // Estado para armazenar a notificação selecionada
    };

    this.updateDimensions = this.updateDimensions.bind(this);
    this.toggleNotifications = this.toggleNotifications.bind(this);
    window.addEventListener("resize", this.updateDimensions);
  }

  updateDimensions() {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  }

  componentDidMount() {
    this.updateDimensions();

    this.props.getNotifications();

    const intervalId = setInterval(() => {
      // this.props.getNotifications();
    }, 10000);

    this.setState({ intervalId });
  }

  handleNotificationClick = (notify) => {
    console.log("Notificação clicada:", notify);
    // Atualiza o estado com a notificação selecionada
    this.setState({ selectedNotification: notify });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
    clearInterval(this.state.intervalId);
  }

  toggleNotifications() {

    console.log("Clicou no toogle??")


    this.setState((prevState) => ({
      showNotifications: !prevState.showNotifications,
      selectedNotification: null, // Reset the selected notification when toggling the menu
    }));
  }

  renderNotifications = (notifications) =>
    notifications.map((notify, i) => {
      const linkToList = process.env.PUBLIC_URL + notify.linkToList;

      return (
        <div key={i}>
          {this.state.width >= 600 ? (
            <li className="nav-item dropdown">
              <a className="nav-link" data-toggle="dropdown" href="#" aria-expanded="true" title={notify.title}>
                <i className={"fas fa-" + notify.icon + " color-icon-white"} style={{ width: '24px', height: '24px' }}></i>
                <span className={"badge badge-" + notify.type + " navbar-badge"}>{notify.items.length}</span>
              </a>

              {/* Menu dropdown */}
              <div
                className="dropdown-menu dropdown-menu-lg dropdown-menu-right"
                style={{ left: 'inherit', right: '0px' }}
              >
                {/* Contêiner rolável para itens de notificação */}
                <div
                  style={{
                    maxHeight: '300px', // Define altura máxima para a área de rolagem
                    overflowY: 'auto', // Adiciona barra de rolagem vertical
                  }}
                >
                  <div className="dropdown-item dropdown-header" style={{ textAlign: 'left', paddingTop: '10px' }}>
                    <span className="circle">{notify.items.length}</span>
                    <strong className="processo-text text-truncate">{notify.title}</strong>
                  </div>

                  <div style={{ marginLeft: '15px', marginRight: '15px' }}>
                    <div className="dropdown-divider"></div>
                  </div>

                  {notify.items.map((item, j) => {
                    let itemLink = item.link || notify.linkToItem;
                    itemLink =
                      process.env.PUBLIC_URL + itemLink + (itemLink[itemLink.length - 1] !== '/' ? '/' : '') + item.id;

                    let itemTime = (new Date() - new Date(item.date)) / 60000;
                    if (itemTime < 1) {
                      itemTime = Number.parseInt(itemTime * 60) + ' segundo' + (Number.parseInt(itemTime * 60) > 1 ? 's' : '');
                    } else if (itemTime > 1439) {
                      itemTime = Number.parseInt(itemTime / 1440) + ' dia' + (Number.parseInt(itemTime / 1440) > 1 ? 's' : '');
                    } else if (itemTime > 59) {
                      itemTime = Number.parseInt(itemTime / 60) + ' hora' + (Number.parseInt(itemTime / 60) > 1 ? 's' : '');
                    } else {
                      itemTime = Number.parseInt(itemTime) + ' minuto' + (Number.parseInt(itemTime) > 1 ? 's' : '');
                    }

                    return (
                      <div key={item.id}>
                        <a href={itemLink} className="dropdown-item">
                          <i className={"fas fa-file-alt mr-2 blue-text"}></i> {item.entity?.initials || ''} {item.id}
                          <span className="float-right text-muted text-sm" title={new Date(item.date).toLocaleString()}>
                            {itemTime}
                          </span>
                        </a>
                      </div>
                    );
                  })}
                </div>

                {/* Contêiner fixo para o botão "Ver Todos" */}
                {notify.linkToList && (
                  <div
                    className="dropdown-footer"
                    style={{
                      padding: '10px 15px',
                      borderTop: '1px solid #e9ecef', // Adiciona uma borda superior para separar
                    }}
                  >
                    <a href={linkToList}>
                      <button type="button" className="btn btn-primary w-100">Ver Todos</button>
                    </a>
                  </div>
                )}
              </div>
            </li>
          ) : (
            // Se a largura for menor que 600px, renderiza este conteúdo
            <li key={i} className="nav-item dropdown">
              <a
                className="nav-link"
                onClick={() => this.handleNotificationClick(notify)}
                aria-expanded="false"
                title={notify.title}
              >
                <i
                  className={"fas fa-" + notify.icon + " color-icon-white"}
                  style={{ width: "24px", height: "24px", color: "#ffffff" }}
                ></i>
                <span className={"badge badge-" + notify.type + " navbar-badge"}>
                  {notify.items.length}
                </span>
              </a>
            </li>
          )}
        </div>
      );
    });

  render() {
    const { showNotifications, selectedNotification } = this.state;

    return (
      <nav
        className={`main-header navbar navbar-expand ${this.state.width >= 600 ? "navbar-primary" : ""
          } navbar-dark`}
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              href="#!"
              className="nav-link nav-link--bg"
              onClick={(e) => this.props.openCloseSideBar(e)}
              data-widget="pushmenu"
            >
              <i className="fas fa-bars"></i>
            </a>
            <a
              href="#!"
              className="nav-link nav-link--sm"
              onClick={(e) => this.props.openCloseMiniSideBar(e)}
              data-widget="pushmenu"
            >
              <i className="fas fa-bars"></i>
            </a>
          </li>
        </ul>
        <ul className="navbar-nav m-auto">
          <a href="#!" className="brand-link text-center d-block d-sm-none">
            {process.env.REACT_APP_LOGO ? (
              <img
                style={{ maxWidth: "113px" }}
                src={process.env.REACT_APP_LOGO}
                alt={process.env.REACT_APP_NAME}
                className="brand-image brand-image--custom"
              ></img>
            ) : (
              <span className="brand-text font-weight-light text-center">
                <strong>{process.env.REACT_APP_NAME}</strong>
              </span>
            )}
          </a>
        </ul>
        {this.state.width >= 600 ? (
          <ul
            className={"navbar-nav ml-auto"}
            style={{ paddingRight: "40px" }}
          >
            {this.props.notifications &&
              this.props.notifications.length > 0 &&
              this.renderNotifications(this.props.notifications)}
          </ul>
        ) : (
          <ul className="navbar-nav ml-auto">
            <a className="nav-link" onClick={this.toggleNotifications}>
              <i className="fas fa-th-large"></i>
            </a>
          </ul>
        )}
        {/* Renderizar o menu de notificações apenas quando showNotifications for true */}
        {showNotifications && this.state.width < 600 && !selectedNotification && (
          <div className="dropdown-menu dropdown-menu-right show" style={{ backgroundColor: '#0D6EFD', color: '#ffffff' }}>
            {this.props.notifications.map((notify, i) => (
              <div
                key={i}
                className="dropdown-item"
                onClick={() => this.handleNotificationClick(notify)}
                style={{
                  color: '#ffffff',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }} // Texto branco
              >
                <a
                  className="nav-link"
                  aria-expanded="false"
                  style={{ maxWidth: "56px" }}
                >
                  <i
                    className={"fas fa-" + notify.icon + " color-icon-white"}
                    style={{ width: "34px", height: "34px", color: "#ffffff" }} // Cor do ícone para branco
                  ></i>
                  <span className={"badge badge-" + notify.type + " navbar-badge"}> {notify.items.length} </span>
                </a>
                <span className="brand-text font-weight-light text-right">
                  {notify.title}
                </span>
              </div>
            ))}
          </div>
        )}
        {/* Renderizar a lista de notificações detalhadas da notificação selecionada */}
        {selectedNotification && (
          <div
            className="dropdown-menu dropdown-menu-right show"
            style={{
              backgroundColor: '#0D6EFD',
              color: '#ffffff',
              maxHeight: '300px', // Define a altura máxima da área de rolagem
              overflowY: 'auto',  // Adiciona barra de rolagem vertical
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              className="dropdown-header"
              style={{
                color: '#ffffff',
                flex: '0 0 auto', // Mantém o cabeçalho fixo no topo
              }}
            >
              <span className="circle">{selectedNotification.items.length}</span>
              <i className={`fas fa-${selectedNotification.icon}`} style={{ color: '#ffffff' }}></i>{" "}
              {selectedNotification.title}
            </div>
            <div
              className="dropdown-body"
              style={{
                flex: '1 1 auto', // Área de rolagem
                overflowY: 'auto',
              }}
            >
              {selectedNotification.items.map((item, i) => (
                <div key={i} className="dropdown-item">
                  <a
                    href={
                      process.env.PUBLIC_URL +
                      (item.link || selectedNotification.linkToItem) +
                      (item.link[item.link.length - 1] !== "/" ? "/" : "") +
                      item.id
                    }
                    className="dropdown-item"
                    style={{ color: '#ffffff' }}
                  >
                    <i className="fas fa-file-alt" style={{ color: '#ffffff' }}></i> {item.entity?.initials || ""}{" "}
                    {item.id}
                    <span className="float-right text-sm" style={{ marginLeft: "20px" }}>
                      Há {Math.floor((new Date() - new Date(item.date)) / 86400000)} dias
                    </span>
                  </a>
                </div>
              ))}
            </div>
            <div
              className="dropdown-footer"
              style={{
                flex: '0 0 auto', // Fixa os botões na parte inferior
                backgroundColor: '#0D6EFD',
                padding: '10px',
              }}
            >
              <a
                href={process.env.PUBLIC_URL + selectedNotification.linkToList}
                className="dropdown-item dropdown-footer"
              >
                <button
                  onClick={() => this.toggleNotifications()}
                  type="button"
                  className="btn btn-primary w-100"
                  style={{ backgroundColor: "white", color: "#0D6EFD" }}
                >
                  Ver Todos
                </button>
              </a>
              {this.state.width < 600 && (
                <button
                  type="button"
                  className="btn btn-primary w-100"
                  onClick={() => this.setState({ selectedNotification: null })}
                  style={{ marginTop: "5px", backgroundColor: "transparent", color: "#ffffff" }}
                >
                  Voltar
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  notifications: state.template.notifications || [],
});
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    { openCloseSideBar, openCloseMiniSideBar, getNotifications },
    dispatch
  );
export default connect(mapStateToProps, mapDispatchToProps)(Header);
