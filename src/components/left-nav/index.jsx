import React, { Component } from 'react'
import {Link,withRouter} from 'react-router-dom' 
import logo from '../../assets/image/logo.png'
import './index.less'
import { Menu, Icon } from 'antd';
import menuList from '../../config/menuConfig'

const { SubMenu ,Item }  = Menu;





/* 
admin界面的左侧导航
*/
class LeftNav extends Component {

    getMenusNode = (menuList)=>{
       return menuList.map(item =>{

            if(!item.children){
                 //返回<Item></Item>
               return (
                <Item key={item.key}>
                    <Link to={item.key}>
                        <Icon type={item.icon} />
                        <span>{item.title}</span>       
                    </Link>
                </Item>
               )

            }else{
                //返回<SubMenu></SubMenu>
                return (
                <SubMenu
                    key={item.key}
                    title={
                    <span>
                        <Icon type={item.icon} />
                        <span>{item.title}</span>
                    </span>
                    }
                >
                    {
                        this.getMenusNode(item.children)
                    }
                </SubMenu>
                )
            }

        })
       

        
    }
 
    
 /* 
    使用了array.reduce() + 递归调用
 */
    getMenusNode2 = (menuList) =>{

    const path =this.props.location.pathname
      return  menuList.reduce((pre,item)=>{
        if(!item.children){
            pre.push(
                <Item key={item.key}>
                    <Link to={item.key}>
                        <Icon type={item.icon} />
                        <span>{item.title}</span>       
                    </Link>
                </Item>
            )
        }else{
            //如果请求的是当前item.children中的某一个item对应path,那么当前的item的key就是openKey
           const cItem=  item.children.find((cItem,index)=> cItem.key === path)
            if(cItem){
                this.openKey = item.key
            }
            pre.push(
                <SubMenu
                key={item.key}
                title={
                <span>
                    <Icon type={item.icon} />
                    <span>{item.title}</span>
                </span>
                }
            >
                {
                    this.getMenusNode(item.children)
                }
            </SubMenu>
            )
        }
        return pre
      },[])
    }


    render() {
       
        let menusNodes = this.getMenusNode2(menuList)
        let electedKey = this.props.location.pathname

        const openKey =this.openKey
        return (
            <div className='left-nav'>
                <Link to='/home' className='left-nav-header'>
                    <img src={logo} alt="logo"/>
                    <h1>后台管理</h1>
                </Link>


                <Menu
                mode="inline"
                theme="dark"
                selectedKeys={[electedKey]}
                defaultOpenKeys={[openKey]}
                >
                    
                    {
                         menusNodes
                    }

                    
                {/* <Item key="/home">
                    <Link to='/home'>
                        <Icon type="home" />
                        <span>首页</span>       
                    </Link>
                </Item>
                <SubMenu
                    key="/products"
                    title={
                    <span>
                        <Icon type="appstore" />
                        <span>商品</span>
                    </span>
                    }
                >
                    <Item key="/category">
                        <Link to='/category'>
                            <Icon type='bars' />
                            <span>分类管理</span>       
                        </Link>
                    </Item>
                    <Item key="/product">
                        <Link to='/product'>
                            <Icon type="tool" />
                            <span>商品管理</span>       
                        </Link>
                    </Item>
                </SubMenu> */}

                </Menu>
            </div>
        )
    }
}


/* 
向外暴露的是通过withRouter包装的LeftNav产生的新的组件，
新组件会向非路由组件传递三个属性：history/location/match
*/
export default withRouter(LeftNav)
