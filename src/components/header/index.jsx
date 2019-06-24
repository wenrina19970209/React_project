import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import './index.less'
import  LinkButton from '../link-button'
import {reWeather} from '../../api'
import {removeUser} from '../../utils/storageUtils'
import { Modal } from 'antd';
import memoryUtils from '../../utils/memoryUtils'
import {formateDate} from '../../utils/dateUtils'
import menuList from '../../config/menuConfig'




const confirm = Modal.confirm;
/* 
admin界面的头部
*/
 class Header extends Component {

  static propTypes = {//给Header（类对象添加属性）

  }

  //初始化状态
  state = {
    currentTime: formateDate(Date.now()), //初始化时间字符串
    dayPictureUrl:'', //初始化图片url
    weather:'', //初始化天气
  }

    //退出到登录界面
    loginOut = () =>{
        
        confirm({
            title: '确定要退出吗?',
            onOk: () => {
              console.log('Ok');
              //清空local中的用户数据
              removeUser()
              //清空内存中的数据
              memoryUtils.user = {}
              //跳转到login页面
              this.props.history.replace('/login')
            },
            onCancel() {
              console.log('取消');
            },
          });
    }

    //获取当前点击列表得到的title
    getTitle = ()=>{
      
      const path = this.props.location.pathname;
      let title = '';

      menuList.forEach(item =>{
        if(item.key === path){
          title = item.title
        }else if(item.children){
         const cItem = item.children.find( item => path.indexOf(item.key) === 0)
         if(cItem){
           title = cItem.title
         }
        }
        
      }) 
      return title
    }


    //每隔1秒更新时间
    showCurrentTime = () =>{
      this.IntervalId=setInterval(()=>{
        //更新当前时间
        const currentTime = formateDate(Date.now())

        //更新到状态
        this.setState({currentTime})

      })
    }

    //请求天气信息
    showWeather = async ()=>{
      //请求回来天气数据
      let {dayPictureUrl,weather}  = await reWeather('北京')

      //更新状态
      this.setState({
        dayPictureUrl,
        weather
      })
    }
    

    /* 
    组件在即将销毁之间做一个收尾的工作：清除定时器
    */
    componentWillUnmount(){
       //清除定时器
       clearInterval(this.IntervalId)
    }

    componentDidMount(){
      //每隔1秒更新时间
      this.showCurrentTime()
      //请求当前天气信息
      this.showWeather()
     
    }

    render() {
        const {currentTime,dayPictureUrl,weather} = this.state
        //获取到当前用户的名称
        const {user} = memoryUtils
        //获取到当前点击列表的title
        const title = this.getTitle()
        //


        return (
            <div className='header'>
               <div className='header-top'>
                    <span>欢迎，{user.username}</span>
                    <LinkButton onClick={this.loginOut}>退出</LinkButton>
               </div>
               <div className='header-Bottom'>
                    <div className='header-Bottom-left'>{title}</div>
                    <div className='header-Bottom-right'>
                        <span>{currentTime}</span>
                        {!! dayPictureUrl && <img src={dayPictureUrl} alt="weather" />}
                        <span>{weather}</span>
                    </div>
               </div>
            </div>
        )
    }
}


export default withRouter(Header)