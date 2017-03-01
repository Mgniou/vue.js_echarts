<template>
    <div class="page-header-menu" id="j_topMenu">
        <div class="container menuBox">
            <div class="logo">
                <img src="/assets/layouts/layout3/img/avatar9.jpg">
                <span>智慧公园管理系统</span>
            </div>

            <div class="hor-menu menuTar">
                <ul class="nav navbar-nav menuTar">
                    <template v-for="item in menus">
                       <!-- <li v-if="item.children && item.children.length > 0" :class="{active: isInCurrentPath(item)}" class="menu-dropdown classic-menu-dropdown">
                            <a :href="item.url" data-hover="megamenu-dropdown" data-close-others="true" data-toggle="dropdown" class="dropdown-toggle">{{item.name}}<i class="fa fa-angle-down"></i></a>
                            <ul class="dropdown-menu">
                                <li v-for="subitem in item.children" :class="{active: isInCurrentPath(subitem)}">
                                    <a :href="subitem.url" class="iconify"><i class="fa fa-angle-right"></i>{{subitem.name}}</a>
                                </li>
                            </ul>
                        </li>-->
                        <li :class="{actived: isInCurrentPath(item)}" v-show="getPermission(item.privileges)">
                            <a :href="item.url">{{item.name}}</a>
                        </li>
                    </template>
                </ul>
            </div>

            <div class="top-menu userBox pull-right">
                <ul class="nav navbar-nav pull-right">
                    <li class="dropdown dropdown-user dropdown-dark userLi">
                        <a href="javascript:;" class="dropdown-toggle userName" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                            <span class="username username-hide-mobile toggleArr">{{user.uname}}<i class="fa fa-angle-down"></i></span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-default" style="height: 34px">
                            <!--<li>
                                <a href="page_user_profile_1.html">
                                    <i class="icon-user"></i> 个人中心
                                </a>
                            </li>-->
                            <li>
                                <a href="javascript:;" @click="logout" >
                                    <i class="icon-key"></i> 退出
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
                <img class="img-circle pull-right" src="/assets/layouts/layout3/img/avatar9.jpg">
            </div>
        </div>
    </div>
</template>

<script>
    import basicInfo from 'commonjs/basicInfo';
    import perInfo from 'commonjs/perInfo';
    import base from 'commonjs/base';
    import menu from './menu';

    export default {
        computed: {
            menus: function () {
                return this.store.menus;
            },
            user: function() {
                return this.store.user;
            }
        },
        methods: {
            // 是否属于当前路径
            isInCurrentPath: function (item) {
                let pathArr = this.store.menuPathArr;
                for (let i = 0, len = pathArr.length; i < len; i++) {
                    if (pathArr[i].name === item.name) {
                        return true;
                    }
                }
                return false;
            },

            logout: function() {
                base.cookie(base.cookieId, null,{
                    expires:0
                });
                window.location.href = '/login.html';
            },
            getPermission: function (v) {
                let user = this.store.user,
                    privileges = this.store.privileges,
                    perS = base.checkPermission(user, privileges, v.values, v.type);
                return perS;
            }
        },
        created: function () {
            this.store.user = basicInfo.fetch();
            this.store.privileges = perInfo.fetch();

            let menuPathArr = menu.getMenuPathArr(location.pathname);
            this.store.menuPathArr = menuPathArr;
            this.store.per = menu.getPerArr();
            this.store.menus = menu.getMenus();

            // 网页标题
            let baseTitle = '智慧公园管理系统';
            let pageTitle = menuPathArr.length > 0 ? menuPathArr[menuPathArr.length - 1].name : '';
            document.title = pageTitle ? pageTitle + ' | ' + baseTitle : baseTitle;
            this.store.pageTitle = pageTitle;
        }
    }
</script>