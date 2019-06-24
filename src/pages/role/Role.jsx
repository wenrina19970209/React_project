import React, { Component } from 'react'
import { 
    Card ,
    Button,
    Table,
    Modal,
    message
} from 'antd';
import LinkButton from '../../components/link-button'
import {PAGE_SIZE}  from '../../utils/constants'
import {formateDate} from '../../utils/dateUtils'
import {reRoles,reAddRole,reUpdateRoles} from '../../api'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'

export default class Role extends Component {

    state = {
       roles:[], //所有角色列表的数组
       isShowAdd: false, //是否显示添加界面
       isShowAuth:false //是否显示权限界面
    }

    constructor(props){
        super(props)
        //创建一个容器
        this.authRef = React.createRef()

    }



    //定义初始化列数组
    initColumns = ()=>{
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: create_time => formateDate(create_time)  //格式化时间
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate //上面的简化写法
            },
            {
                title: '授权人',
                dataIndex:'auth_name',
                width: 150,
            }, 
            {
                title: '操作',
                width: 150,
                render: (role) => <LinkButton onClick={()=> this.showAuth(role) }>设置授权</LinkButton>
            }, 
        ]
    }



    //显示权限设置界面
    showAuth = (role) =>{
        this.role = role
        this.setState({
            isShowAuth:true
        })
    }

    //异步获取角色列表
    getRoles = async () =>{
        //发送请求
        const result = await reRoles()
        if(result.status === 0){
            const roles = result.data
            this.setState({
                roles
            })
        }

    }


    //添加角色
    addRole = () =>{
        //验证表单，通过之后才能向下执行
        this.form.validateFields(async (err,value)=>{
            if(!err){  
                //关闭添加的对话框
                this.setState({
                    isShowAdd:false
                })

                //清除输入的内容
                this.form.resetFields()

                console.log('验证成功：',value)
                //请求添加role
                const result = await reAddRole(value.roleName)

                console.log('请求回来的数据：',result)
                //请求添加成功,重新获取角色
                if(result.status === 0){
                    //成功的提示
                    message.success('角色添加成功！')
                    
                    const role = result.data
                    const roles = this.state.roles

                    //roles.push(role)
                    //this.setState({roles})

                    this.setState({
                        roles:[...roles,role]  //生成新的数组
                    })
                }
                

            }

        })
    }


    //给角色授权
    updateRole = async () =>{
        //隐藏对话框
        this.setState({
            isShowAuth:false
        })

        //更新user对象的属性
        const role = this.role
        role.menus = this.authRef.current.getMenus()
        role.auth_time = Date.now()  //授权时间
        role.auth_name = memoryUtils.user.username  //授权人

        //给角色授权，发送请求更新用户
        const result = await reUpdateRoles(role)
        if(result.status === 0){
            message.success('授权成功')
            this.getRoles()  //重新获取角色列表
        }
    }


    componentWillMount(){
        //初始化加载列表
        this.initColumns()
    }

    componentDidMount(){
        //异步获取角色列表
        this.getRoles()
    }

    render() {
        const {roles,isShowAdd,isShowAuth} = this.state
        const role = this.role || {}
      

        const title = (
            <span>
                <Button type='primary' onClick={()=> this.setState({isShowAdd:true})}>添加角色</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                        bordered  //表格的边框线
                        rowKey="_id"    //表格行的Key的取值，每一行需要有一个唯一的Key
                        columns={this.columns}  //列
                        dataSource={roles}  //前台分页显示
                        pagination={{//配置对象 。
                            defaultPageSize:PAGE_SIZE,  //，每页分别显示多少条数据
                        }} 
                    />

                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={()=>{
                        this.setState({isShowAdd:false})
                    }}
                    >
                    <AddForm setForm={form => this.form = form}/>
                </Modal>


                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={()=>{
                        this.setState({isShowAuth:false})
                    }}
                    >
                    <AuthForm role={role} ref={this.authRef}/>
                </Modal>
            </Card>
        )
    }
}
