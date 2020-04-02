import React, { useState, useEffect } from 'react'
import db from './Firestore';
import '../css/form.css'

export default function Form({ categories }) {
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [type, setType] = useState('expenses');

    
    const color = type === 'income' ? 'rgba(0,255,0,.5)' : 'rgba(255,0,0,.5)'


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(`Category = ${category}`);
        console.log(`amount = ${amount}`);
        console.log(`type = ${type}`);

        
        let catObj = categories.find(cat => {
            return (cat.type === type && cat.name === category.toLowerCase())
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
                            name: category.toLowerCase(),
                            total: Number(amount),
                            type: 'income'
                        }
                        console.log('new category = ', newCategory);
                        transaction.set(newCatRef, newCategory);
                    } else {
                        //create new expense category
                        const newCategory = {
                            name: category.toLowerCase(),
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
                    category: category.toLowerCase(),
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


        setType('income')
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
