// 全局 ajax 处理：加遮罩以及错误提示
// 自定义了两个配置：
// blockUI---等于false时不显示遮罩
// showServerErrMsg---等于false时不显示服务器返回的errMsg
var ajaxNum = 0;
export default {
    init: function () {
        $(document).ajaxSend(function (event, jqXHR, options) {
            //  通过自定义属性blockUI控制是否显示遮罩，只有值为false才不显示
            console.log('ajax send: ' + ajaxNum);
            if (options.blockUI !== false) {
                if (ajaxNum === 0) {
                    $.blockUI({
                        message: '<div class="loading-message loading-message-boxed"><img src="../assets/global/img/loading-spinner-grey.gif" align=""><span>&nbsp;&nbsp;加载中...</span></div>',
                        css:{
                            border: "0px",
                            cursor: "wait",
                            background: ""
                        }
                    });
                }
                ajaxNum += 1;
            }

        }).ajaxComplete(function (event, jqXHR, options) {
            if (options.blockUI !== false) {
                ajaxNum -= 1;
                console.log('ajax complete: ' + ajaxNum);
                if (ajaxNum === 0) {
                    setTimeout(function () {
                        console.log('setTimeout');
                        $.unblockUI();
                    }, 300);
                }
            }
        }).ajaxError(function (event, jqXHR, options, thrownError) {
            switch (jqXHR.status) {
                case(500):
                    alert("服务器系统内部错误");
                    break;
                case(401):
                    alert("未登录");
                    break;
                case(403):
                    alert("无权限执行此操作");
                    break;
                case(404):
                    alert("找不到对应的资源");
                    break;
                case(408):
                    alert("请求超时");
                    break;
                default:
                    alert("操作失败，可能是网络、服务器、数据格式等原因导致");
            }
            $.unblockUI();
        }).ajaxSuccess(function (event, jqXHR, options) {
            jqXHR.done(function (result) {
                //  通过自定义属性showServerErrMsg控制是否显示遮罩，只有值为false才不显示
                if (options.showServerErrMsg !== false && result && (result.errCode !== 0)) {
                    result.errMsg && alert(result.errMsg);
                }
            })
        }).ajaxComplete(function () {
            ajaxNum --;
            $.unblockUI();
        });;
        $.ajaxSetup({
            global: true,
            cache: false,
            timeout: 10 * 60 * 1000 // 10min
        });
    }
}