import React from 'react'

export default function TransactionCard({ transaction }) {
    return (
        <div style={{border: '2px solid blue'}}>
            <p>Category: {transaction.category}</p>
            <p>Total: {transaction.total}</p>
        </div>
    )
}
