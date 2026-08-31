import React, { Component } from 'react'
import { HashRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Header from '../common/template/Header'
import SideBar from '../common/template/SideBar'
import Footer from '../common/template/Footer'
import Messages from '../common/msg/Message'
import Routes from './routes'


class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {        
        return (
            <HashRouter>
                    <div className="wrapper">
                        <Header />
                        <SideBar />
                        <Routes />
                        <Footer />
                        <Messages />
                    </div>
            </HashRouter>
        );
    }
}

const mapStateToProps = state => ({ auth: state.auth })
const mapDispatchToProps = dispatch => bindActionCreators({  }, dispatch)
export default connect(mapStateToProps, mapDispatchToProps)(App)
// export default App;