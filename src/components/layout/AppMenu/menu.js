import config from './menuConfig';


// 生成菜单
const createMenu = function(tnode) {
    let children = tnode.children || [];
    $.extend(tnode, config.all[tnode.ref]);
    for (let i = 0, len = children.length; i < len; i++) {
        createMenu(children[i]);
    }
};
createMenu(config.menus);

// 返回路径数组
const getMenuPathArr = function(url) {
    let all = config.all;
    let pathArr = [];
    for (var k in all) {
        if (all[k].url === url) {
            pathArr = all[k].path;
            break;
        }
    }
    return $.map(pathArr, function(item) {
        return all[item];
    });
};

// 返回权限数组
const getPerArr = function() {
    let all = config.all;
    let perArr = [];
    for (let k in all) {
        perArr.push(all[k].privileges);
    }
    return perArr;
};

// 获取菜单
const getMenus = function() {
    /*$.grep(config.menus.children, function(privileges) {
            check(v);
    });*/
    return config.menus.children;

};

export default {
    getMenus,
    getMenuPathArr,
    getPerArr
}