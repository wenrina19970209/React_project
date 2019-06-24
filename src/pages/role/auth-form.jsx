import React, { Component } from 'react'
import { Form , Input } from 'antd'
import menuList from '../../config/menuConfig'
import PropTypes from 'prop-types'
import { Tree } from 'antd';

const { TreeNode } = Tree;
const Item = Form.Item


export default class AuthForm extends Component {

    static  propTypes = {
        role:PropTypes.object
    }

/* 
    state = {
        checkedKeys : [] 
    } */

    constructor(props){//只执行1次
        super(props)
        //读取当前角色状态
        const menus = this.props.role.menus
        //初始化状态
        this.state = {
            checkedKeys:menus
        }
    }

    //获取当前选中所有的key数组(复选框)
    getMenus = ()=>{
        return this.state.checkedKeys
    }


    initTreeNodes = (menuList)=>{
        return menuList.reduce((pre,item)=>{
            pre.push(
                <TreeNode title={item.title} key={item.key}>
                    { item.children? this.initTreeNodes(item.children):null }
                </TreeNode>
            )

            return pre
        },[])
    }


   


    //点击复选框的回调
    onCheck = (checkedKeys) =>{
        //更新状态
        this.setState({
            checkedKeys
        })
    }



    componentWillMount(){
        this.treeNodes = this.initTreeNodes(menuList)

    }


    /* 
    当接收新的属性时会自动调用(初始化不会执行)
    当前组件将要更新
    自身变化，不会调用
    */
    componentWillReceiveProps(nextProps){
        //新的menus
        const menus = nextProps.role.menus
        //更新状态
        this.setState({
            checkedKeys:menus
        
        })

    }


    render() {
        const role = this.props.role
        const { checkedKeys } = this.state

        const formItemLayou = {
            labelCol:{ span:4 },  //左侧label的宽度
            wrapperCol:{ span:15 } 　// 右侧包裹的宽度
        }
        return (
            <div>
                <Item label='权限设置' {...formItemLayou}>
                    <Input disabled value={role.name}></Input>
                </Item>

                <Tree
                    checkable
                    defaultExpandAll
                    checkedKeys={checkedKeys}
                    onCheck={this.onCheck}
                >
                    <TreeNode title='平台权限' key='all'>
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </div>
        )
    }
}
