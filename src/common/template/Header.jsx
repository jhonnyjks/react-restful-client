import React, { Component } from "react";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { openCloseSideBar, openCloseMiniSideBar, getNotifications } from './templateActions'
import { log } from "devexpress-richedit/dist/pdfkit";


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
    notifications.map((notify, i) => {
      const linkToList =  process.env.PUBLIC_URL + notify.linkToList
            
      return <li key={i} className="nav-item dropdown">
        <a className="nav-link" data-toggle="dropdown" href="#" aria-expanded="true" title={notify.title}>
          
          <i className={ "fas fa-" + notify.icon + " color-icon-white"} style={{ width: '24px', height: '24px' }}></i>
          
          <span className={"badge badge-" + notify.type + " navbar-badge"}>
            { notify.items.length }
          </span>
        </a>

        <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right" style={{ left: 'inherit', right: '0px' }}>
          
          <div className="dropdown-item dropdown-header" style={{ textAlign: 'left', paddingTop: '20px', paddingLeft: '20px' }}>
            <span className="circle">{notify.items.length}</span>
            <strong className="processo-text text-truncate">{ notify.title }</strong>
          </div>

          <div style={{ marginLeft: '15px', marginRight: '15px' }}>
            <div className="dropdown-divider"></div>      
          </div>

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

            return <div key={item.id}>
                <a href={ itemLink } className="dropdown-item">
                <i className={ "fas fa-file-alt mr-2 blue-text" }></i> {item.entity?.initials || ''} { item.id }
                <span className="float-right text-muted text-sm" title={(new Date(item.date)).toLocaleString()}>
                  { itemTime }
                </span>
              </a>
            </div>
          })

          }
          <div className="dropdown-divider"></div>      
          
          { notify.linkToList && 
            <a href={ linkToList } className="dropdown-item dropdown-footer">
              <button type="button" className="btn btn-primary w-100">Ver Todos</button>
            </a>
          }

        </div>
      </li>
    })
  

  render() {

    if(!this.state.intervalId) {
      this.props.getNotifications()
      this.setState({intervalId: setInterval(() => {
        this.props.getNotifications()
      }, 10000)})
    }
    const { innerWidth, innerHeight } = window;

    return (
      <nav className={`main-header navbar navbar-expand ${innerWidth >= 767.98 ? 'navbar-primary':''} navbar-dark`}>
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
        <ul className="navbar-nav m-auto">
        <a href="#!" className="brand-link text-center d-block d-sm-none">
            { process.env.REACT_APP_LOGO ?
            <img style={{maxWidth:'113px'}} src={process.env.REACT_APP_LOGO} alt={process.env.REACT_APP_NAME} className="brand-image brand-image--custom"></img>
            : <span className="brand-text font-weight-light text-center"><strong>{process.env.REACT_APP_NAME}</strong></span>
            }
        </a>
        </ul>
        <ul className="navbar-nav ml-auto d-none d-sm-block" style={{ paddingRight: '40px' }}>
          { (this.props.notifications && this.props.notifications.length > 0) && this.renderNotifications(this.props.notifications) }
        </ul>
        <ul className="navbar-nav ml-auto d-block d-sm-none">
            <a className="nav-link nav-link--sm" data-widget="pushmenu">
              <i className="fas fa-th-large"></i>
            </a>
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