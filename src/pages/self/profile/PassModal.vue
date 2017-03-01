<template>
    <form class="modal fade form-horizontal" id="j_passForm" tabindex="-1" role="basic" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                    <h4 class="modal-title">修改密码</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="col-md-3 control-label">旧密码：</label>
                        <div class="col-md-6">
                            <input v-model="passObj.oldPwd" id="oldPwd" autocomplete="off" name="oldPwd" type="password" class="form-control" value="" placeholder="请输入旧密码" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label">新密码：</label>
                        <div class="col-md-6">
                            <input v-model="passObj.newPwd1" id="newPwd1" autocomplete="off" name="newPwd1" type="password" class="form-control" value="" placeholder="请输入新密码" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label">确认新密码：</label>
                        <div class="col-md-6">
                            <input v-model="passObj.newPwd2" id="newPwd2" autocomplete="off" name="newPwd2" type="password" class="form-control" value="" placeholder="确认新密码" />
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn default" data-dismiss="modal">取消</button>
                    <button @click="onSubmit" type="submit" class="btn blue">保存</button>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
    export default {
        data: function() {
            return {
                passObj: {}
            };
        },
        methods: {
            onSubmit: function(event) {
                let self = this;
                event.preventDefault();
                if (this._passFrom.valid()) {
                    $.ajax({
                        url: '/api/admin/changePwd.do',
                        data: self.passObj
                    }).done(({errCode, obj}) => {
                        if(errCode === 0){
                            self._passFrom.modal('hide');
                        }
                    });
                }
            }
        },
        created: function() {
            this.$root.$on('profile.openPassModal', () => {
                this.passObj = {oldPwd: '', newPwd1: '', newPwd2: ''};
                this._passFrom.modal();
            });
        },
        mounted: function() {
            this._passFrom = $('#j_passForm');
            this._passFrom.validate({
                rules:{
                    oldPwd:{
                        required:true
                    },
                    newPwd1:{
                        required:true,
                        notEqualTo:'#oldPwd'
                    },
                    newPwd2:{
                        required:true,
                        equalTo:'#newPwd1'
                    }
                }
            });
        }
    }
</script>