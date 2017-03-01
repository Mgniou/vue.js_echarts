<template>
    <div class="row" v-show="getPermission({type: 'or', values: ['getAgeGBSex']})">
        <div class="row">
            <div class="rowTitle">
                安全管理
            </div>
            <div class="row">
                <div class="rowSubTitle">
                    <span></span>
                    <span>人数统计</span>
                </div>
                <div class="col-md-4">
                    <div class="peopleNum">
                        <div class="numBox pull-left">
                            <p class="numTitle">当前在园人数</p>
                            <p class="numItem">{{peopleData.currInPark}}</p>
                        </div>
                        <div class="numBox pull-left">
                            <p class="numTitle">今日新增人数</p>
                            <p class="numItem">{{peopleData.newEnter}}</p>
                        </div>
                    </div>

                    <div class="peopleNum noBorder">
                        <div class="numBox pull-left">
                            <p class="numTitle">
                                <span class="pull-left">历史入园人数</span>
                                <span class="pull-right">{{peopleData.allEnter}}</span>
                            </p>
                            <p class="numTitle">
                                <span class="pull-left">今日新增人数</span>
                                <span class="pull-right">{{peopleData.newEnter}}</span>
                            </p>
                        </div>
                        <div class="numBox pull-left">
                            <p class="numTitle">
                                <span class="pull-left">今日入园人数</span>
                                <span class="pull-right">{{peopleData.todayEnter}}</span>
                            </p>
                            <p class="numTitle">
                                <span class="pull-left">高峰时间点</span>
                                <span class="pull-right">{{peopleData.rushHour}}</span>
                            </p>
                        </div>
                    </div>
                    <div class="rowSubTitle">
                        <span></span>
                        <span>服务人群分布</span>
                    </div>

                    <!--服务人群分布环图-->
                    <div class="pieChart" id="j_serviceCrowdChart"></div>
                </div>
                <div class="col-md-8">
                    <div class="hotChart" id="j_serviceHotChart"></div>
                    <div class="checkMore"><a href="./safe.html">查看更多<i class="fa fa-angle-right"></i></a></div>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="rowTitle">
                无线网络管理
            </div>
            <div class="row">
                <div class="rowSubTitle">
                    <span></span>
                    <span>无线网连接情况</span>
                </div>
                <div class="col-md-4">
                    <div class="peopleNum">
                        <div class="numBox pull-left">
                            <p class="numTitle">今日用户数量</p>
                            <p class="numItem">1565</p>
                        </div>
                        <div class="numBox pull-left">
                            <p class="numTitle">今日新增人数</p>
                            <p class="numItem">143</p>
                        </div>
                    </div>

                    <div class="peopleNum noBorder wifiAllBox">
                        <div class="numBox pull-left wifiBox">
                            <div class="form-group numTitle">
                                <span class="pull-left">网址</span>
                                <div class="col-md-6">
                                    <select class="bs-select form-control" @change="selectVal($event)" v-model="selectedModel">
                                        <option>全部</option>
                                        <option v-for="val in APdata.select">{{val.name}}（{{val.value}}）</option>
                                    </select>
                                </div>
                            </div>
                            <p class="numTitle">
                                <span class="pull-left">用户总数</span>
                                <span class="pull-left blankL">170053</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="hotChart" id="j_wifiHotChart"></div>
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
                // 初始化空对象
                chart: null,
                // 初始化图表配置
                serviceCrowd: [],
                serviceCrowdData: [],
                allPhone: [],
                anzPhone: [],
                anzPhoneData: [],
                iosPhone: [],
                iosPhoneData: [],
                safeDta: [],
                wifiDta: [],
                peopleData: {},
                APdata: {},
                selectedModel: '全部'
            }
        },
        computed: {

        },
        methods: {
            //权限管理
            getPermission: function (v) {
                let user = this.store.user,
                    privileges = this.store.privileges,
                    perS = base.checkPermission(user, privileges, v.values, v.type);
                return perS;
            },

            //园区人数信息
            peopleNumData: function () {
                let that = this;
                $.ajax({
                    url: "/api/index/getParkInfo.do",
                    dataType: "json"
                }).done(function (result) {
                    if (result.errCode === 0) {
                        that.peopleData = result.obj;
                    }
                });
            },

            //服务人群分布环图
            serviceCrowdChart(id) {
                this.chart = echarts.init(document.getElementById(id));
                this.chart.showLoading();
                let that = this;
                $.ajax({
                    url: "/api/camera/getPeopleGBAge.do",
                    async: false,
                    dataType: "json"
                }).done(function (result) {
                    if (result.errCode === 0) {
                        that.serviceCrowdData = result.obj;
                        that.serviceCrowd = $.map(result.obj, function (val) {
                            return val.name;
                        });
                    }
                });
                this.chart.setOption({
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'left',
                        y: 'top',
                        data: this.serviceCrowd
                    },
                    series: [{
                        name: '入园情况',
                        type: 'pie',
                        radius: [70, 120],
                        avoidLabelOverlap: false,
                        data: this.serviceCrowdData
                    }]
                });
                this.chart.hideLoading()
            },

            //安全管理热力图
            safeHeatmap: function () {
                let that = this;
                let heatmapInstance = h337.create({
                    container: document.querySelector('#j_serviceHotChart')
                });
                $.ajax({
                    url: "/api/wifi/getHotMapData.do",
                    async: false,
                    dataType: "json"
                }).done(function (result) {
                    if (result.errCode === 0) {
                        that.safeDta = result.obj;
                    }
                });
                let data = {
                    max: 50,
                    data: this.safeDta
                };
                heatmapInstance.setData(data);
            },

            //网络管理热力图
            wifiHeatmap: function () {
                let that = this;
                let heatmapInstance = h337.create({
                    container: document.querySelector('#j_wifiHotChart')
                });
                $.ajax({
                    url: "/api/wifi/getHotMapData.do",
                    async: false,
                    dataType: "json"
                }).done(function (result) {
                    if (result.errCode === 0) {
                        that.wifiDta = result.obj;
                    }
                });
                let data = {
                    max: 50,
                    data: this.wifiDta
                };
                heatmapInstance.setData(data);
            },

            //Android手机数量柱状图
            anzPhoneChart(id) {
                this.chart = echarts.init(document.getElementById(id));
                this.chart.showLoading();
                let that = this;
                $.ajax({
                    url: "/api/wifi/getBrand.do",
                    async: false,
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
                            }
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
                            }
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
        },
        created: function () {

        },
        mounted() {
            this.peopleNumData();
            this.$nextTick(function () {
                this.serviceCrowdChart('j_serviceCrowdChart');
                this.anzPhoneChart('j_anzPhoneChart');
                this.iosPhoneChart('j_iosPhoneChart');
                this.allPhoneChart('j_allPhoneChart');
            });
            this.safeHeatmap();
            this.wifiHeatmap();
        }
    }
</script>