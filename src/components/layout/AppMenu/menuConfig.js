// 所有菜单配置
const all = {
    '': {
        name: '管理首页',
        url: '/',
        path: ['index'],
        privileges: {
            type: 'or', // and , or
            values: ['getAgeGBSex']
        }
    },
    'index': {
        name: '管理首页',
        url: '/index.html',
        path: ['index'],
        privileges: {
            type: 'and', // and , or
            values: ['getAgeGBSex']
        }
    },
    'safe': {
        name: '安全管理',
        url: '/safe.html',
        path: ['safe'],
        privileges: {
            type: 'and', // and , or
            values: ['getAgeGBSex']
        }
    },
    'wifi': {
        name: '网络管理',
        url: '/wifi.html',
        path: ['wifi'],
        privileges: {
            type: 'and', // and , or
            values: ['getCameraVideoPage', 'getAgeGBSex']
        }
    },
    'weather': {
        name: '天气管理',
        url: '/weather.html',
        path: ['weather'],
        privileges: {
            type: 'or', // and , or
            values: ['getAgeGBSex']
        }
    },
    'eqp': {
        name: '健身器材管理',
        url: '/eqp.html',
        path: ['eqp'],
        privileges: {
            type: 'or', // and , or
            values: ['getAgeGBSex']
        }
    },
    'info': {
        name: '信息发布',
        url: '/info.html',
        path: ['info'],
        privileges: {
            type: 'or', // and , or
            values: ['getAgeGBSex']
        }
    }
};

// 头部菜单
let menus = {
    isRoot: true,
    ref: 'index',
    children: [
        { ref: 'index' },
        { ref: 'safe' },
        { ref: 'wifi' },
        { ref: 'weather' },
        { ref: 'eqp' },
        { ref: 'info' },

    ]
};

export default {
    all,
    menus
}