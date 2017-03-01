import Vue from 'vue';

function myDate (value) {
    var d = new Date(value);
    var year = d.getFullYear(),
        mouth = d.getMonth() + 1,
        date = d.getDate(),
        hour = d.getHours(),
        minute = d.getMinutes(),
        second = d.getSeconds();

    return [year, mouth, date].join('/') + ' ' + [hour, minute, second].join(':');
}

function sex(str) {
    return str == 0 ? '保密' : str == 1 ? '男' : '女' ;
};

export default  {
    init: function() {
        Vue.filter('myDate', myDate);
        Vue.filter('sex', sex);
    }
}