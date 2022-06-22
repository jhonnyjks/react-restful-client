import React from "react";
import Sidebar from "react-sidebar";
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { openCloseMiniSideBar, setSideBar } from './templateActions'
import Menu from './Menu'

const SidebarSema = props => (
    <aside className='main-sidebar sidebar-dark-success elevation-4'>
        <a href="#!" className="brand-link">
            { process.env.REACT_APP_LOGO ?
            <img src={process.env.REACT_APP_LOGO} alt={process.env.REACT_APP_NAME} className="brand-image brand-image--custom"
                style={{ opacity: .8 }}></img>
            : <span className="brand-text font-weight-light text-center"><strong>{process.env.REACT_APP_NAME}</strong></span>
            }
        </a>
        <div className='sidebar sidebar--sema'>
            <Menu />
        </div>
    </aside>
)

const mql = window.matchMedia(`(min-width: 800px)`);
class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarDocked: mql.matches,
            sidebarOpen: false
        };

        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    }

    componentWillMount() {
        this.setState({ sidebarOpen: this.props.template.sideBarOpened });
        mql.addListener(this.mediaQueryChanged);
    }

    componentWillUnmount() {
        mql.removeListener(this.mediaQueryChanged);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ sidebarOpen: nextProps.template.sideBarOpened });
    }

    mediaQueryChanged() {
        this.props.setSideBar(false)
        this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
    }

    render() {
        return (
            <Sidebar
                sidebar={<b>Sidebar content</b>}
                open={this.state.sidebarOpen}
                docked={this.state.sidebarDocked}
                onSetOpen={(e) => this.props.openCloseMiniSideBar(e)}
                shadow={false}
                styles={{ root: { position: "relative" },  sidebar: { background: "none" } }}
            >
                <SidebarSema />
            </Sidebar>
        );
    }

}

const mapDispatchToProps = dispatch => bindActionCreators({ openCloseMiniSideBar, setSideBar }, dispatch)
const mapStateToProps = state => ({ template: state.template })
export default connect(mapStateToProps, mapDispatchToProps)(SideBar)