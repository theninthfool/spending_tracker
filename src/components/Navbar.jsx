import React from 'react';
import '../css/navbar.css'
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <div className="container">
                <Link className="links" to='/'>Home</Link>
                <Link className="links" to='/income'>Income</Link>
                <Link className="links" to='/expenses'>Expenses</Link>
                <Link className="links" to='/transactions'>Transactions</Link>
            </div>
        </nav>
    )
}

export default Navbar;
