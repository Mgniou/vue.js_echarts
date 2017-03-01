export default {
    fetch: function() {
        var rtn = {};
        $.ajax({
            url: '/api/getUserInfo.do',
            type: 'get',
            async: false,
            statusCode: {404: function() {
                let  curHref = encodeURIComponent(location.href);
                window.location.href= `/login.html?redirectURL=${curHref}`;
            }}
        }).done((result=>{
            if(result.errCode === 0){
                rtn =  result.obj;
            }else{
                let location= window.location;
                let  curHref = encodeURIComponent(location.href);
                window.location.href= `/login.html?redirectURL=${curHref}`;
            }
        }));
        return rtn;
    }
};