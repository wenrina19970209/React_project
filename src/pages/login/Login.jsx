/* 
登录界面
Fragment
*/
import React,{Component} from 'react'
import { Form, Icon, Input, Button,message} from 'antd';


import { Redirect } from "react-router-dom";

import {reLogin} from '../../api/index'
import logo from '../../assets/image/logo.png'
import './login.less'

import memoryUtils from '../../utils/memoryUtils'
import {saveUser} from '../../utils/storageUtils'


const Item = Form.Item

 class Login extends Component{

    handleSubmit = (event)=>{

        event.preventDefault();

        //统一验证表单中的每一项
        this.props.form.validateFields(async (err,values)=>{
           
            if(!err){//验证成功
               
                // console.log('成功发送Ajax请求！',values)
                const {username,password} = values  //解构赋值，获取标识
                
                const result = await reLogin(username,password)  // {status: 0, data: user对象} | {status: 1, msg: 'xxx'}

                if(result.status === 0){//成功登录
                    const user = result.data
                
                    //保存数据
                    saveUser(user) //保存到localStorage的文件中，
                    memoryUtils.user = user //保存到内存中
                   
                    //跳转到Admin页面
                    this.props.history.replace('/')
                }else{//登录失败
                    message.error(result.msg ,2)
                }

               

         
            }
        })
        

        /* let username = this.props.form.getFieldValue('username')
        let password = this.props.form.getFieldValue('password')
        let values= this.props.form.getFieldsValue()
        console.log(username,password,values) */
    }

    
// validateFields

    validatorPwd = (rule, value, callback)=>{
        if(!value){
            callback('密码不能为空！')
        }else if(value.length < 4){
            callback('密码不能小于4位！')
        }else if(value.length > 12){
            callback('密码不能大于12位！')
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('密码必须是字母、数字、下划线！')
        }else{
            callback()
        }
    }
    
    render(){
        // debugger

        let {getFieldDecorator} = this.props.form;

        //访问login界面。如果用户登录过了，就直接跳转到admin界面
        if (memoryUtils.user._id) {
            return <Redirect to='/'/>
        }


        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt="logo"/>
                    <h1>React 项目: 后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>用户登录</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {
                                getFieldDecorator('username',{//配置对象

                                    //指定初始值伪空串
                                    initialValue:'',
                                   
                                    //声明式验证
                                    rules:[
                                        {required:true,message:'请输入用户名！'},
                                        {min:4,message:'用户名不能小于4位'},
                                        {max:12,message:'用户名不能大于12位'},
                                        {pattern:/^[a-zA-Z0-9_]+$/,message:'用户名必须是字母数字下划线'},
                                    ]
                                })(
                                 <Input
                                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Username"
                                />
                                )
                            }
                            
                        </Item>
                        <Item>
                            {
                                getFieldDecorator('password',{
                                   rules:[
                                    {validator:this.validatorPwd}
                                   ]
                                })(
                                    <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="password"
                                    placeholder="Password"
                                    />
                                )
                            }
                           
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Log in
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }
}

//返回函数包装了一个From组件生成了一个新的组件
const UserLogin = Form.create()(Login);
export default UserLogin 


