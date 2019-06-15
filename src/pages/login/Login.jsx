/* 
登录界面
Fragment
*/
import React,{Component} from 'react'
import logo from './images/logo.png'
import { Form, Icon, Input, Button } from 'antd';
import './login.less'
const Item = Form.Item

 class Login extends Component{

    handleSubmit = (event)=>{
        event.preventDefault();

        this.props.form.validateFields((err,values)=>{
            if(!err){
                console.log('成功发送Ajax请求！',values)
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
        let {getFieldDecorator} = this.props.form;
        return (
            <div className='login'>
                <header className='login-header'>
                    <img src={logo} alt=""/>
                    <h1>React 项目: 后台管理系统</h1>
                </header>
                <section className='login-content'>
                    <h2>User login to lu</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {
                                getFieldDecorator('username',{//配置对象

                                    initialValue:'',
                                   
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


