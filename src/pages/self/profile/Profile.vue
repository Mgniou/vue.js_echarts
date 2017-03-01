<template>
    <div class="portlet light">
        <div class="portlet-title">
            <div class="caption">
                <i class="fa fa-user font-green-sharp"></i>
                <span class="caption-subject font-green-sharp bold uppercase">账户基本信息：</span>
            </div>
        </div>

        <div class="portlet-body">
            <div class="row">
                <div class="col-md-2">
                    <p class="pull-right ptb10">
                        账户名：
                    </p>
                </div>
                <div class="col-md-8"><p class="ptb10" v-text="user.account"></p></div>
            </div>
            <div class="row">
                <div class="col-md-2">
                    <p class="pull-right ptb10">
                        名称：
                    </p>
                </div>
                <div class="col-md-8"><p class="ptb10" v-text="user.uname||'无'"></p></div>
            </div>
            <div class="row">
                <div class="col-md-2">
                    <p class="pull-right ptb10">
                        email：
                    </p>
                </div>
                <div class="col-md-8"><p class="ptb10" v-text="user.email||'无'"></p></div>
            </div>
            <div class="row">
                <div class="col-md-2">
                    <p class="pull-right ptb10">
                        手机号码：
                    </p>
                </div>
                <div class="col-md-8"><p class="ptb10" v-text="user.phone||'无'"></p></div>
            </div>
            <div class="row">
                <div class="col-md-2">
                    <p class="pull-right ptb10">
                        状态：
                    </p>
                </div>
                <div class="col-md-8">
                    <p class="ptb10">
                        <span class="btn btn-xs" :class="user.status === 0 ? 'green' : 'red'" v-text="user.statusName"></span>
                    </p>
                </div>
            </div>
            <div class="row">
                <div class="col-md-2">
                    <p class="pull-right ptb10">
                        登录时间：
                    </p>
                </div>
                <div class="col-md-8"><p class="ptb10">{{ user.loginTime|myDate }}</p></div>
            </div>
            <div class="row">
                <div class="col-md-2">
                    <p class="pull-right ptb10">
                        创建时间：
                    </p>
                </div>
                <div class="col-md-8"><p class="ptb10">{{ user.createTime|myDate }}</p></div>
            </div>
            <div class="row">
                <div class="col-md-offset-2 col-md-8">
                    <span class="btn blue btn-sm" @click="showEditForm">修改信息</span>
                    <span class="btn red btn-sm" @click="showPassWordForm">修改密码</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            user: function() {
                return this.store.user;
            }
        },
        methods: {
            showEditForm(event) {
                event.preventDefault();
                this.$root.$emit('profile.openEditModal', this.user);
            },
            showPassWordForm(event) {
                event.preventDefault();
                this.$root.$emit('profile.openPassModal');
            }
        }
    }
</script>