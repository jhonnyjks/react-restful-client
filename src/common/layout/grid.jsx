import React, { Component } from 'react'

export default class Grid extends Component {

    toCssClasses(numbers) {
        const cols = numbers ? numbers.split(' ') : []
        let classes = ''

        if (cols[0]) classes += `col-xs-${cols[0]} `
        if (cols[1]) classes += `col-sm-${cols[1]} `
        if (cols[2]) classes += `col-md-${cols[2]} `
        if (cols[3]) classes += `col-lg-${cols[3]} `
        if (cols[4]) classes += `col-xl-${cols[4]} `
        
        return classes
    }

    render() {
        const gridClasses = this.toCssClasses(this.props.cols || '12')
        return (
            <div
                {...this.props}
                className={gridClasses + ' ' + (this.props.className || '')}
                style={{ marginBottom: '15px', ...this.props.style }}
                
            >
                {this.props.children}
            </div>
        )
    }
}