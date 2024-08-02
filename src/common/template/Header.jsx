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
    this.setState({
      intervalId: setInterval(() => {
        this.props.getNotifications();
      }, 10000),
    });
  }

  handleNotificationClick = (notify) => {
    // Atualiza o estado com a notificação selecionada
    this.setState({ selectedNotification: notify });
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
    clearInterval(this.state.intervalId);
  }

  toggleNotifications() {
    this.setState((prevState) => ({
      showNotifications: !prevState.showNotifications,
      selectedNotification: null, // Resetar a notificação selecionada ao alternar o menu
    }));
  }

  renderNotifications = (notifications) =>
    notifications.map((notify, i) => {
      const linkToList = process.env.PUBLIC_URL + notify.linkToList;

      return (
        <li key={i} className="nav-item dropdown">
          <a
            className="nav-link"
            data-toggle="dropdown"
            href="#"
            aria-expanded="true"
            title={notify.title}
          >
            <i
              className={"fas fa-" + notify.icon + " color-icon-white"}
              style={{ width: "24px", height: "24px" }}
            ></i>
            <span className={"badge badge-" + notify.type + " navbar-badge"}>
              {notify.items.length}
            </span>
          </a>

          <div
            className="dropdown-menu dropdown-menu-lg dropdown-menu-right"
            style={{ left: "inherit", right: "0px" }}
          >
            <div
              className="dropdown-item dropdown-header"
              style={{
                textAlign: "left",
                paddingTop: "20px",
                paddingLeft: "20px",
              }}
            >
              <span className="circle">{notify.items.length}</span>
              <strong className="processo-text text-truncate">
                {notify.title}
              </strong>
            </div>

            <div style={{ marginLeft: "15px", marginRight: "15px" }}>
              <div className="dropdown-divider"></div>
            </div>

            {notify.items.slice(0, 10).map((item, j) => {
              let itemLink = item.link || notify.linkToItem;
              itemLink =
                process.env.PUBLIC_URL +
                itemLink +
                (itemLink[itemLink.length - 1] !== "/" ? "/" : "") +
                item.id;

              let itemTime =
                (new Date() - new Date(item.date)) / 60000;
              if (itemTime < 1) {
                itemTime =
                  Number.parseInt(itemTime * 60) +
                  " segundo" +
                  (Number.parseInt(itemTime * 60) > 1 ? "s" : "");
              } else if (itemTime > 1439) {
                itemTime =
                  Number.parseInt(itemTime / 1440) +
                  " dia" +
                  (Number.parseInt(itemTime / 1440) > 1 ? "s" : "");
              } else if (itemTime > 59) {
                itemTime =
                  Number.parseInt(itemTime / 60) +
                  " hora" +
                  (Number.parseInt(itemTime / 60) > 1 ? "s" : "");
              } else {
                itemTime =
                  Number.parseInt(itemTime) +
                  " minuto" +
                  (Number.parseInt(itemTime) > 1 ? "s" : "");
              }

              return (
                <div key={item.id}>
                  <a
                    href={itemLink}
                    className="dropdown-item"
                  >
                    <i className={"fas fa-file-alt mr-2 blue-text"}></i>{" "}
                    {item.entity?.initials || ""} {item.id}
                    <span
                      className="float-right text-muted text-sm"
                      title={new Date(item.date).toLocaleString()}
                    >
                      {itemTime}
                    </span>
                  </a>
                </div>
              );
            })}

            <div className="dropdown-divider"></div>
            {notify.linkToList && (
              <a href={linkToList} className="dropdown-item dropdown-footer">
                <button type="button" className="btn btn-primary w-100">
                  Ver Todos
                </button>
              </a>
            )}
          </div>
        </li>
      );
    });

  render() {
    const { showNotifications, selectedNotification, width } = this.state;

    return (
      <nav
        className={`main-header navbar navbar-expand ${
          width >= 600 ? "navbar-primary" : ""
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
        {width >= 600 ? (
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

        {/* Renderizar o menu de notificações apenas quando showNotifications for true em mobile */}
        {showNotifications && width < 600 && !selectedNotification && (
          <div className="dropdown-menu dropdown-menu-right show">
            {this.props.notifications.map((notify, i) => (
              <div
                key={i}
                className="dropdown-item"
                onClick={() => this.handleNotificationClick(notify)}
              >
                <i className={`fas fa-${notify.icon}`}></i> {notify.title}
                <span className="badge badge-primary">
                  {notify.items.length}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Renderizar a lista de notificações detalhadas da notificação selecionada em mobile */}
        {selectedNotification && width < 600 && (
          <div className="dropdown-menu dropdown-menu-right show">
            <div className="dropdown-header">
              <i className={`fas fa-${selectedNotification.icon}`}></i>{" "}
              {selectedNotification.title}
            </div>
            {selectedNotification.items.map((item, i) => (
              <div key={i} className="dropdown-item">
                <a
                  href={
                    process.env.PUBLIC_URL +
                    (item.link || selectedNotification.linkToItem) +
                    (item.link[item.link.length - 1] !== "/" ? "/" : "") +
                    item.id
                  }
                >
                  <i className="fas fa-file-alt"></i> {item.entity?.initials || ""}{" "}
                  {item.id}
                  <span className="float-right text-muted text-sm">
                    Há {Math.floor((new Date() - new Date(item.date)) / 86400000)}{" "}
                    dias
                  </span>
                </a>
              </div>
            ))}
            <div className="dropdown-divider"></div>
            <button
              type="button"
              className="btn btn-secondary w-100"
              onClick={() => this.setState({ selectedNotification: null })}
            >
              Voltar
            </button>
            <a
              href={process.env.PUBLIC_URL + selectedNotification.linkToList}
              className="dropdown-item dropdown-footer"
            >
              <button type="button" className="btn btn-primary w-100">
                Ver Todos
              </button>
            </a>
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
