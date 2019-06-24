import React, { Component } from 'react'
import propTypes from 'prop-types'
import {Form,Input,Select } from 'antd'


 class AddForm extends Component {

    static propTypes = {
        setForm: propTypes.func.isRequired,
        categorys: propTypes.array.isRequired,
        parentId: propTypes.string.isRequired
    }


    /* 向父组件传递form,保存category */
    componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
        let {categorys,parentId} = this.props
        let {getFieldDecorator} = this.props.form
        return (
            <Form>
                <Form.Item>
                    {
                        getFieldDecorator('parentId',{
                            initialValue:parentId,
                            rules:[
                                {required:true , message:'必须填入分类名称！'}
                            ]
                        })(
                            <Select>
                                <Select.Option value="0">一级分类</Select.Option>
                                {
                                    categorys.map((c,index)=>{
                                        return <Select.Option key={index} value={c._id}>{c.name}</Select.Option>
                                    })
                                }
                               
                            </Select>
                        )
                    }
                    
                </Form.Item>
                <Form.Item>
                    {
                        getFieldDecorator('categoryName',{
                            initialValue:'',
                            rules:[
                                {required:true , message:'必须填入分类名称！'}
                            ]
                        })(
                            <Input placeholder='请输入分类名称！'></Input>
                        )
                    }
                    
                </Form.Item>
            </Form>
        )
    }
}

export default Form.create()(AddForm)
