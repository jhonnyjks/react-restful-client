import React, { Component } from 'react'

class Paginate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            limit: 10
        }
        this.onChangeLimit = this.onChangeLimit.bind(this)
    }

    onChangeLimit = (e) => {
        this.setState({ limit: parseInt(e.target.value) }, () => this.props.source(this.state.page, this.state.limit))
    }

    componentWillMount() {
        this.props.source(1, this.state.limit)
    }

    getPage = (e, page) => {
        e.preventDefault()
        this.setState({ page: page + 1 }, () => this.props.source(this.state.page, this.state.limit))
    }

    renderPrevious = () => {
        return (
            <li className="page-item">
                <a className="page-link" href="!#" onClick={e => this.getPage(e, 0)} aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                    Primeiro
                </a>
            </li>
        )
    }

    renderNext = () => {
        return (
            <li className="page-item">
                <a className="page-link" href="!#" onClick={e => this.getPage(e, this.props.data.last_page - 1)} aria-label="Next">
                    Ultimo
                    <span aria-hidden="true">&raquo;</span>
                    <span className="sr-only">Next</span>
                </a>
            </li>
        )
    }

    renderPages = () => {
        let pgs = []
        for (let index = 0; index < this.props.data.last_page; index++) {
            pgs.push(
                <li key={index} className={`page-item ${this.props.data.current_page === index + 1 ? `active` : ``}`}>
                    <a className="page-link" onClick={e => this.getPage(e, index)} href="#!">{index + 1}</a>
                </li>)
        }
        return pgs
    }

    renderLimit = () => {
        return (
            <li className="page-item col-xs-12">
                <div className="form-group form-inline">
                    <label htmlFor="inputPassword6">&nbsp; Limite:</label>
                    <select type="password" id="inputPassword6" value={this.state.limit} onChange={this.onChangeLimit} className="form-control mx-sm-3">
                        <option value="1">1</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                    </select>
                </div>
            </li>
        )
    }

    render() {
        return (<nav aria-label="Page navigation example">
            <ul className="pagination">
                {this.renderPrevious()}
                {this.renderPages()}
                {this.renderNext()}
                {this.renderLimit()}
            </ul>
        </nav>);
    }
}

export default Paginate;