/* 
根组件
*/
import React from 'react'
// import {Button} from 'antd'
import {BrowserRouter,Route,Switch} from 'react-router-dom'

import Login from  './pages/login/Login.jsx'
import Admin from  './pages/admin/Admin.jsx'

export default class App extends React.Component{
    render (){
        return (
                <BrowserRouter>
                    <Switch>
                        <Route path='/' component={Login}/>
                        <Route path='/admin' component={Admin}/>
                    </Switch>
                </BrowserRouter>
        )
    }
}