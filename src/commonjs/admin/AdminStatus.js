export default function (params, isAsync = false) {
    var list = [];
    var promise = $.ajax({
        url: '/api/admin/getAdminStatusSelect.do',
        data: params ? params : {},
        async: isAsync
    });
    if(!isAsync){
        // 同步
        promise.done(({errCode, obj}) => {
            (errCode === 0) && (list = obj)
        });

        return list;
    }
    // 异步 返回 promise
    return promise;
}