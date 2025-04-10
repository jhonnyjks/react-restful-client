import React, { Component } from 'react'

class Loading extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="overlay-wrapper">
                <div className="overlay bg-white">
                    <div className="spinner-grow text-success" style={{width: "3rem", height: "3rem"}} role="status">
                        <span className="sr-only">Carregando...</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Loading;