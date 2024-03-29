import React, { Component } from 'react'

class Loading extends Component {

    render() {
        return (
            <div className="login-page text-center">
                <div className="spinner-grow text-success" style={{width: "3rem", height: "3rem"}} role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }
}

export default Loading;