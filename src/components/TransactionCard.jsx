import React from 'react';
import db from './Firestore';

export default function TransactionCard({ transaction, categoryUID }) {
    const color = transaction.type === 'income' ? 'green' : 'red';
    const style = {
        border: `2px solid ${color}`,
        margin: '5px',
        paddingBottom: '10px',
        textAlign: 'center'
    }

    const handleSubmit = () => {
        const { uid, type, total, category } = transaction;
        // const amount = Number(transaction.total)
        const totalsRef = db.doc('totals/totals');
        const catDocRef = db.doc(`categories/${categoryUID}`);
        const transRef = db.doc(`transactions/${uid}`);

        db.runTransaction(transaction => {
            const arr = [
                transaction.get(catDocRef),
                transaction.get(totalsRef),
                transaction.get(transRef)
            ]

            return Promise.all(arr).then(values => {
                const newCategoryTotal = values[0].data().total - total;
                const newTotalsTotal = values[1].data()[type] - total;


                //update category
                transaction.update(catDocRef, { total: newCategoryTotal});

                //update totals
                transaction.update(totalsRef, {[type]: newTotalsTotal});

                //delete transaction
                transaction.delete(transRef)
            })
                    
        }).then(() => {
            console.log("Transaction Completed");
        }).catch(function(err) {
            console.error(err);
        });
    }



    return (
        <div style={style}>
            <p>Type: {transaction.type}</p>
            <p>Category: {transaction.category}</p>
            <p>Total: {transaction.total}</p>
            <button onClick={handleSubmit}>Delete</button>
        </div>
    )
}
