import React, { useState } from 'react'
import db from './Firestore';

export default function Form({ categories }) {
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [type, setType] = useState('expenses');


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Category = ${category}`);
        console.log(`amount = ${amount}`);
        console.log(`type = ${type}`);

        let catObj = categories.find(cat => {
            return (cat.type === type && cat.name === category)
        });
        let id = catObj ? catObj.uid: null

           
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
                    // console.log('old category ', categoryData)
                    const newTotal = categoryData.total + Number(amount);
                    // console.log('new category total ', newTotal)
                    transaction.update(catDocRef, { total: newTotal});
                } else {
                    const newCatRef = db.collection(`categories`).doc();
                    //make new category
                    if(type === 'income') {
                        //create new income category
                        const newCategory = {
                            name: category,
                            total: Number(amount),
                            type: 'income'
                        }
                        console.log('new category = ', newCategory);
                        transaction.set(newCatRef, newCategory);
                    } else {
                        //create new expense category
                        const newCategory = {
                            name: category,
                            total: Number(amount),
                            type: 'expenses',
                            budget: 0
                        }
                        // console.log('new category = ', newCategory);
                        transaction.set(newCatRef, newCategory);

                    }
                }
                
                if (type === 'income'){
                    // add amount to total earned
                    // console.log('old totals ', totalsData);
                    const newTotal = totalsData.income + Number(amount);
                    // console.log('new total income', newTotal);
                    transaction.update(totalsRef, {income: newTotal});
                } else {
                    // add amount to total spent
                    // console.log('old totals ', totalsData);
                    const newTotal = totalsData.expenses + Number(amount);
                    // console.log('new total expenses', newTotal);
                    transaction.update(totalsRef, {expenses: newTotal});
                }

                //add transaction
                const newTransaction = {
                    category,
                    type,
                    note,
                    total: Number(amount),
                    date: new Date()
                }
                // console.log('transaction = ', newTransaction);
                transaction.set(newTransRef, newTransaction);
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
        <form onSubmit={handleSubmit}>
            <label className='formItems'>
                Type:
                <select 
                    name='typeValue'
                    value={type} 
                    onChange={e => setType(e.target.value)}>
                    <option value="expenses">Expense</option>
                    <option value="income">Income</option>
                </select>
            </label>
            <label>
                Category:
                <input 
                    type="text" 
                    value={category}
                    onChange={e => setCategory(e.target.value)}  />
            </label>
            <label>
                Amount:
                <input 
                    type="text" 
                    value={amount}
                    onChange={e => setAmount(e.target.value)} />
            </label>
            <label>
                Note:
                <input 
                    type="text" 
                    value={note}
                    onChange={e => setNote(e.target.value)} />
            </label>
            <input type="submit" value="Submit" />
        </form>
    )
}
