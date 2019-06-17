/* 
后台管理界面的一级路由
*/

import React from 'react'


import {Redirect,Route,Switch} from 'react-router-dom'

import { Layout } from 'antd';
import AdminHeader from '../../components/header/index'
import LeftNav from '../../components/left-nav/index'
import memoryUtils from "../../utils/memoryUtils"; 

import Home from '../home/Home'
import Category from '../category/Category'
import Product from '../product/Product'
import User from '../user/User'
import Role from '../role/Role'
import Bar from '../charts/Bar'
import Line from '../charts/Line'
import Pie  from  '../charts/Pie'



const { Footer, Sider, Content } = Layout;



/* 
一级路由
*/
export default class Admin extends React.Component{

    

    render(){
        // debugger
        
        //如果当前没有登陆（内存的user中没有_id）
        const user = memoryUtils.user
        //如果当前没有登陆，就跳转到login
        if (!user._id) {
            return <Redirect to='/login'/>
        }

        
        return (
            // <div>hello！{user.username}</div>
            <Layout style={{height:'100%'}}>
                <Sider >
                    <LeftNav/>
                </Sider>
                <Layout>
                    <AdminHeader/>
                    <Content style={{backgroundColor:'#fff',margin:'30px  30px  0  30px'}}>
                        <Switch>
                            <Route path='/home' component={Home}/>
                            <Route path='/category' component={Category}/>
                            <Route path='/product' component={Product}/>
                            <Route path='/user' component={User}/>
                            <Route path='/role' component={Role}/>
                            <Route path='/charts/bar' component={Bar}/>
                            <Route path='/charts/pie' component={Pie}/>
                            <Route path='/charts/line' component={Line}/>
                            <Redirect to='/Home'/>
                        </Switch>

                    </Content>
                    <Footer style={{textAlign:'center',color:'#aaa'}}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
                </Layout>
            </Layout>

        )
    }
}