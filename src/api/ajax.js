/* 
通用返回任何ajax请求函数
封装ajax请求
返回一个promise对象
*/
//引入axios库
import axios from 'axios'


export default function ajax (url,data={},method='GET'){

    return new Promise((resolve,reject)=>{
        let promise
        //get请求
        if(method === 'GET'){
            promise = axios.get(url,{
                params:data
            })
        }else{//post请求
            promise = axios.post(url,data)
        }
        //指定promise成功/失败的回调
        promise.then(
            response =>{
                //结果是成功了，就调用resolve(),传入参数
                resolve(response.data)
            },
            error =>{
                //结果是失败，不能调用reject(),直接传一个错误提示
                alert('错误提示：'+error.message)
            }
        )
        
    })
}