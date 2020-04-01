import React from 'react'

export default function TransactionCard({ transaction }) {
    const color = transaction.type === 'income' ? 'green' : 'red';
    const style = {
        border: `2px solid ${color}`,
        margin: '5px',
        textAlign: 'center'
    }
    return (
        <div style={style}>
            <p>Type: {transaction.type}</p>
            <p>Category: {transaction.category}</p>
            <p>Total: {transaction.total}</p>
        </div>
    )
}
