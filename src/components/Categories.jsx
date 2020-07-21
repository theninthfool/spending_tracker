import React from 'react'
import CategoryCard from './CategoryCard'
import PieChart from './PieChart'

export default function Categories({ categories, type }) {
    const categoriesByType = categories.filter(cat => cat.type === type);

    return (
        <div className={type}>
            <PieChart categories={categoriesByType} type={type} />
            {categoriesByType.map(cat => {
                return <CategoryCard 
                            key={cat.uid} 
                            category={cat}
                            type={type} />
            })}
        </div>
    )
}
