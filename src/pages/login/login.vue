<template>
    <div>
        <div class="logo" style="float: none">
            <a href="/index.html">
                <h1>智慧公园管理系统</h1>
            </a>
        </div>
        <div class="content">
            <form id="j_loginForm" class="login-form" action="" method="post">
                <h3 class="form-title">智慧公园登录</h3>
                <div class="alert alert-danger display-hide">
                    <button class="close" data-close="alert"></button>
                    <span>请输入账号名和密码! </span>
                </div>
                <div class="form-group">
                    <label class="control-label visible-ie8 visible-ie9">账户名：</label>
                    <input v-model="obj.account" class="form-control form-control-solid placeholder-no-fix" type="text" autocomplete="off" placeholder="账户名" name="account"/>
                </div>
                <div class="form-group">
                    <label class="control-label visible-ie8 visible-ie9">密码：</label>
                    <input v-model="obj.password" class="form-control form-control-solid placeholder-no-fix" type="password" autocomplete="off" placeholder="密码" name="password"/>
                </div>
                <div class="form-actions">
                    <button @click="onLogin($event)" type="submit" class="btn btn-success uppercase">登录</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
    import Base from 'commonjs/base.js';

    export default{
        data: function() {
            return {
                _loginForm: null,
                obj: {}
            };
        },
        created: function() {
            this.obj = {
                account: '',
                password: ''
            }
        },
        methods: {
            onLogin: function(event) {
                event.preventDefault();
                var self = this;
                if(this._loginForm.valid()){
                    $.ajax({
                        url: '/api/login.do',
                        data: self.obj,
                        //dataType: 'json'
                    }).done(function(result) {
                        (result.errCode === 0) && function(data) {
                            Base.cookie(Base.cookieId,data);
                            window.location.href = '/index.html';
                        }(result.obj);
                    });
                }
            }
        },
        mounted: function() {
            //这里写表单的对象
            this._loginForm = $('#j_loginForm');
            //这里写验证规则
            this._loginForm.validate({
                rules:{
                    account:{
                        required:true
                    },
                    password:{
                        required:true
                    }
                }
            });
        }
    }
</script>
