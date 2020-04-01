import React, { useEffect } from 'react';
import CategoryCard from './CategoryCard';

export default function Categories({ categories }) {

    useEffect(() => {

    })
    return (
        <div>
            {categories.map(cat => {
                return <CategoryCard category={cat} />
            })}
        </div>
    )
}
