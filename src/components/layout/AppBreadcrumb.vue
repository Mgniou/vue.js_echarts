<template>
    <ul class="page-breadcrumb breadcrumb">
        <li v-for="(item,index) in list">
            <i class="fa fa-circle" v-if="index!=0"></i>
            <a :href="item.path">{{item.name}}</a>
        </li>
    </ul>
</template>

<script>
    import menu from './AppMenu/menu';

    /**
     * 因为Admin3的模板, 菜单在面包屑的前面
     * Admin6的面包屑在菜单的后面
     * 所以暂时用这种方法替代面包屑的菜单读取
     */
    module.exports = {
        computed: {
          list: function() {
              let menuPathArr = menu.getMenuPathArr(location.pathname);
              return menuPathArr;
              //return this.store.menuPathArr;
          }
        }
    }
</script>