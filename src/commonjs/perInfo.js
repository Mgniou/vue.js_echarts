/**
 * Created by Administrator on 2017/2/28.
 */
export default {
    fetch: function() {
        let privileges = {};
        $.ajax({
            url: '/api/getUserPermissions.do',
            async: false,
            dataType: 'json'
        }).done(function (result) {
            if (result.errCode == 0) {
                let permission = [],
                    map = {};
                permission = $.map(result.obj, function (val) {
                    return val.code;
                });
                // 转换成key:value
                $.each(permission, function(i, v) {
                    map[v] = true;
                });
                privileges = map;
            }
        });
        return privileges;
    }
}