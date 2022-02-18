// Not required anymore
//import React from 'react'
import PropTypes from 'prop-types'


            //  arguments  function body after the arrow
const Header = ({ title }) => {
    return (
        <header>
            <h1> {title} from Header.js!</h1>
        </header>
    )
}

Header.defaultProps = {
    title: 'Hello'
}

Header.propTypes = {
    title: PropTypes.string
}

export default Header
