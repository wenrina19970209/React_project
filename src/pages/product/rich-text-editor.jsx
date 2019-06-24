import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { EditorState,convertToRaw,ContentState} from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component {
    static propTypes = {
        detail: PropTypes.string
      }

    state = {
        //创建了一个空的不包含任何内容的编辑器对象
        editorState: EditorState.createEmpty(),
    }

    constructor(props){
        super(props)

        const {detail} =this.props

        if(detail){ //如果有值，创建一个带数据的editorState
            const contentBlock = htmlToDraft(detail)
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
            const editorState = EditorState.createWithContent(contentState)
            this.state = {
                editorState
            }   

        }else{ //没有传入已有的detail,创建空的对象
            this.state = {
                editorState: EditorState.createEmpty(),
            }
        }

        
    }



    //父组件调用
    getDetail = () =>{
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    onEditorStateChange = (editorState) => {
        this.setState({
        editorState,
        });
    };

  
uploadImageCallBack = (file)=> { //file是选中的那张图片
    return new Promise(
      (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '/manage/img/upload');
        const data = new FormData();
        data.append('image', file);
        xhr.send(data);
        xhr.addEventListener('load', () => {//成功返回的时候执行回调
          const response = JSON.parse(xhr.responseText); //会得到响应对象
          resolve({ data:{ link:response.data.url } });  
        });
        xhr.addEventListener('error', () => {//失败返回的时候执行回调
          const error = JSON.parse(xhr.responseText);
          reject(error);
        });
      }
    );
  }

  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          editorStyle={{border:'1px solid black',height:200,paddingLeft:10}}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
          }}
        />
      </div>
    );
  }
}