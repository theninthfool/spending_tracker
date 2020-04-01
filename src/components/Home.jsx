import React, {useEffect} from 'react'

export default function Home({ totals }) {
    useEffect(() => {
        console.log('Home Mounted')
        return () => console.log('Home Unmounted')
    }, [] );
    return (
        <div>
            <p>Spent: {totals.expenses}</p>
            <p>Earned: {totals.income}</p>
            <p>Budget: {totals.budget}</p>
        </div>
    )
}
