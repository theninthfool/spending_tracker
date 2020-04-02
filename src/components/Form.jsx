import React, { useState } from 'react';
import db from './Firestore';
import '../css/form.css';

function newCategory(name, type, total) {
    const obj = type === 'income' ? (
        {name, type, total}
    ) : (
        {name, type, total, budget: 0}
    );
    return obj
}

function newTransaction(category, type, total, note) {
    return {category, type, total, note, date: new Date()}
}

export default function Form({ categories }) {
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [type, setType] = useState('expenses');

    
    const color = type === 'income' ? 'rgba(0,255,0,.5)' : 'rgba(255,0,0,.5)'


    const handleSubmit = (e) => {
        e.preventDefault();
        const total = Number(amount);
        const categoryLC = category.toLowerCase()

        const catObj = categories.find(cat => {
            return (cat.type === type && cat.name === categoryLC)
        });
        const id = catObj ? catObj.uid: null

           
        const totalsRef = db.doc('totals/totals');
        const catDocRef = db.doc(`categories/${id}`);
        const newTransRef = db.collection(`transactions`).doc();

        db.runTransaction(transaction => {
            const arr = [
                transaction.get(catDocRef),
                transaction.get(totalsRef)
            ]

            return Promise.all(arr).then(values => {
                const categoryData = values[0].data();
                const totalsData = values[1].data();
                if(categoryData) {
                    // add amount to category total
                    const newTotal = categoryData.total + total;
                    transaction.update(catDocRef, { total: newTotal});
                } else {
                    //make new category
                    const newCatRef = db.collection(`categories`).doc();
                    const newCat = newCategory(categoryLC, type, total);
                    transaction.set(newCatRef, newCat)
                }

                //add amount to totals
                const newTotal = totalsData[type] + total;
                transaction.update(totalsRef, {[type]: newTotal});

                //add transaction
                const newTrans = newTransaction(categoryLC, type, total, note);
                transaction.set(newTransRef, newTrans);
            })
                    
        }).then(() => {
            console.log("Transaction Completed");
        }).catch(function(err) {
            console.error(err);
        });


        setType('expenses')
        setCategory('');
        setAmount('');
        setNote('')
    }
    return (
       <div className='formContainer'> 
            <div className='tabs'>
                <div onClick={() => setType('income')} style={{background: 'rgba(0,255,0,.5'}}>
                    Income
                </div>
                <div onClick={() => setType('expenses')} style={{background: 'rgba(255,0,0,.5'}}>
                    Expenses
                </div>
            </div>
            <form onSubmit={handleSubmit}
                    style={{background: `${color}`}}>
                <label className='formItems'>
                    <p>Category:</p>
                    <input 
                        type="text" 
                        value={category}
                        onChange={e => setCategory(e.target.value)}  />
                </label>
                <label className='formItems'>
                    <p>Amount:</p>
                    <input 
                        type="text" 
                        value={amount}
                        onChange={e => setAmount(e.target.value)} />
                </label>
                <label className='formItems'>
                    <p>Note:</p>
                    <input 
                        type="textarea" 
                        value={note}
                        onChange={e => setNote(e.target.value)} />
                </label>
                <input type="submit" value={`submit to ${type}`} />
            </form>
       </div>
    )
}
