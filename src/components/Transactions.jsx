import React, { useEffect } from 'react';
// import {  useParams } from 'react-router-dom';
import TransactionCard from './TransactionCard';

export default function Transactions({ transactions, transMounted, setTransMounted }) {
    // const { category } = useParams();
    // const [catTrans, setCatTrans] = useState([]);
    // useEffect(() => {
    //     const catTrans = transactions.filter(trans => {
    //         return (trans.type === 'income' && trans.category === category)
    //     });
    //     setCatTrans(catTrans)
    // }, [transactions, category]);

    useEffect(() => {
        if(!transMounted) setTransMounted(true)
    });
    
    return (
        <div>
            {transactions.map(transaction => {
                return <TransactionCard transaction={transaction} />
            })}
        </div>
    )
}
