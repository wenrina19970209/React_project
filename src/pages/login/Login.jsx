/* 
登录界面

*/
import React from 'react'
import { Form, Icon, Input, Button } from 'antd';
import logo from './image/logo.png';
import './login.less'

export default class Login extends React.Component{
    render(){
        return(
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt=""/>
                    <h1>React 尚硅谷后台管理</h1>
                </header>
                <section className='login-conent'>
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item>
                            <Input
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="用户账号"
                                />
                        </Form.Item>
                        <Form.Item>
                            <Input
                                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                type="password"
                                placeholder="用户密码"
                                />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}