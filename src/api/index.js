/* 
接口请求函数

*/

// import './ajax'
import ajax from './ajax';

const BASE = ''

//返回的是promise对象
//1. 登录
export const reLogin = (username,password) => ajax(BASE+'/login',{username,password},'POST')

//2. 添加用户
export const reAddUser = (result) => ajax(BASE+'/manage/user/add',result,'POST')


reLogin('admin','admin').then(
    result => {console.log('result',result)}
    )