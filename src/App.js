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
                
                let cat = change.doc.data();
                cat.uid = change.doc.id;
                // console.log(cat)
                // console.log(change.doc.data());
                setCategories(prev => [...prev, cat]);
              }
              if (change.type === 'modified') {
                console.log(change.doc.id);
                const updateCategory = (categories) => {
                  let newArr = categories.map(item => {
                    if(item.uid === change.doc.id) {
                      //try object spread syntax
                      let newItem = change.doc.data();
                      newItem.uid = change.doc.id;
                      return newItem
                    } else {
                      return item
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
            // console.log("Current data: ", snap.docChanges());
            
            snap.docChanges().forEach(change => {
              if(change.type === 'added') {
                // console.log(change.doc.data());
                setTransactions(prev => [...prev, change.doc.data()]);
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
                        {/* <Route path={`/income/:category`}>
                          <Transactions transactions={transactions} />
                        </Route> */}
                        <Route path="/income">
                          <Income categories={categories} />
                        </Route>
                        <Route exact path="/transactions">
                          <Transactions transactions={transactions}
                                        setTransMounted={setTransMounted}
                                        transMounted={transMounted} /> 
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
