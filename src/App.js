import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import Home from './components/Home';
import Form from './components/Form'
import Income from './components/Income'
import Transactions from './components/Transactions';
// import Expenses from './components/Expenses'
import db from './components/Firestore';

function App() {
  const [totals, setTotals] = useState('');
  useEffect(() => {
    console.log('App Mounted')
    const unsubcribe = db.doc('totals/totals')
          .onSnapshot(function(doc) {
            // console.log("Current data: ", doc);
            setTotals(doc.data());
    });
    
    return () => unsubcribe()
  }, []);

  const [categories, setCategories] = useState([])
  useEffect(() => {
    const unsubcribe = db.collection('categories')
          .onSnapshot(function(snap) {
            // console.log("Current data: ", snap.docChanges());
            
            snap.docChanges().forEach(change => {
              if(change.type === 'added') {
                let cat = {...change.doc.data(), uid: change.doc.id}
                setCategories(prev => [...prev, cat]);
              }
              if (change.type === 'modified') {
                const updateCategory = (categories) => {
                  let newArr = categories.map(cat => {
                    if(cat.uid === change.doc.id) {
                      // console.log(change.doc.data());
                      return { ...change.doc.data(), uid: change.doc.id }
                    } else {
                      return cat
                    }
                  });
                  return newArr;
                }
                setCategories(prev => updateCategory(prev));
              }
            })
    });
    
    return () => unsubcribe()
  }, []);

  


  const [transactions, setTransactions] = useState([])
  const [transMounted, setTransMounted] = useState(false);
  useEffect(() => {
    console.log( `is trans listening: ${transMounted}`)
    if (transMounted) {
      var unsubcribe = db.collection('transactions')
          .onSnapshot(function(snap) {
            snap.docChanges().forEach(change => {
              if(change.type === 'added') {
                const newTransaction = {...change.doc.data(), uid: change.doc.id}
                // console.log(change.doc.data());
                setTransactions(prev => [...prev, newTransaction]);
              }
              if (change.type === 'removed') {
                // console.log(change.doc.data())
                const id = change.doc.id
                const deleteTransaction = (transactions, id) => {
                  const newTransactions = transactions.filter(transaction => {
                    return transaction.uid !== id
                  });
                  return newTransactions
                }
                
                setTransactions(prev => deleteTransaction(prev, id));
              }
            })
    })
    }
    return () => {
      if(transMounted) unsubcribe()
    }
  }, [transMounted])
  
  
  return (

    <BrowserRouter>
                <div className="App">
                    <Navbar setTransMounted={setTransMounted}
                            transMounted={transMounted} />
                    <Switch>
                        <Route path="/income">
                          <Income categories={categories} />
                        </Route>
                        <Route path="/transactions">
                          <Transactions transactions={transactions}
                                        setTransMounted={setTransMounted}
                                        transMounted={transMounted}
                                        categories={categories} /> 
                        </Route>
                        <Route exact path="/">
                           <Home totals={totals} />  
                        </Route>

                        {/* <Route path="/expenses">
                            <Expenses categories={expensesCats}
                                  transactions={expensesTrans} />
                        </Route> */}
                    </Switch>
                    <Form setTotals={setTotals}
                          categories={categories} />
                </div>
            </BrowserRouter>
  
  );
}

export default App;
