import React from 'react'

export default function Footer() {
    if (process.env.REACT_APP_SHOW_MAIN_FOOTER === 'false') {
        return null
    }

    return (
        <footer className='main-footer hidden-xs'>
            <strong>
                Copyright &copy; {1900 + new Date().getYear()}
                <a href='https://github.com/jhonnyjks/react-restful-client' rel="noopener noreferrer" target='_blank'>
                    {process.env.REACT_ORGANIZATION}
                </a>.
            </strong>
        </footer>
    )
}