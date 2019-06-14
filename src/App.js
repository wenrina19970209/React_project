/* 
主后台应用管理根组件
*/
import React from 'react'
// import {Button} from 'antd'
import {HashRouter,Route,Switch} from 'react-router-dom'

import Login from  './pages/login/Login.jsx'
import Admin from  './pages/admin/Admin.jsx'

export default class App extends React.Component{
    render (){
        return (
                <HashRouter>
                    <Switch>
                        <Route path='/' component={Login}/>
                        <Route path='/Admin' component={Admin}/>
                    </Switch>
                </HashRouter>
        )
    }
}