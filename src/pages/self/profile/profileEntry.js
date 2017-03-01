import Vue from 'vue';
import AppHeader from 'components/layout/AppHeader/AppHeader.vue';
import AppMenu from 'components/layout/AppMenu/AppMenu.vue';
import AppTitle from 'components/layout/AppTitle.vue'
import AppBreadcrumb from 'components/layout/AppBreadcrumb.vue';
import AppFooter from 'components/layout/AppFooter.vue';
import Profile from './profile.vue';
import EditModal from './EditModal.vue';
import PassModal from './PassModal.vue';
import basicInfo from 'commonjs/basicInfo';

var vm = new Vue({
    el: '#app',
    components: {
        AppHeader,
        AppMenu,
        AppTitle,
        AppBreadcrumb,
        AppFooter,
        Profile,
        EditModal,
        PassModal
    },
    created: function() {
        this.store.user = basicInfo.fetch();
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