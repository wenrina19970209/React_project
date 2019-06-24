import React, { Component } from 'react'
import {Card, Button,Icon,Table,Modal,message} from 'antd'
import {reCategorys,reUpdateCategory,reAddCategory} from '../../api'
import LinkButton from '../../components/link-button'
import UpdateForm from './update-from'
import AddForm from './add-form'


 
export default class Category extends Component {

    state = {
        parentId:'0', //当前分类列表的id
        parentName:'', //当前分类列表的父级名称
        categorys : [], //一级分类数组
        subCategorys:[], //二级分类数组
        loading:false,   //是否显示loading
        showStatus: 0  //0：都不显示 ， 1：修改界面  2：添加界面
    }


    //请求分类的数据
    //pId: 可传可不传，如果有值就用pId,如果没有值就用this.state.parentId
    getCategorys = async (pId) =>{
        //发请求之前 ，显示loading
        this.setState({
            loading:true
        })
        let parentId = pId || this.state.parentId
        let result = await reCategorys(parentId)

        //请求结束后 ，隐藏loading
        this.setState({
            loading:false
        })

        if(result.status === 0){
            //categorys有可能是一级分类数据，也有可能是二级分类数据
            const categorys = result.data
            if(parentId === '0'){//一级分类数据
                this.setState({
                    categorys
                })
            }else{
                this.setState({
                    subCategorys:categorys
                })
            }
            
        }
    }

    /* 显示当前一级分类下的子分类列表 */
    showSubCategorys = (category) =>{
        
    /* 
    setState()是异步更新的状态数据, 在setState()的后面直接读取状态数据是旧的数据
    利用setState({}, callback): callback在状态数据更新且界面更新后执行
    */

        //更新parentId为当前的子级的id
        this.setState({
            parentId:category._id,
            parentName:category.name
        },()=>{
            //发送分类数据的请求，获取对应的数据
            this.getCategorys()
        })
    }
    



    /* 初始化指定表格列数组 */
    initColumns = () =>{

        this.columns = [
            {
            title: '分类名称',
            dataIndex: 'name',
            },
            {
            title: '操作',
            width:300,
            render:(category)=>{  //参数：当前行的数据 ,如果没有指定dataIndex属性，他会把整个category全部数据传进来
                return (
                    <span>
                    <LinkButton onClick={()=>this.showUpdate(category)}>修改分类</LinkButton>
                    {
                        this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null
                    }
                    
                    </span>
                )
            }
            },
        ];
    }


    
    /* 显示更新界面 */
    showUpdate = category=>{
        //保存category
        this.category = category
        //更新显示界面的状态
        this.setState({
            showStatus:1
        })
    }



    /* 
    更新分类（OK按钮）
    */
   updateCategory = ()=>{
        //进行表单验证
       this.form.validateFields(async (err,value)=>{
            if(!err){ //通过继续
                //隐藏修改界面
                this.setState({
                    showStatus:0
                })

                //获取分类的名称
                const categoryName = this.form.getFieldValue('categoryName')
                //重置输入数据
                this.form.resetFields()
                //获取分类的_id
                const categoryId = this.category._id

                console.log('发更新请求'+categoryName,categoryId)
                //发送请求，返回数据
               const result = await reUpdateCategory({categoryId,categoryName})

               if(result.status === 0){//请求成功
                    //提示更新成功
                    message.success('分类更新成功！')
                    //重新请求分类数据
                    this.getCategorys()
               }
            }
       })
   
   }



   /* 
   添加分类（OK按钮）
   */
  addCategory=()=>{

    //进行表单验证
    this.form.validateFields(async (err,value)=>{
        if(!err){ //通过继续
            //隐藏修改界面
            this.setState({
                showStatus:0
            })

            //获取分类的名称
            const {categoryName,parentId} = this.form.getFieldsValue()

            //重置输入数据
            this.form.resetFields()
          
           //发送添加分类请求
           const result = await reAddCategory(parentId,categoryName)

           this.parentId = result.parentId

           if(result.status === 0){//请求成功
                //提示更新成功
                message.success('分类添加成功！')
                // 重新获取一级分类
                if(parentId==='0'){
                    //重新请求一级分类数据
                    this.getCategorys('0')
                // 重新获取二级分类
                }else if(parentId === this.state.parentId){ 
                    this.getCategorys()
                }
                
           }
        }
   })
    

    
  }



    /* 给子分类列表的【一级列表菜单】添加点击监听 ,回退到一级分类 */
    showCategorys=()=>{
        this.setState({
            parentId:'0',
            parentName:'',
            subCategorys:[]
        })
    }




    componentWillMount(){
        //初始化指定表格列的数组
        this.initColumns()
  
    }

    componentDidMount(){
        //发送一级分类的请求
        this.getCategorys()
    }

    render() {
         //读取状态中的数据
         let {categorys,subCategorys,parentId,loading,parentName,showStatus} =this.state

        //定义左侧title内容
        //判断如果parentId等于0就是父级的title,否则是子级列表的title
        const title = parentId === '0' ? '一级列表菜单' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级列表菜单</LinkButton>
                <Icon type="arrow-right"></Icon>&nbsp;&nbsp;
                {parentName}
            </span>
        )
        //定义右侧extra内容
        const extra = (
            <Button type='primary' onClick={()=> this.setState({showStatus:2}) }>
                <Icon type='plus'></Icon>
                添加
            </Button>
        )

        //读取当前分类名称
        const category = this.category || {}

        return (
           

             <Card title={title} extra={extra} >
                 <Table
                        bordered  //表格的边框线
                        rowKey="_id"    //表格行的Key的取值，每一行需要有一个唯一的Key
                        columns={this.columns}  //列
                        loading={loading}  //loading
                        dataSource={parentId==='0' ? categorys : subCategorys}  // 每一行
                        pagination={{defaultPageSize:5,showQuickJumper:true}} //配置对象 ，每页分别显示多少条数据、快速跳到某一页
                    />
                 <Modal
                    title="更新分类"
                    visible={showStatus===1}  //是否显示对话框
                    onOk={this.updateCategory}   //确定按钮
                    onCancel={()=>{
                        this.form.resetFields()
                        this.setState({showStatus:0})  //将修改界面状态设为：0都隐藏
                    }}  //取消按钮
                    >     

                       <UpdateForm categoryName={category.name} setForm={form => this.form = form }/> {/* 将子组件的form传递给父组件 */}
                </Modal>
                <Modal
                    title="添加分类"
                    visible={showStatus===2}  //是否显示对话框
                    onOk={this.addCategory}   //确定按钮
                    onCancel={()=>{
                        this.form.resetFields()
                        this.setState({showStatus:0})  //将修改界面状态设为：0都隐藏
                    }}  //取消按钮
                    >     
                        
                       <AddForm setForm={form => this.form = form } parentId={parentId} categorys={categorys} /> {/* 将子组件的form传递给父组件 */}
                </Modal>


            </Card>
        )
    }
}
