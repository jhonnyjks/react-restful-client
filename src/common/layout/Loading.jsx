import React, { Component } from 'react'

class Loading extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}>
                <div className="spinner-grow text-success" style={{width: "3rem", height: "3rem"}} role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }
}

export default Loading;