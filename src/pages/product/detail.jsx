import React, { Component } from 'react'
import { List, Icon, Card } from 'antd'
import LinkButton from '../../components/link-button'
import {BASE_IMG_URL} from '../../utils/constants'
import {reIdCategory} from '../../api'

/* 
详情界面
*/
export default class ProductDetail extends Component {
    state ={
        cName1:'', //一级分类名称
        cName2:''  //二级分类名称
    }

    //发送异步请求
   async componentDidMount(){
        //获取一级分类ID和二级分类ID
        const { pCategoryId , categoryId } = this.props.location.state
        
        if(pCategoryId === '0'){ //如果等于0就是一级分类
            //发送获取一级分类请求
            const result = await reIdCategory(categoryId)
            //获取到一级分类名称
            const cName1 = result.data.name
            //更新到状态
            this.setState({
                cName1
            })
        }else{//二级分类
            //一次发送多个请求。Promsie.all() 只有请求都成功了，整体才会成功
            const results = await Promise.all([reIdCategory(pCategoryId),reIdCategory(categoryId)])
            //获取分类名称
            const cName1 = results[0].data.name
            const cName2 = results[1].data.name

            //更新到状态
            this.setState({
                cName1,
                cName2
            })
           
        }
    }

    render() {
        let {cName1,cName2} = this.state
        let {name,desc,price,imgs,detail} =this.props.location.state
        const title = (
            <span>
              <LinkButton onClick={()=>this.props.history.goBack('/product')}>
                <Icon type="arrow-left" style={{ fontSize: 20 }} />
              </LinkButton>
              &nbsp;&nbsp;商品详情
            </span>
          )
        return (
            <Card title={title} className='productDetail'>
            <List>
              <List.Item>
                <span className='detail-let'>商品名称:</span>
                <span>{name}</span>
              </List.Item>
              <List.Item>
                <span className='detail-let'>商品描述:</span>
                <span>{desc}</span>
              </List.Item>
              <List.Item>
                <span className='detail-let'>商品价格:</span>
                <span>{price}元</span>
              </List.Item>
              <List.Item>
                <span className='detail-let'>所属分类:</span>
                <span>{cName1} {cName2? '-->'+ cName2 : ''}</span>
              </List.Item>
              <List.Item>
                <span className='detail-let'>商品图片:</span>
                <span>
                  {
                      imgs.map(img => <img key={img} src={BASE_IMG_URL + img} alt='img'  className='image'></img> )
                  }
                </span>
              </List.Item>
    
              <List.Item>
                <span className='detail-let'>商品详情:</span>
                <div dangerouslySetInnerHTML={{__html:detail}}></div>
              </List.Item>
            </List>
          </Card>
        )
    }
}
