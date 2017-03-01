<template>
    <div class="ms-pager">
        <!-- 给嵌套在里面的组件使用的插槽 -->
        <slot></slot>
        <div class="row pager-list-wrap" v-if="totalRecordCount > 0">
            <div class="row pager-list-wrap">
                <div style="width: 264px; height: 40px">
                    <ul class="pageBar">
                        <li class="prev">
                            <a @click='gotoPage(1)' href='javascript:void(0);'>首页</a>
                        </li>
                        <li class="prev">
                            <a @click='gotoPage(pageNo-1)' href='javascript:void(0);'>
                                <i class="fa fa-angle-left"></i>
                            </a>
                        </li>
                        <li><a href='javascript:void(0);'>{{pageNo}}</a>
                        </li>
                        <li class="next">
                            <a @click='gotoPage(pageNo+1)' href='javascript:void(0);'>
                                <i class="fa fa-angle-right"></i>
                            </a>
                        </li>
                        <li class="next">
                            <a @click='gotoPage(pageCount)' href='javascript:void(0);'>尾页</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import base from 'commonjs/base';

    function getHashStr(name) {
        var url = location.hash; //获取url中"?"符后的字串
        var theRequest = new Object();
        if (url.indexOf("?")) {
            var str = url.substr(url.indexOf("?") + 1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }
        return theRequest[name];
    }

    export default {
        props: {
            config: {
                type: Object,
                default: function() {
                    return {};
                }
            }
        },
        data: function() {
            return base.assignObj({
                pageSize: 20,
                autoLoad: true,
                url: null,
                getParams: $.noop,
                onPageLoad: $.noop,
                pageNo: null,
                pages: [],
                pageCount: 100,
                totalRecordCount: null,
                currPage: 1
            }, this.config);
        },
        computed: {
            showCount: function() {
                return 1; // 显示页码数最小是5
            },
            isFirst: function() {
                return this.pageNo === 1;
            },
            isLast: function() {
                return this.pageNo === this.pageCount;
            }
        },
        methods: {
            getHref: function(pageNo) {
                if (location.hash) {
                    var search = location.hash,
                        page = getHashStr('page');
                    if (page) { // 存在就替换
                        search = search.replace('page=' + page, 'page=' +pageNo);
                        return search;
                    } else { // 不存在就叠加
                        return location.hash + '?page=' + pageNo;
                    }
                } else {
                    return '#?page=' + pageNo;
                }
            },
            cur : function() {
                var cur = this.pageNo;
                var match = location.href.match(/(?:#|\?)page\=(\d+)/);
                if (match && match[1]) {
                    cur = ~~match[1];
                    if (cur < 0 || cur > this.pageCount) {
                        cur = 1;
                    }
                }
                // 默认第一页
                location.href.indexOf('#') < 0 && (cur = 1);
                return cur;
            },
            // 从后台加载数据
            fetch: function() {
                let self = this;
                let data = $.extend({
                    pageSize: self.pageSize,
                    pageNo: self.pageNo,
                }, this.getParams());
                $.ajax({
                    url: self.url,
                    data: data,
                    dataType: 'json'
                }).done(function (result) {
                    let obj = result.obj;
                    if (result.errCode === 0) {
                        self.pageCount = obj.pageCount;
                        self.totalRecordCount = obj.totalRecordCount;
                        // 更新父组件列表数据
                        self.onPageLoad(obj.record);
                    } else {
                        // 加载失败还原页码
                        self.pageNo = data.pageNo;
                    }
                }).fail(function () {
                    // 加载失败还原页码
                    self.pageNo = data.pageNo;
                    alert("获取数据失败");
                });
            },
            // 跳转到第几页
            gotoPage: function(page, isReload) {
                page = page || 1;
                // 第一次加载的时候，总页数是不知道的，所以不需要计算分页，直接从后台加载数据，加载完数据再计算
                if (this.pageNo === null) {
                    this.pageNo = page;
                    this.fetch();
                    return;
                }
                page = Math.min(Math.max(1, page), this.pageCount);
                window.location.hash = this.getHref(page);
                if (isReload || page !== this.pageNo) {
                    this.pageNo = page;
                    this.currPage = page;
                    this.fetch();
                }
            },

        },
        created: function() {
            var that = this,
                cur = that.cur();
            window.addEventListener("hashchange", function () {
                cur = that.cur();
                that.gotoPage(cur);
            }, false);
            if (this.autoLoad === true) {
                this.gotoPage(cur);
            }
        }
    }
</script>