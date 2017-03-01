<template>
    <div class="ms-upload">
        <!-- 给嵌套在里面的组件使用的插槽 -->
        <!-- 组件内部通讯很麻烦啊,  以后有更好的方式再替换, 现在由子组件将数据传到父组件, 父组件进行显示 -->
        <slot></slot>
<!--        <div class="audio-box" v-if="type=='video'" v-show="currentObjs.length>0">
            <div class="show-video" v-for="item in currentObjs">
                <video controls="controls" :src=item v-bind="{'height': uploadConfig.height}"></video>
            </div>
        </div>
        <div class="audio-box" v-if="type=='audio'" v-show="currentObjs.length>0">
            <div class="show-audio" v-for="item in currentObjs">
                <audio class="j_audio" controls loop="loop" preload :src=item v-bind="{'height': uploadConfig.height}"></audio>
            </div>
        </div>
        <div class="img-box" v-if="type=='image'" v-show="currentObjs.length>0">
            <div class="show-img" v-for="img in currentObjs" v-show="currentObjs.length>0">
                <a v-bind:href="img" target="_blank">
                    <img :src=img v-bind="{'height': uploadConfig.height}" alt="">
                </a>
            </div>
        </div>-->
    </div>
</template>
<style lang="scss">
    .ms-upload{
      .img-box{
        padding: 15px 0;
        img{
          vertical-align: top;
          margin-right: 10px;
          border: 1px solid #e5e5e5;
        }
      }
      .audio-box{
        padding: 15px 0;
      }
    }
</style>
<script>
require("./jquery-upload/jquery.ui.widget.js");
require("./jquery-upload/jquery.iframe-transport.js");
require("./jquery-upload/jquery.fileupload.js");
require("./jquery-upload/jquery.fileupload-process.js");
require("./jquery-upload/jquery.fileupload-validate.js");

    import base from 'commonjs/base';

    export default {
        props: {
            config: {
                type: Object,
                default: function() {
                    return {};
                }
            }
        },
        data: function() {
            return base.assignObj({
                options : {
                    dropZone: undefined,
                    maxFileSize: 2000000,
                    acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i,
                    maxFiles: 1,    // 最大数量
                    dataType: 'json',
                    autoUpload: true,
                    formData:function (form) {
                        return []
                    },
                    url: '/api/upload/uploadImage.do'
                },
                myOptions:{},
                uploadParams:{},
                //等待以后有更好的解决方法
                type:'image',   // 类型，image/audio
                uploadConfig:{
                    isMultiple:false,   // 是否多张
                    height:100,
                    onUpload:$.noop,
                },
                //等待以后有更好的解决方法
                currentObjs: []
            }, this.config);
        },
        computed: {
        },
        mounted: function() {
            var self = this,
                $this = $(this.$el),
                $input = $this.find('input');

            var options = $.extend({},this.options,this.myOptions,{
                dropZone: false
            });
            $input.fileupload(options)
                .on('fileuploadchange', function (e, data) {
                    if(!self.uploadConfig.isMultiple) return;

                    var currentLength = self.currentObjs.length;
                    if (data.files.length + currentLength > options.maxFiles) {
                        alert('最多只能上传 ' + options.maxFiles + ' 张图片，请先删除');
                        return false;
                    }
                })
                .on('fileuploadprocessalways', function (e, data) {
                    var file = data.files[data.index];
                    if (file.error) {
                        alert(file.error);
                    }
                })
                .on('fileuploaddone', function (e, data) {
                    // 上传完成 更新数据
                    if(data.result.errCode === 0){
                        var imgSrc = data.result.obj;
                        if(!self.uploadConfig.isMultiple) {
                            self.currentObjs = [imgSrc];
                        }else{
                            self.currentObjs.push(imgSrc);
                        }
                        self.uploadConfig.onUpload(self.currentObjs, $input, self.uploadParams);
                    }
                })
                .on('fileuploadfail', function (e, data) {
                    // 上传失败
                    alert("上传失败，请重试");
                })
                .prop('disabled', !$.support.fileInput)
                .parent().addClass($.support.fileInput ? undefined : 'disabled');
        },
        created: function() {
            console.log('created');
        }
    }
</script>