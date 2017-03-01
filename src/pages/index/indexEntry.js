import Vue from 'vue';
import AppHeader from 'components/layout/AppHeader/AppHeader.vue';
import AppMenu from 'components/layout/AppMenu/AppMenu.vue';
import AppTitle from 'components/layout/AppTitle.vue'
import AppBreadcrumb from 'components/layout/AppBreadcrumb.vue';
import AppFooter from 'components/layout/AppFooter.vue';
import index from './index.vue';

require('./index.scss');

var vm = new Vue({
    el: '#app',
    components: {
        AppHeader,
        AppMenu,
        AppTitle,
        AppBreadcrumb,
        AppFooter,
        index
    },

    created: function() {
        // this.store.parkList = parkList();
        // this.$set(this.store, 'params', { parkId: '' });
        // this.$set(this.store, 'dataList', []);
    },
    mounted: function() {
        $(function() {
            if(typeof Metronic != 'undefined'){
                Metronic.init(); // init metronic core components
                Layout.init(); // init current layout
            }
        });
    }
});

window.vm = vm;