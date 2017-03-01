<template>
    <form action="" ms-controller="editCrl" class="modal fade form-horizontal" id="j_editForm" tabindex="-1" role="basic" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true"></button>
                    <h4 class="modal-title">修改个人信息</h4>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="col-md-3 control-label">账号：</label>
                        <div class="col-md-6">
                            <input v-model="user.account" autocomplete="off" name="name" type="text" class="form-control" value="" placeholder="请输入账号" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label">名称：</label>
                        <div class="col-md-6">
                            <input v-model="user.name" autocomplete="off" name="name" type="text" class="form-control" value="" placeholder="请输入名称" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label"><span class="required">*</span>手机号码：</label>
                        <div class="col-md-6">
                            <input v-model="user.phone" autocomplete="off" name="phone" type="text" class="form-control" value="" placeholder="请输入手机号码" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-3 control-label">邮箱地址：</label>
                        <div class="col-md-6">
                            <input v-model="user.email" autocomplete="off" name="email" type="email" class="form-control" value="" placeholder="请输入邮箱地址" />
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
    import Base from 'commonjs/base.js';

    export default {
        data: function() {
            return {
                _editForm: null,
                user: {}
            };
        },
        methods: {
            onSubmit: function(event) {
                event.preventDefault();
                if(this._editForm.valid()){
                    $.ajax({
                        url: '/api/admin/updateSelf.do',
                        data: this.user
                    }).done(({errCode, obj}) => {
                        (errCode === 0) && window.location.reload(true)
                    });
                }
            }
        },
        created: function() {
            this.$root.$on('profile.openEditModal', user => {
                this.user = Base.assignObj({
                    uin : '',
                    account: '',
                    name: '',
                    phone: '',
                    email: '',
                }, user);
                this._editForm.modal();
            });
        },
        mounted: function() {
            this._editForm = $('#j_editForm');
            this._editForm.validate({
                rules:{
                    phone:{
                        required:true,
                        mobile:true     // 大陆手机号码
                    },
                    email:{
                        email:true
                    }
                }
            });
        }
    }
</script>