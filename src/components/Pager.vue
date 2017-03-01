<template>
    <div class="ms-pager">
        <!-- 给嵌套在里面的组件使用的插槽 -->
        <slot></slot>
        <div class="row pager-list-wrap" v-if="totalRecordCount > 0">
            <div class="col-md-5 col-sm-12">
                <div class="pager-count mt20">共有<span class="j-ui-pager-totalnum">{{totalRecordCount}}</span>条数据，每页显示 {{pageSize}} 条</div>
            </div>
            <div class="col-md-7 col-sm-12">
                <ul class="pagination pull-right" v-if='pageCount > 0'>
                    <li class="prev paginate_button" :class='{disabled: isFirst}'>
                        <a @click='gotoPage(1)' href='javascript:void(0);'>
                            <i class="fa fa-angle-double-left"></i>
                        </a>
                    </li>
                    <li class="prev paginate_button" :class='{disabled: isFirst}'>
                        <a @click='gotoPage(pageNo-1)' href='javascript:void(0);'>
                            <i class="fa fa-angle-left"></i>
                        </a>
                    </li>
                    <li class="paginate_button" v-for='page in pages'
                        :class='{active: page.isActive, disabled: page.isDisabled}' >
                        <a  @click='gotoPage(page.pageNo)' href='javascript:void(0);'>
                            {{page.pageNo}}
                        </a>
                    </li>
                    <li class="next paginate_button" :class='{disabled: isLast}'>
                        <a @click='gotoPage(pageNo+1)' href='javascript:void(0);'>
                            <i class="fa fa-angle-right"></i>
                        </a>
                    </li>
                    <li class="next paginate_button" :class='{disabled: isLast}'>
                        <a @click='gotoPage(pageCount)' href='javascript:void(0);'>
                            <i class="fa fa-angle-double-right"></i>
                        </a>
                    </li>
                </ul>
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
                totalRecordCount: null
            }, this.config);
        },
        computed: {
            showCount: function() {
                let count = this.config.showCount;
                return  count && count > 4 ? count : 10; // 显示页码数最小是5
            },
            beginGard: function() {
                return 2;
            },
            endGard: function() {
              return this.pageCount - 1;
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
            // 页码对象
            getPageObj: function(pageNo) {
                return {
                    pageNo: pageNo, // 数字或者...
                    isActive: pageNo === this.pageNo, // 当前页码处于激活状态
                    isDisabled: pageNo === this.pageNo // 当前页面处于禁用状态
                }
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
                    data: data
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
                    // 加载完数据重新计算
                    self.calc();
                  }).fail(function () {
                      // 加载失败还原页码
                      self.pageNo = data.pageNo;
                      self.calc();
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
                    // 先计算一次，让用户感觉操作反馈快速
                    this.calc();
                    this.fetch();
                }
            },
            // 计算分页
            calc: function() {
                let begin, // 开始页码
                    end, // 结束页码
                    diffVal; // 结束页码和最大页码的差值

                let count = this.showCount - 3; // 第一页，最后一页，当前页是必须显示的
                let pages = []; // 要显示的页码数组
                let first, // 页码数据的第一个
                    last; // 页码数组的最后一个
                if (this.showCount < this.pageCount) { // 总页数大于要显示的页数个数才需要计算
                    begin = this.pageNo - Math.ceil(count / 2); // 先算出开始页码
                    begin = Math.max(begin, this.beginGard); // 调整页码，最小值是beginGard
                    end = begin + count; // 结束页码
                    if (end > this.endGard) { // 结束页码超出了，调整结束页码
                        diffVal = end - this.endGard;
                        begin = begin - diffVal; // 把开始页码往前移动，保证显示的页码个数是showCount
                        end = this.endGard;
                    }
                } else { // 总页数不大于要显示的页数个数直接显示所有
                    begin = this.beginGard;
                    end = this.endGard;
                }
                while (begin <= end) {
                    pages.push(this.getPageObj(begin));
                    begin += 1;
                }

                // 处理省略号
                if (this.showCount < this.pageCount) {
                    first = pages[0];
                    last = pages[pages.length - 1];
                    if (first.pageNo !== this.pageNo && first.pageNo !== this.beginGard) {
                        first.pageNo = '...';
                        first.isDisabled = true;
                    }
                    if (last.pageNo !== this.pageNo && last.pageNo !== this.endGard) {
                        last.pageNo = '...';
                        last.isDisabled = true;
                    }
                }

                // 处理第一页和最后一页
                pages.unshift(this.getPageObj(1));
                if (this.pageCount > 1) {
                    pages.push(this.getPageObj(this.pageCount));
                }
                this.pages = pages;
            }
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