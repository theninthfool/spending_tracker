import React from 'react'
import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
    const style = {
        border: `2px solid blue`,
        margin: '5px',
        textAlign: 'center',
        fontWeight: 700
    }
     return (
         <Link to={`income/${category.name}`}>
            <div style={style}>
                <p>{category.name.toUpperCase()}</p>
                <p>Total: {category.total}</p>
            </div>
         </Link>
    )
}
