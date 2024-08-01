import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { openCloseMiniSideBar, setSideBar } from './templateActions';
import Menu from './Menu';
import ProfileHeader from './ProfileHeader';

class SidebarSema extends Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: false,
            width: 0,
            height: 0,
        };

        window.addEventListener("resize", () => {
            this.setState({ width: window.innerWidth, height: window.innerHeight });
        });
    }

    handleMouseEnter = () => {
        this.setState({ hover: true });
    }

    handleMouseLeave = () => {
        this.setState({ hover: false });
    }

    componentDidMount() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    
        }

    render() {

        return (
            <div>
                <aside className='main-sidebar sidebar-dark-success elevation-4'
                    style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}>
                    <a href="#!" className="brand-link 	d-none d-sm-block">
                        { process.env.REACT_APP_LOGO ?
                        <img src={process.env.REACT_APP_LOGO} alt={process.env.REACT_APP_NAME} className="brand-image brand-image--custom"></img>
                        : <span className="brand-text font-weight-light text-center"><strong>{process.env.REACT_APP_NAME}</strong></span>
                        }
                    </a>
                    <div className='sidebar sidebar--sema' style={{ flex: 2, overflowY: 'auto'}}>
                        <Menu />
                    </div>

                    <div style={{ paddingRight: '20px', paddingLeft: '20px', marginBottom: '-40px' }}>
                        <ProfileHeader hover={this.state.hover || (this.state.width <= 600)} />
                    </div>
                </aside>
                <div id="sidebar-overlay" onClick={this.props.openCloseMiniSideBar}></div>
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => bindActionCreators({ openCloseMiniSideBar, setSideBar }, dispatch);
const mapStateToProps = state => ({ template: state.template });
export default connect(mapStateToProps, mapDispatchToProps)(SidebarSema);
