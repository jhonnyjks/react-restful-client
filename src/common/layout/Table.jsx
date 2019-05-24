import React, { Component } from 'react'
import If from '../operator/If'

export default class Table extends Component {

    renderHead = () => {
        if (this.props.head) {
            return <thead>
                <tr>
                    {this.props.head.map((val, index) => <th key={index}>{val}</th>)}
                </tr>
            </thead>
        }
    }

    renderBody = () => {
        if (this.props.body) {
            return <tbody>
                {
                    this.props.body.map((tr, index) => {
                        return <tr key={tr.key || tr.id || index}>
                            {
                                tr.map((val, index) =>
                                    <td key={index} style={{ padding: '2px 6px 2px 6px' }}>
                                        {val}
                                    </td>
                                )
                            }
                        </tr>
                    })
                }
            </tbody>
        }
    }

    render() {
        return (
            <div className='box material-item' style={{ paddingBottom: '3px' }}>
                <If test={this.props.title}>
                    <div className='box-header'>
                        <h3 className='box-title'>{this.props.title}</h3>
                    </div>
                </If>
                <div className='box-body no-padding'>
                    <table className='table table-striped'>
                        {this.renderHead()}
                        {this.renderBody()}
                        {this.props.children}
                    </table>
                </div>
            </div>
        )
    }
}