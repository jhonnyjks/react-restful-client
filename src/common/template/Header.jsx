import React, { Component } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { openCloseSideBar, openCloseMiniSideBar, getNotifications } from './templateActions'


class Header extends Component {

  constructor(props) {
    super(props)

    this.state = {
      intervalId: null
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
    this.setState({intervalId: null})
  }

  renderNotifications = (notifications) => 
    notifications.map((notify, i) =>
      <li key={i} className="nav-item dropdown">
        <a className="nav-link" data-toggle="dropdown" href="#" aria-expanded="true" title={notify.title}>
          <i className={ "fas fa-" + notify.icon}></i>
          <span className={"badge badge-" + notify.type + " navbar-badge"}>
            { notify.items.length }
          </span>
        </a>
        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right" style={{ left: 'inherit', right: '0px' }}>
          <span className="dropdown-item dropdown-header">{ notify.items.length } - { notify.title.toUpperCase() }</span>
          { notify.items.slice(0, 10).map((item, j) => {

            let itemLink = item.link || notify.linkToItem
            itemLink =  process.env.PUBLIC_URL + itemLink + (itemLink[itemLink.length-1] != '/' ? '/' : '') + item.id
            
            let itemTime = ((new Date()) - (new Date(item.date))) / 60000
            if(itemTime < 1) {
              itemTime = Number.parseInt(itemTime*60) + ' segundo' + (Number.parseInt(itemTime*60) > 1 ? 's' : '')
            } else if(itemTime > 1439) {
              itemTime = Number.parseInt(itemTime/1440) + ' dia' + (Number.parseInt(itemTime/1440) > 1 ? 's' : '')
            } else if(itemTime > 59) {
              itemTime = Number.parseInt(itemTime/60) + ' hora' + (Number.parseInt(itemTime/60) > 1 ? 's' : '')
            } else {
              itemTime = Number.parseInt(itemTime) + ' minuto' + (Number.parseInt(itemTime) > 1 ? 's' : '')
            }

            return <>
              <div key={item.id} className="dropdown-divider"></div>
                <a href={ itemLink } className="dropdown-item">
                <i className={ "fas fa-" + (item.icon || notify.icon) + " mr-2" }></i>{ item.label || item.id }
                <span className="float-right text-muted text-sm" title={(new Date(item.date)).toLocaleString()}>
                  { itemTime }
                </span>
              </a>
            </>
          })

          }
          <div className="dropdown-divider"></div>
          { notify.linkToList && <a href={ notify.linkToList } className="dropdown-item dropdown-footer">Ver Todos</a> }
        </div>
      </li>
    )
  

  render() {

    if(!this.state.intervalId) {
      this.props.getNotifications()
      this.setState({intervalId: setInterval(() => {
        this.props.getNotifications()
      }, 10000)})
    }

    return (
      <nav className={"main-header navbar navbar-expand navbar-" + (process.env.REACT_APP_THEME || 'green') + " navbar-dark"}>
        <ul className="navbar-nav">
          <li className="nav-item">
            <a href="#!" className="nav-link nav-link--bg" onClick={(e) => this.props.openCloseSideBar(e)} data-widget="pushmenu">
              <i className="fas fa-bars"></i>
            </a>
            <a href="#!" className="nav-link nav-link--sm" onClick={(e) => this.props.openCloseMiniSideBar(e)} data-widget="pushmenu">
              <i className="fas fa-bars"></i>
            </a>
          </li>
        </ul>
        <ul className="navbar-nav ml-auto">
          { (this.props.notifications && this.props.notifications.length > 0) && this.renderNotifications(this.props.notifications) }
        </ul>
      </nav>
    )
  }
}

const mapStateToProps = state => ({
  notifications: state.template.notifications || []
})
const mapDispatchToProps = dispatch => bindActionCreators({ openCloseSideBar, openCloseMiniSideBar, getNotifications }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(Header)