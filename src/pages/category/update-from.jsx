import React, { Component } from 'react'
import propTypes from 'prop-types'
import {Form,Input} from 'antd'


 class UpdateFrom extends Component {

    static propTypes = {
        categoryName : propTypes.string.isRequired,
        setForm: propTypes.func.isRequired
    }


    /* 向父组件传递form,保存category */
    componentWillMount(){
        this.props.setForm(this.props.form)
    }

    render() {
        let {getFieldDecorator} = this.props.form
        return (
            <Form>
                <Form.Item>
                    {
                        getFieldDecorator('categoryName',{
                            initialValue:this.props.categoryName,
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

export default Form.create()(UpdateFrom)
