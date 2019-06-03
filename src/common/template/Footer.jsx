import React from 'react'
import env from '../../app/env'

export default props => (
    <footer className='main-footer'>
        <strong>
            Copyright &copy; {1900 + new Date().getYear()}
            <a href='https://github.com/jhonnyjks/react-restful-client' target='_blank'> {env.ORGANIZATION}</a>.
        </strong>
    </footer>
)