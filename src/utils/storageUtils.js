import store from 'store'

/* 
保存数据
*/
export function saveUser(user){
    // localStorage.setItem('USER-KEY',JSON.stringify(user)) 
    store.set('USER-KEY',user)
}

/* 
读取数据
*/
export function getUser(){
    // return JSON.parse(localStorage.getItem('USER-KEY') || '{}')
   return  store.get('USER-KEY') || {}
}


//删除数据

export function removeUser(){
    store.remove('user')
} 