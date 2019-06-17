/* 
入口文件
*/
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './api'
import  {getUser} from './utils/storageUtils'
import memoryUtils from "./utils/memoryUtils";


// 读取localStorage中保存user, 缓存到内存中
let user = getUser()
memoryUtils.user = user

ReactDOM.render(<App/>,document.getElementById('root'))
