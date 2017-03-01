import Vue from 'vue';
import Login from './login.vue';

require('./login.css');

var vm = new Vue({
    el: '#app',
    components: {
        Login
    },
    created: function() {

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