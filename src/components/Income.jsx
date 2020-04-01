import React, { useEffect } from 'react'
import Categories from './Categories';
// import Transactions from './Transactions';


export default function Income({ categories }) {
    const typeCategories = categories.filter(cat => cat.type === 'income');

    useEffect(() => {
        console.log('income mounted')
        return () => console.log('income unmounted')
    }, [])
    return (
            <div>
                <h2>Income</h2>
                <Categories categories={typeCategories} />
            </div>
    )
}






// export default function Income({ categories, transactions }) {
//     const { path } = useRouteMatch();
//     return (
//         <BrowserRouter>
//             <div>
//                 <h2>Income</h2>
//                 <Switch>
//                     <Route exact path={`${path}`}>
//                         <Categories categories={categories} />
//                     </Route>
//                     <Route path={`${path}/:category`}>
//                         <Transactions transactions={transactions} />
//                     </Route>
//                 </Switch>
                
//             </div>
//         </BrowserRouter>
//     )
// }
