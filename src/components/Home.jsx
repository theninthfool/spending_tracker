import React, {useEffect} from 'react'

export default function Home({ totals }) {
    useEffect(() => {
        console.log('Home Mounted')
        return () => console.log('Home Unmounted')
    }, [] );

    const style = {
        border: `2px solid gold`,
        margin: '5px',
        textAlign: 'center',
        fontWeight: 700
    }

    return (
        <div style={style}>
            <p>Spent: ${totals.expenses}</p>
            <p>Earned: ${totals.income}</p>
            <p>Budget: ${totals.budget}</p>
        </div>
    )
}
