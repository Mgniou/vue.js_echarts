import Vue from 'vue';
import basicInfo from 'commonjs/basicInfo';
import perInfo from 'commonjs/perInfo';

// 共享的数据
let store = {
    pageTitle: '',
    user: {},
    privileges: [],
    menus: {},
    parkList: [],
    adminStatusSelect: []
};

export default {
    init: function() {
        store.user = basicInfo.fetch();
        store.privileges = perInfo.fetch();
        // 让每个vue实例都可以通过this.store取得store对象
        Vue.mixin({
            data: function() {
                return {
                    store: store
                }
            }
        });
    },
    getStore: function() {
        return store;
    }
};