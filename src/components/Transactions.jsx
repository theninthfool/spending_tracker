import React, { useEffect } from 'react';
// import {  useParams } from 'react-router-dom';
import TransactionCard from './TransactionCard';

export default function Transactions({ categories, transactions, transMounted, setTransMounted }) {

    useEffect(() => {
        if(!transMounted) setTransMounted(true)
    }, [transMounted, setTransMounted]);

    
    return (
        <div>
            {transactions.map(transaction => {
                const category = categories.find(cat => {
                    return (cat.name === transaction.category && cat.type === transaction.type)
                });
                // console.log(category)
                return (
                    <TransactionCard 
                        key={transaction.uid} 
                        transaction={transaction}
                        categoryUID={category.uid} 
                        />
                ) 
            })}
        </div>
    )
}
