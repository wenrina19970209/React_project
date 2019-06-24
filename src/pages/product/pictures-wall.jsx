import React from 'react'
import { Upload, Icon, Modal, message } from 'antd';
import { reDeleteImg } from '../../api'
import PropTypes from 'prop-types'
import {BASE_IMG_URL} from '../../utils/constants'

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}


/* 
动态上传图片组件
*/
export default class PicturesWall extends React.Component {

  static propTypes = {
    imgs: PropTypes.array
  }

  state = {
    previewVisible: false, //是否显示大图
    previewImage: '',  //大图的地址
    fileList: [  //所有已长传图片信息对象的数组
    //   {
    //     /* 每一个图片的唯一ID值 */
    //     uid: '-1',
    //     /* 图片的名字 */
    //     name: 'xxx.png',
    //     /* 上传状态：uploading:上传中   done：已上传   error：上传失败   removed：已删除 */
    //     status: 'done',
    //     /* 图片的地址 */
    //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    //   },
    ],
  };

  //如果imgs有值就是修改，如果没有值就是添加
  //初始化更新fileList状态
  componentWillMount(){
    //如果传入imgs,更新fileList 为imgs对应的值
    //先获取imgs
    const {imgs} = this.props
    if(imgs && imgs.length>0){
      const fileList = imgs.map((img,index)=>({
        uid:-index+'',
        name:img,
        url:BASE_IMG_URL + img,
        status:'done'
      }))
      this.setState({
        fileList
      })
    }


  }

  /* 返回所有已上传的图片的文件名 */
  getImgs = ()=>{
    return this.state.fileList.map(img => img.name )
  }

  //关闭大图预览
  handleCancel = () => this.setState({ previewVisible: false });

  /* 
  打开大图预览
  */
  handlePreview = async file => {
    if (!file.url && !file.preview) {
        //图片要进行Base64的一个处理
        file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  /* 
  文件对象发生改变时回调函数
  */
  handleChange =async ({ file, fileList }) => {
      // console.log('handleChange',fileList,file)
    if(file.status === 'done'){ //图片文件上传成功
        //得到图片名称/URL
        const result = file.response
        if(result.status === 0){
            const name  =  result.data.name
            const url  =  result.data.url
            //不能直接更新file,只能更新fileList最后一个中的file
            fileList[fileList.length-1].name = name
            fileList[fileList.length-1].url = url
        }else{
          message.error('上传图片失败！')
        }

      }else if(file.status === 'removed'){ //删除图片成功
        //发送删除请求
        const result = await reDeleteImg(file.name)
        if(result.status === 0){
            message.success('删除图片成功！')
        }else{
            message.error('删除图片失败！')
        }
     
    }
       //更新到状态
       this.setState({fileList})
    
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div>
        <Upload
            action="/manage/img/upload" //指定上传图片的地址
            listType="picture-card"   //上传图片列表的样式   picture-card | picture | text
            fileList={fileList}  //已上传的文件列表 
            name='image' //请求参数为image
            onPreview={this.handlePreview} //预览
            onChange={this.handleChange}  //它的状态发送改变的一个回调
            >
            {/* 上传图片文件最大限制：3 */}
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        {/* 对话框：visible 来控制是否显示 ，footer: 去掉底部内容 */}
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
