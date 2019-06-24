import React, { Component } from 'react'
import { Form, Input, Button,Card ,Icon ,Cascader,message} from 'antd';
import LinkButton from '../../components/link-button'
import {reCategorys,reAddOrUpdateProduct} from '../../api'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const Item = Form.Item
const {TextArea} = Input


 class ProductAddUpdate extends Component {

    state = {
        options:[], 
      };
 
    constructor(props){
        super(props)
        //创建一个ref容器
        this.pwRef = React.createRef(); //上传图片文件的ref容器
        this.editorRef = React.createRef(); //编辑器的ref容器
    }


    submit = () =>{
        this.props.form.validateFields(async(err, values) => {
            if (!err) {
                //1.得到输入的数据，并且存到product中
                const {name,desc,price,categorysIds} = values
                let categoryId , pCategoryId

                if(categorysIds.length <= 1){
                    pCategoryId = '0'
                    categoryId =  categorysIds[0]
                }else{
                    pCategoryId = categorysIds[0]
                    categoryId =  categorysIds[1]
                }

                //通过ref容器读取所有上传图片的文件名数组
                const imgs = this.pwRef.current.getImgs()
                //读取富文本内容（html格式字符串）
                const detail = this.editorRef.current.getDetail()
                console.log('验证通过: ',values,imgs,detail);


                const product = {
                    name,
                    desc,
                    price,
                    categoryId,
                    pCategoryId,
                    imgs,
                    detail
                }
                //如果是更新需指定id
                if(this.isUpdate){
                    product._id = this.product._id
                }

                //2.发送更新请求
                const result = await reAddOrUpdateProduct(product)

                //3.根据结果进行响应
                if(result.status === 0){
                    message.success((this.isUpdate ? '更新' : '添加' )+'商品成功！')
                    this.props.history.goBack()
                }
            }
          })
    }
  
    // 价格输入验证
    validatePrice = (rule, value, callback) =>{
        // console.log('validatePrice:',value, callback)
        if(value < 0){
            callback('商品价格不能小于0')
        }else{ 
            callback()
        }
    }
    

    //请求获取对应的二级列表
     loadData =async selectedOptions => {
        //得到选中的一级项数据
        const targetOption = selectedOptions[0];  // { value  label isLeaf }
        //显示loading
        targetOption.loading = true;
    
        //异步获取下一项数据

        let subCategorys = await this.getCategorys(targetOption.value)
         //隐藏loading
         targetOption.loading = false;

        if(!subCategorys || subCategorys.length === 0){ //如果没有二级分类
            targetOption.isLeaf = true
        }else{
         //给option对象添加一个children属性，而这个children会自动显示为二级列表
            targetOption.children = subCategorys.map(c => ({
                label:c.name,
                value:c._id,
                isLeaf:true
            }))
        }

        this.setState({
            options: [...this.state.options],
          });

       /*  setTimeout(() => {
            //隐藏loading
          targetOption.loading = false;
          //给option对象添加一个children属性，而这个children会自动显示为二级列表
          targetOption.children = [
            {
              label: `${targetOption.label} Dynamic 1`,
              value: 'dynamic1',
            },
            {
              label: `${targetOption.label} Dynamic 2`,
              value: 'dynamic2',
            },
          ];
          //更新options列表数据
          this.setState({
            options: [...this.state.options],
          });
        }, 1000); */
    }



    /* 
    根据分类数组更新options数组
    */
    initOptions =async (categorys) =>{

        //options : { label  value isLeaf }
        const options = categorys.map(c => ({
            label:c.name,
            value:c._id,
            isLeaf:false
        }))

        //如果当前是二级分类，需要重新获取当前的二级列表
        const {product,isUpdate} = this
        if(isUpdate && product.pCategoryId !== '0'){
          const subCategorys = await this.getCategorys(product.pCategoryId)
          if(subCategorys && subCategorys.length > 0){

              const targetOption = options.find(option => option.value === product.pCategoryId)
                //给options添加chidren
              targetOption.children =subCategorys.map(c => ({
                label:c.name,
                value:c._id,
                isLeaf:true
            }))

          }

        }

        options.children = []
        //更新状态
        this.setState({
            options
        })
    }

    /* 
    获取一级/二级分类
    */
    getCategorys = async (parentId) =>{

        const result = await reCategorys(parentId)

        if(result.status === 0){//请求成功
            const categorys = result.data
            if(parentId === '0'){ //获取一级分类列表
                this.initOptions(categorys)
            }else{
                return categorys
            }

        }

    }

    componentWillMount(){
        //保存传过来的商品数据
        this.product = this.props.location.state || {}
        this.isUpdate = !!this.product._id
    }

    componentDidMount(){
        //发送请求数据
        this.getCategorys('0')         
    }

    render() {
            //获取到product中的数据
            const {product,isUpdate} = this
            if(product._id){ //修改
                if(product.pCategoryId === '0'){
                    product.categorysIds = [product.categoryId]
                }else{
                    product.categorysIds = [product.pCategoryId,product.categoryId]
                }
            }else{ //添加
                product.categorysIds = []
            }
           

            
            const {getFieldDecorator} = this.props.form

            // 指定form的item布局的对象
            const formLayout = {
                    labelCol: { span: 2 },
                    wrapperCol: { span: 8 },
                }


            const title = (
                <span>
                    <LinkButton onClick={()=>this.props.history.goBack('/product')}>
                    <Icon type="arrow-left" style={{ fontSize: 20 }} />
                    </LinkButton>
                    &nbsp;&nbsp;{isUpdate ? '更新商品' : '添加商品'}
                </span>
                )

        return (
            
        <Card title={title}>
            <Form {...formLayout}>
                <Item label="商品名称">
                    {
                    getFieldDecorator('name', {
                        initialValue: product.name,
                        rules: [
                        { required: true, message: '商品名称必须输入' }
                        ]
                    })(
                        <Input placeholder='请输入商品名称' />
                    )
                    }
                </Item>
                <Item label="商品描述">
                    {
                    getFieldDecorator('desc', {
                        initialValue: product.desc,
                        rules: [
                        { required: true, message: '商品描述必须输入' }
                        ]
                    })(
                        <TextArea placeholder="请输入商品描述" autosize />
                    )
                    }
                </Item>
                <Item label="商品价格">
                    {
                        getFieldDecorator('price', {
                            initialValue: product.price,
                            rules: [
                            { required: true, message: '商品价格必须输入' },
                            { validator:this.validatePrice }  //自定义验证
                            ]
                        })(
                            <Input type='number' placeholder='请输入商品价格' addonAfter="元"/>
                        )
                    }
                </Item>
                <Item label="商品分类">
                   {
                        getFieldDecorator('categorysIds', {
                            initialValue: product.categorysIds,
                            rules: [
                            { required: true, message: '商品分类必须指定' },
                            ]
                        })(
                            <Cascader
                                options={this.state.options}
                                loadData={this.loadData}
                            />
                        )
                    }
                    
                </Item>
                <Item label="商品图片">
                    {/* 将ref空容器交给组件标签 ,如果ref标识的是组件标签，他就存储的是组件对象。如果是一般标签，存放的就是DOM标签*/}
                    <PicturesWall ref={this.pwRef} imgs={product.imgs}/>  
                    {/* 如果是添加product.imgs就是undefined,如果是修改product.imgs中就有值*/}
                </Item>
                <Item
                    label="商品详情"
                    wrapperCol={{ span: 18 }}
                >
                    <RichTextEditor ref={this.editorRef} detail={product.detail}/>
                </Item>
                <Button type='primary' onClick={this.submit}>提交</Button>
            </Form>
      </Card>
        )
    }
}
export default Form.create()(ProductAddUpdate)
