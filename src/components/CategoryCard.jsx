import React from 'react'
import { Link } from 'react-router-dom';

export default function CategoryCard({ category }) {
     return (
         <Link to={`income/${category.name}`}>
            <div style={{border: '2px solid blue'}}>
                <p>Name: {category.name}</p>
                <p>Total: {category.total}</p>
            </div>
         </Link>
    )
}
