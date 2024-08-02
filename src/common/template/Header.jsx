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
        <li key={i} className="nav-item dropdown">
          <a
            className="nav-link"
            onClick={() => this.handleNotificationClick(notify)} // Atualiza o estado com a notificação clicada
            aria-expanded="false"
            title={notify.title}
          >
            <i
              className={"fas fa-" + notify.icon + " color-icon-white"}
              style={{ width: "24px", height: "24px", color: "#ffffff" }} // Cor do ícone para branco
            ></i>
            <span className={"badge badge-" + notify.type + " navbar-badge"}>
              {notify.items.length}
            </span>
          </a>
          {this.state.width >= 600 && ( // Renderiza o dropdown apenas em desktop
            <div
              className="dropdown-menu dropdown-menu-lg dropdown-menu-right"
              style={{ left: "inherit", right: "0px" }}
            >
              <div
                className="dropdown-item dropdown-header"
                style={{ textAlign: "left", paddingTop: "20px", paddingLeft: "20px" }}
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
                      onClick={() => this.handleNotificationClick(item)}
                      style={{ color: "#ffffff" }} // Cor do texto para branco
                    >
                      <i className={"fas fa-file-alt mr-2"} style={{ color: "#ffffff" }}></i> {/* Cor do ícone para branco */}
                      {item.entity?.initials || ""} {item.id}
                      <span
                        className="float-right text-muted text-sm"
                        title={new Date(item.date).toLocaleString()}
                        color="#ffffff" 
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
          )}
        </li>
      );
    });

  render() {
    const { showNotifications, selectedNotification } = this.state;

    return (
      <nav
        className={`main-header navbar navbar-expand ${
          this.state.width >= 600 ? "navbar-primary" : ""
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
                style={{ color: '#ffffff', 
                        display: 'flex', 
                        flexDirection: 'row' , 
                        alignItems: 'center',
                        justifyContent: 'space-between'}} // Texto branco
              >
               

                <a


                   
                    className="nav-link"           
                    aria-expanded="false"
                    style={{maxWidth: "56px"}}
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
          <div className="dropdown-menu dropdown-menu-right show" style={{ backgroundColor: '#0D6EFD' }}>
            <div className="dropdown-header" style={{ color: '#ffffff' }}> 
              <span className="circle">{selectedNotification.items.length}</span> 
              <i className={`fas fa-${selectedNotification.icon}`} style={{ color: '#ffffff' }}></i>{" "}
              {selectedNotification.title}
            </div>
            {selectedNotification.items.map((item, i) => (
              <div key={i} className="dropdown-item"  >
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
                  
                   
                    <span className="float-right text-sm" style={{ marginLeft: "20px"}} >
                        Há {Math.floor((new Date() - new Date(item.date)) / 86400000)}{" "}
                        dias
                    </span>
                  
                    
                </a>
              </div>
            ))}
            <div className="dropdown-divider" ></div>
            <a
              href={process.env.PUBLIC_URL + selectedNotification.linkToList}
              className="dropdown-item dropdown-footer"             
            >
              <button  onClick={() => this.toggleNotifications()} type="button" className="btn btn-primary w-100" style={{backgroundColor: "white", color: "#0D6EFD"}}>
                Ver Todos
              </button>
              { this.state.width < 600 &&
                  <button type="button"
                    className="btn btn-primary w-100"
                    onClick={() => this.setState({ selectedNotification: null })}
                    style={{marginTop: "5px", backgroundColor: "transparent"}}
                  >
                    Voltar
                </button>
               }
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
