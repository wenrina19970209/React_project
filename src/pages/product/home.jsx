import React, { Component } from 'react'
import { 
    Card ,
    Select,
    Input,
    Button,
    Icon,
    Table,
    message
} from 'antd';
import LinkButton from '../../components/link-button'
import {reProduct,reSearchProduct,reUpdateStatus} from '../../api'
import {PAGE_SIZE}  from '../../utils/constants'


/* 
商品管理主页面
*/
export default class ProductHome extends Component {

    state = {
        loading:false, //是否显示loading
        products:[] ,//当前页的商品数组
        total:0 ,  //所有商品的总个数
        searchType: 'productName', //初始搜索类型。 productName：根据名称搜索|| productDesc ：根据商品描述搜索
        searchName: '' //搜索关键字
    }

    //更新上架/下架的状态
    updateStatus = async (productId,status) =>{
        //发送更新状态请求
        const result = await reUpdateStatus(productId,status)
        if(result.status === 0){ //请求成功
            message.success('状态更新成功了！')
            //重新获取当前页面的数据
            this.getProducts(this.pageNum)
        }
    }

    
    //定义初始化列数组
    initColumns = ()=>{
        this.columns = [
            {
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render:(price)=> '￥' + price
            },
            {
                title: '状态',
                width: 100,
                render:(product)=>{

                    const {status,_id} = product

                    let btnText = status === 1 ? '下架' : '上架'
                    let text = status === 1 ? '在售' : '已下架' 
                    return (
                        <span style={{width:100}}>
                            <Button type='primary' onClick={()=> this.updateStatus(_id,status===1?2:1)}>{btnText}</Button>
                            <span>{text}</span>
                        </span>
                    )
                }
            }, 
            {
                title: '操作',
                width: 100,
                render:(product)=>{ //对应当前行的对象类型的数据
                    return (
                        <span style={{width:100}}>
                           <LinkButton onClick={()=>this.props.history.push('/product/detail',product)}>详情</LinkButton>
                           <LinkButton onClick={()=>this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
                        </span>
                    )
                }
            }, 
        ]
    }





    //获取指定页码的商品数据
    getProducts = async (pageNum) =>{
        //保存当前页码
        this.pageNum = pageNum

        //发请求之前，显示loading
        this.setState({loading:true})
        //解构赋值取到状态里的值
        let {searchType,searchName} = this.state

        let result 
        if(!searchName){ //如果searchName没有值，就是一般请求
            //一般请求
            result = await reProduct({pageNum,pageSize:PAGE_SIZE})
        }else{
            //根据名称或描述发送请求进行搜索
            result = await reSearchProduct({pageNum,pageSize:PAGE_SIZE,searchType,searchName})
        }
      
       //请求结束之后，隐藏loading
       this.setState({loading:false})

      if(result.status === 0){ //请求成功
        const {total,list} = result.data
        //更新状态
        this.setState({
            products:list,
            total 
        })
      }
    }


    componentWillMount(){
        //列数组
        this.initColumns()
    }

    componentDidMount(){
        //异步请求获取商品数组
        this.getProducts(1)

    }


    render() {
        let {loading,products,total,searchType,searchName} = this.state
        const title = (
            <span>
                <Select value={searchType}
                 style={{ width: 150 }}
                 onChange={value=>{this.setState({searchType:value}) }} //value 当前选中的值
                 >
                    <Select.Option value="productName">按名称搜索</Select.Option>
                    <Select.Option value="productDesc">按描述搜索</Select.Option>
                </Select>
                <Input placeholder='关键字'
                 style={{ width: 150 , margin: '0 15px '}}
                 value={searchName}
                 onChange={(event)=>{
                     this.setState({searchName:event.target.value
                    })}}  //获取当前输入的信息，更新到状态
                  ></Input>
                <Button type='primary' onClick={()=>this.getProducts(1)}>搜索</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick={()=>this.props.history.push('/product/addupdate') }>
                <Icon type='plus'></Icon>
                添加商品
            </Button>
        )
        return (
            <Card title={title} extra={extra}>
                <Table
                        bordered  //表格的边框线
                        rowKey="_id"    //表格行的Key的取值，每一行需要有一个唯一的Key
                        columns={this.columns}  //列
                        loading={loading}  //loading
                        dataSource={products}  //后台分页
                        pagination={{//配置对象 。
                            defaultPageSize:PAGE_SIZE,  //，每页分别显示多少条数据
                            showQuickJumper:true, //快速跳到某一页。
                            total,  // 共有几条数据

                           //onChange:(pageNum) => this.getProducts(pageNum) //将监听到的页码传给了这个函数
                            onChange: this.getProducts   //监视页码改变的监听
                        }} 
                    />
            </Card>
        )
    }
}
