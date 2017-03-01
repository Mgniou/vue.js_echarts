<template>
    <div class="row" v-show="getPermission({type: 'or', values: ['getAgeGBSex']})">
        <div class="row">
            <div class="row">
                <div class="rowSubTitle">
                    <span></span>
                    <span>无线网连接情况</span>
                </div>
                <div class="col-md-5">
                    <div class="dateSelect">
                        <div class="input-group input-medium date-picker input-daterange pull-left">
                            <input type="text" class="form-control" name="from" id="startD">
                            <span class="input-group-addon"> 至 </span>
                            <input type="text" class="form-control" name="to" id="endD">
                        </div>
                        <span class="period" @click="searchData()">搜索</span>
                        <span class="period" @click="resetData()">重置</span>
                        <div class="dateSelect timeFilter">
                            <span class="period" @click="sevenData()">最近7天</span>
                            <span class="period" @click="monthData()">最近30天</span>
                        </div>
                    </div>

                    <div class="peopleNum">
                        <div class="numBox pull-left">
                            <p class="numTitle">今日用户数量</p>
                            <p class="numItem">{{APdata.todaySum}}</p>
                        </div>
                        <div class="numBox pull-left">
                            <p class="numTitle">今日新增人数</p>
                            <p class="numItem">{{APdata.todayNew}}</p>
                        </div>
                    </div>

                    <div class="peopleNum noBorder wifiAllBox">
                        <div class="numBox pull-left wifiBox">
                            <div class="form-group numTitle">
                                <span class="pull-left">网址</span>
                                <div class="col-md-6" style="margin: 0 0 0 30px;">
                                    <select class="bs-select form-control" @change="selectVal($event)" v-model="selectedModel">
                                        <option>全部</option>
                                        <option v-for="val in APdata.select">{{val.name}}（{{val.value}}）</option>
                                    </select>
                                </div>
                            </div>
                            <p class="numTitle">
                                <span class="pull-left">用户总数</span>
                                <span class="pull-left blankL">{{peopleNum.sum}}</span>
                            </p>
                        </div>
                    </div>
                    <div class="sortSelect">
                        用户总数
                    </div>
                    <!--人群统计饼图-->
                    <div class="pieChart" id="j_statisticalChart"></div>
                </div>
                <div class="col-md-7">
                    <div class="hotChart" id="j_wifiTrendChart"></div>
                </div>
            </div>

            <div class="row">
                <div class="rowSubTitle">
                    <span></span>
                    <span>手机类型</span>
                </div>
                <div class="row">
                    <div class="partPhone pull-left" id="j_anzPhoneChart"></div>
                    <span class="leftArr pull-left"></span>
                    <div class="allPhone pull-left" id="j_allPhoneChart"></div>
                    <span class="leftArr rightArr pull-left"></span>
                    <div class="partPhone pull-left" id="j_iosPhoneChart"></div>
                </div>
            </div>

            <div class="row">
                <div class="rowSubTitle">
                    <span></span>
                    <span>对比报表</span>
                </div>
                <div class="row">
                    <div class="col-md-6 pull-left" id="j_timeCompared"></div>
                    <div class="col-md-6 pull-left" id="j_connectionNum"></div>
                </div>
            </div>
            <div class="row">
                <div class="checkMore" style="margin: 40px auto 10px"><a href="./wifi.html">查看更多<i class="fa fa-angle-right"></i></a></div>
            </div>
        </div>
    </div>
</template>

<script>
    import base from 'commonjs/base';
    import echarts from 'echarts';

    export default {
        data() {
            return {
                chart: null,
                anzPhone: [],
                anzPhoneData: [],
                iosPhone: [],
                iosPhoneData: [],
                allPhone: [],
                peopleNum: {},
                timeX: [],
                peopleAp1: [],
                peopleAp2: [],
                peopleAp3: [],
                peopleLegend: [],
                todayData: [],
                yesData: [],
                timeWifiX: [],
                todayWifi: [],
                yesWifi: [],
                timeData: {},
                selectedArr: {},
                selectedModel: '全部',
                APdata: {}
            }
        },
        computed: {
            user: function () {
                return this.store.user;
            }
        },
        methods: {
            //权限管理
            getPermission: function (v) {
                let user = this.store.user,
                    privileges = this.store.privileges,
                    perS = base.checkPermission(user, privileges, v.values, v.type);
                return perS;
            },

            //获取今日新增人数和用户数量
            getPeopleNum: function () {
                let that = this;
                $.ajax({
                    url: "api/wifi/getAPInfo.do",
                    dataType: "json"
                }).done(function (result) {
                    if (result.errCode === 0) {
                        that.APdata = result.obj;
                    }
                });
            },

            //搜索
            searchData: function () {
                this.selectedModel = "全部";
                this.selectVal();
                let startTime = $("#startD").val();
                let endTime = $("#endD").val();
                startTime = new Date(Date.parse(startTime));
                endTime = new Date(Date.parse(endTime));
                this.timeData = {
                    startTime: startTime,
                    endTime: endTime
                };
                this.runFunction();
            },

            //重置
            resetData: function () {
                this.selectedModel = "全部";
                this.selectVal();
                this.timeData = {};
                this.runFunction();
            },

            //最近7天
            sevenData: function () {
                this.selectedModel = "全部";
                this.selectVal();
                let endTimestamp = (new Date()).valueOf();
                let startTimetamp = endTimestamp - 1000 * 60 * 60 * 24 * 7;
                this.timeData = {
                    startTime: startTimetamp,
                    endTime: endTimestamp
                };
                this.runFunction();
            },

            //最近30天
            monthData: function () {
                this.selectedModel = "全部";
                this.selectVal();
                let endTimestamp = (new Date()).valueOf();
                let startTimetamp = endTimestamp - 1000 * 60 * 60 * 24 * 30;
                this.timeData = {
                    startTime: startTimetamp,
                    endTime: endTimestamp
                };
                this.runFunction();
            },

            //不同时间段
            runFunction: function () {
                this.statisticalChart('j_statisticalChart');
                this.wifiTrendChart('j_wifiTrendChart');
                this.anzPhoneChart('j_anzPhoneChart');
            },

            //每个ap对应的数据
            selectVal() {
                let selected = this.selectedModel,
                    curAP = selected.replace(/\（.*?\）/g, ''),
                    apDates = this.peopleNum.data,
                    apLen = apDates.length,
                    peopleLen = this.peopleLegend.length;
                console.log(curAP);
                //饼图突出显示
                for (let i = 0; i < apLen; i++) {
                    if (curAP === apDates[i].name) {
                        debugger
                        let curArr = apDates[i];
                        curArr.selected = true;           //通过想饼图的data中的对象添加selected:true来突出显示相应的部分

                    } else {
                        let curArr = apDates[i];
                        curArr.selected = false;
                    }
                }
                this.chart = echarts.getInstanceByDom(document.getElementById('j_statisticalChart')); //改变echarts的数据，找到相应的节点
                this.chart.setOption({                                                                //讲数据塞进echarts并刷新图表
                    series: [{
                        data: this.peopleNum.data
                    }]
                });
                //折线图突出显示
                for (let i = 0; i < peopleLen; i++) {
                    if (curAP === this.peopleLegend[i] || curAP === '全部') {
                        let d = this.peopleLegend[i];  //给legend配置项添加selected属性来控制线条的显示隐藏
                        this.selectedArr[d] = true;
                    } else {
                        let d = this.peopleLegend[i];
                        this.selectedArr[d] = false;
                    }
                }
                this.chart = echarts.getInstanceByDom(document.getElementById('j_wifiTrendChart'));
                this.chart.setOption({
                    legend: {
                        selected: this.selectedArr
                    }
                });
            },

            //人群统计饼图
            statisticalChart(id) {
                this.chart = echarts.init(document.getElementById(id));
                this.chart.showLoading();
                let that = this;
                $.ajax({
                    url: "/api/wifi/getPeopleGBAP.do",
                    async: false,
                    data: that.timeData,
                    dataType: "json"
                }).done(function (result) {
                    if (result.errCode === 0) {
                        that.peopleNum = result.obj;
                    }
                });
                this.chart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    series: [{
                        name: '用户数量',
                        type: 'pie',
                        radius: '90%',  //图表大小
                        center: ['50%', '50%'], //图表位置
                        avoidLabelOverlap: false, //是否启用防止标签重叠策略
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        data: this.peopleNum.data
                    }]
                });
                this.chart.hideLoading()
            },

            //人群统计折线图
            wifiTrendChart(id) {
                // 绘图方法
                this.chart = echarts.init(document.getElementById(id));      //dom节点的ID
                this.chart.showLoading();  //开启加载动画
                let that = this;
                $.ajax({
                    url: "/api/wifi/getPeopleTrendByTime.do",
                    async: false,  //必须同步
                    data: that.timeData,
                    dataType: "json"
                }).done(function (result) {
                    if (result.errCode === 0) {
                        that.timeX = result.obj.time;
                        that.peopleAp1 = result.obj.ap1;
                        that.peopleAp2 = result.obj.ap2;
                        that.peopleAp3 = result.obj.ap3;
                        that.peopleLegend = result.obj.legend;
                    }
                });
                this.chart.setOption({
                    title: {
                        text: '人数趋势统计',
                        x: 'center', //标题位置
                        y: 'top'
                    },
                    tooltip: {      //图表类型
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        }
                    },
                    legend: {  //图表线的说明
                        data: this.peopleLegend,
                        x: 'right',
                        selected: this.selectedArr  //控制折线显示隐藏
                    },
                    dataZoom: [   //x轴缩放比例
                        {
                            show: true,
                            realtime: true,
                            start: 0  //缩放起点
                        }
                    ],
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            axisLine: {onZero: false},
                            data: this.timeX
                        }
                    ],
                    yAxis: [
                        {
                            name: '人数(人/h)',
                            type: 'value'
                        }

                    ],
                    series: [{
                        name: this.peopleLegend[0],
                        type: 'line',
                        radius: '80%',
                        center: ['50%', '50%'],
                        avoidLabelOverlap: false, //是否启用防止标签重叠策略
                        label: {        //折线的样式
                            normal: {
                                show: false
                            }
                        },
                        data: this.peopleAp1
                    }, {
                        name: this.peopleLegend[1],
                        type: 'line',
                        radius: '80%',
                        center: ['50%', '50%'],
                        avoidLabelOverlap: false, //是否启用防止标签重叠策略
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        data: this.peopleAp2
                    }, {
                        name: this.peopleLegend[2],
                        type: 'line',
                        radius: '80%',
                        center: ['50%', '50%'],
                        avoidLabelOverlap: false, //是否启用防止标签重叠策略
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        data: this.peopleAp3
                    }]
                });
                this.chart.hideLoading();        //关闭加载动画
            },

            //Android手机数量柱状图
            anzPhoneChart(id) {
                this.chart = echarts.init(document.getElementById(id));
                this.chart.showLoading();
                var that = this;
                $.ajax({
                    url: "/api/wifi/getBrand.do",
                    async: false,
                    data: that.timeData,
                    dataType: "json"
                }).done(function (result) {
                    if (result.errCode === 0) {
                        that.allPhone = result.obj.PhoneList;
                        that.anzPhoneData = result.obj.AndroidList;
                        that.iosPhoneData = result.obj.IOSList;
                        that.anzPhone = $.map(result.obj.AndroidList, function (val) {
                            return val.name;
                        });
                        that.iosPhone = $.map(result.obj.IOSList, function (val) {
                            return val.name;
                        });
                    }
                });
                this.chart.setOption({
                    title: {
                        text: 'Android手机数量',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category', //类目轴
                            data: this.anzPhone,
                            axisTick: {
                                show: false
                            },
                            axisLine: {
                                show: false
                            },
                            axisLabel: {
                                interval: 0,
                                rotate: 45,
                                margin: 3,
                                textStyle: {
                                    color: "#222"
                                }
                            },
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#999'
                                }
                            }
                        }
                    ],
                    series: [{
                        name: '手机分类',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: '#51bee3',
                                barBorderRadius: [4, 4, 0, 0]
                            }
                        },
                        data: this.anzPhoneData
                    }]
                });
                this.chart.hideLoading()
            },

            //ios手机数量柱状图
            iosPhoneChart(id) {
                this.chart = echarts.init(document.getElementById(id));
                this.chart.showLoading();
                this.chart.setOption({
                    title: {
                        text: 'iOS手机数量',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category', //类目轴
                            data: this.iosPhone,
                            axisLabel: {
                                interval: 0,
                                rotate: 45,
                                margin: 3,
                                textStyle: {
                                    color: "#222"
                                }
                            },
                            axisTick: {
                                show: false
                            },
                            axisLine: {
                                show: false
                            },
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#999'
                                }
                            }
                        }
                    ],
                    series: [{
                        name: '手机分类',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: '#2bd195',
                                barBorderRadius: [4, 4, 0, 0]
                            }
                        },
                        data: this.iosPhoneData,
                    }]
                });
                this.chart.hideLoading()
            },

            //移动系统数量饼图
            allPhoneChart(id) {
                this.chart = echarts.init(document.getElementById(id));
                this.chart.showLoading();
                this.chart.setOption({
                    title: {
                        text: '移动系统数量',
                        x: 'center',
                        y: 'bottom'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    color: ['#2bd195', '#51bee3'],
                    series: [{
                        name: '手机平台',
                        type: 'pie',
                        radius: '55%',
                        avoidLabelOverlap: false, //是否启用防止标签重叠策略
                        label: {
                            normal: {
                                show: false
                            }
                        },

                        //roseType: 'radius', //是否展示成南丁格尔图，通过半径区分数据大小
                        data: this.allPhone
                    }]
                });
                this.chart.hideLoading()
            },

            //时间对比柱状图
            timeCompared(id) {
                // 绘图方法
                this.chart = echarts.init(document.getElementById(id));
                this.chart.showLoading();
                let that = this;
                $.ajax({
                    url: "/api/wifi/get48HoursPeopleSum.do",
                    async: false,
                    dataType: "json"
                }).done(function (result) {
                    if (result.errCode === 0) {
                        that.todayData = result.obj.today;
                        that.yesData = result.obj.yestoday;
                    }
                });
                this.chart.setOption({
                    title: {
                        text: '时间对比',
                        x: 'center'
                    },
                    legend: {
                        data: ['PV', 'UV'],
                        x: 'left'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category', //类目轴
                            data: ['PV', 'UV'],
                            axisTick: {
                                show: false
                            },
                            axisLine: {
                                show: false
                            },
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            axisLine: {
                                show: false
                            },
                            axisTick: {
                                show: false
                            },
                            axisLabel: {
                                textStyle: {
                                    color: '#999'
                                }
                            }
                        }
                    ],
                    series: [{
                        name: '今日',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: '#51bee3',
                                barBorderRadius: [4, 4, 0, 0]
                            }
                        },
                        data: this.todayData,
                    },
                        {
                            name: '昨日',
                            type: 'bar',
                            itemStyle: {
                                normal: {
                                    color: '#eb932d',
                                    barBorderRadius: [4, 4, 0, 0]
                                }
                            },
                            data: this.yesData,
                        }]
                });
                this.chart.hideLoading()
            },

            //今天与昨天无线网络连接人数对比折线图
            connectionNum(id) {
                this.chart = echarts.init(document.getElementById(id));
                this.chart.showLoading();
                let that = this;
                $.ajax({
                    url: "/api/wifi/get48HoursPeople.do",
                    async: false,
                    dataType: "json"
                }).done(function (result) {
                    if (result.errCode === 0) {
                        that.timeWifiX = result.obj.xAxis;
                        that.todayWifi = result.obj.today;
                        that.yesWifi = result.obj.yestoday;
                    }
                });
                this.chart.setOption({
                    title: {
                        text: '今天与昨天无线网络连接人数对比',
                        x: 'center',
                        y: 'top'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        }
                    },
                    legend: {
                        data: ['今日', '昨日'],
                        x: 'right'
                    },
                    dataZoom: [
                        {
                            show: true,
                            realtime: true,
                            start: 0
                        }
                    ],
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            axisLine: {onZero: false},
                            data: this.timeWifiX
                        }
                    ],
                    yAxis: [
                        {
                            name: '人数(人/h)',
                            type: 'value'
                        }

                    ],
                    series: [{
                        name: '今日',
                        type: 'line',
                        radius: '80%',
                        center: ['50%', '50%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        data: this.todayWifi
                    },
                        {
                            name: '昨日',
                            type: 'line',
                            radius: '80%',
                            center: ['50%', '50%'],
                            avoidLabelOverlap: false,
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            data: this.yesWifi
                        }]
                });
                this.chart.hideLoading()
            },
        },
        created: function () {
        },
        watch() {

        },
        mounted() {
            this.getPeopleNum();
            this.$nextTick(function () {
                this.statisticalChart('j_statisticalChart');
                this.wifiTrendChart('j_wifiTrendChart');
                this.anzPhoneChart('j_anzPhoneChart');
                this.iosPhoneChart('j_iosPhoneChart');
                this.allPhoneChart('j_allPhoneChart');
                this.timeCompared('j_timeCompared');
                this.connectionNum('j_connectionNum');
            });

            $('.date-picker').datepicker({
                language: 'zh-CN',
                orientation: "left",
                autoclose: true,
                format: 'yyyy/mm/dd'
            });

        }
    }
</script>