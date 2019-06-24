/* 
接口请求函数

*/

// import './ajax'
import jsonp from 'jsonp'
import {message} from 'antd'
import ajax from './ajax';


const BASE = ''

//返回的是promise对象
//1. 登录
export const reLogin = (username,password) => ajax(BASE+'/login',{username,password},'POST')

//2. 添加用户
export const reAddUser = (result) => ajax(BASE+'/manage/user/add',result,'POST')


// 获取一级或二级的分类列表
export const reCategorys = (parentId) => ajax(BASE + '/manage/category/list',{parentId})


//更新分类名称
export const reUpdateCategory = ({categoryId,categoryName}) => ajax(BASE + '/manage/category/update' ,{categoryId,categoryName},'POST')


//添加分类名称
export const reAddCategory = (parentId,categoryName) => ajax(BASE + '/manage/category/add' ,{parentId,categoryName},'POST')

// 获取商品分页列表
export const reProduct = ({pageNum,pageSize}) => ajax(BASE + '/manage/product/list' ,{pageNum,pageSize})

//根据名称/描述搜索产品分页列表
export const reSearchProduct = ({
    pageNum, //页码
    pageSize, // 每页显示数据个数
    searchType, // 值只能是 productName：根据商品名称搜索 || productDesc ：根据商品描述搜索
    searchName //搜索的关键字
}) => ajax(BASE + '/manage/product/search',{
    pageNum,
    pageSize,
    [searchType]:searchName
})


// 对商品进行上架/下架处理
export const reUpdateStatus = (productId,status) => ajax(BASE +'/manage/product/updateStatus',{productId,status},'POST')

//根据分类ID获取分类
export const reIdCategory = (categoryId) => ajax(BASE + '/manage/category/info',{categoryId})


//删除图片

export const reDeleteImg = (name) => ajax(BASE + '/manage/img/delete' ,{name},'POST')

//添加/更新商品
export const reAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/'+ (product._id?'update' : 'add') ,product,'POST')


// 添加角色
export const reAddRole = (roleName) => ajax(BASE + '/manage/role/add',{roleName},'POST')

//获取角色列表
export const reRoles = () => ajax(BASE + '/manage/role/list')

//更新角色（给角色设置权限）
export const reUpdateRoles = (role) => ajax('/manage/role/update',role,'POST')


/* 
//测试代码
reLogin('admin','admin').then(
    result => {console.log('result',result)}
    )
 */
//使用jsonp发送请求天气信息
export const reWeather = (location) =>{
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${location}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
   
    return new Promise((resolve,reject)=>{

        setTimeout(() => {

            jsonp(url, {}, (error,data)=>{

                if(!error && data.status === 'success'){
                    const {
                        dayPictureUrl
                        ,weather
                    } = data.results[0].weather_data[0]
                    resolve({
                        dayPictureUrl,
                        weather
                    })
                //请求成功调用resolve（）
                }else{
                    message.error('未能获取到天气！')
                }
    
            })
        },1000)
   })
    
}

    