<template>
    <div class="row" v-show="getPermission({type: 'or', values: ['getAgeGBSex']})">
        <div class="row">
            <div class="rowTitle">
                监控画面
            </div>
            <div class="row">
                <div class="currVideo pull-left">
                    <video :src=videoUrl controls="controls" width="924" height="520" autoplay="autoplay"></video>
                </div>
                <div class="pagerBox pull-left">
                    <vidsec ref="vidsec" :config="pagerConfig">
                        <ul class="videoList">
                            <li v-for="value in dataList">
                                <p class="videoBar"><span class="pull-left">{{value.camName}}</span><span @click="videoSelect(value)" class="videoSelect pull-right"></span></p>
                                <img :src=value.camImg alt="" width="264" height="150">
                            </li>
                        </ul>
                    </vidsec>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="rowTitle">
                客流统计
            </div>
            <div class="row">
                <div class="charts pull-left col-md-6" id="j_stayTimeChart"></div>
                <div class="charts pull-left col-md-6" id="j_timePointsChart"></div>
                <div class="charts pull-left col-md-6" id="j_allAgesChart"></div>
                <div class="charts pull-left col-md-6" id="j_CrowdSizeChart"></div>
            </div>
        </div>
        <div class="row">
            <div class="checkMore" style="margin: 40px auto 10px"><a href="">查看更多<i class="fa fa-angle-right"></i></a></div>
        </div>
    </div>
</template>

<script>
    import base from 'commonjs/base';
    import echarts from 'echarts';
    import vidsec from './vidsec.vue';

    export default {
        data: function() {
            return {
                ageGroup: [],
                manData: [],
                womenData: [],
                peopleShape: [],
                dataList: [],
                stayTimeX: [],
                stayTimeData: [],
                timeNumX: [],
                timeNumData: [],
                videoUrl: ''
            }
        },
        components: {
            vidsec
        },
        computed: {
            pagerConfig: function() {
                return {
                    url: '/api/camera/getCameraVideoPage.do',
                    onPageLoad: this.onPageLoad,
                    pageSize : 3
                }
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

            //点击切换视频
            videoSelect: function (val) {
                this.videoUrl = val.camUrl;
            },

            //停留时间分布柱状图
            stayTimeChart(id) {
                // 绘图方法
                this.chart = echarts.init(document.getElementById(id));
                this.chart.showLoading();
                let that = this;
                $.ajax({
                    url: "/api/camera/getPeopleGBKeepTime.do",
                    async: false,
                    dataType: "json"
                }).done(function (result) {
                    if (result.errCode === 0) {
                        that.stayTimeX = result.obj.xAxis;
                        that.stayTimeData = result.obj.data;
                    }
                });
                this.chart.setOption({
                    title: {
                        text: '停留时间分布',
                        x:'center'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category', //类目轴
                            data: this.stayTimeX,
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
                        name: '停留时间',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: '#51bee3',
                                barBorderRadius: [4, 4, 0, 0]
                            }
                        },
                        data: this.stayTimeData,
                    }]
                });
                this.chart.hideLoading()
            },

            //各时间点进场人数统计折线图
            timePointsChart(id) {
                // 绘图方法
                this.chart = echarts.init(document.getElementById(id));
                // 皮肤添加同一般使用方式
                this.chart.showLoading();
                let that = this;
                $.ajax({
                    url: "/api/camera/getPeopleGB4Hour.do",
                    async: false,
                    dataType: "json"
                }).done(function (result) {
                    if (result.errCode === 0) {
                        that.timeNumX = result.obj.xAxis;
                        that.timeNumData = result.obj.data;
                    }
                });
                this.chart.setOption({
                    title: {
                        text: '各时间点进场人数统计',
                        x:'center'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        }
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: this.timeNumX,
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
                            name: '人数',
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
                        name: '人数',
                        type: 'line',
                        radius: '80%',
                        center: ['50%', '50%'],
                        avoidLabelOverlap: false, //是否启用防止标签重叠策略
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        data: this.timeNumData
                    }]
                });
                this.chart.hideLoading()
            },

            //本园服务各年龄段人数统计
            allAgesChart(id) {
                this.chart = echarts.init(document.getElementById(id));
                this.chart.showLoading();
                var that = this;
                $.ajax({
                    url: "/api/camera/getAgeGBSex.do",
                    async: false,
                    dataType: "json"
                }).done(function (result) {
                    if (result.errCode === 0) {
                        that.ageGroup = result.obj.xAxis;
                        that.manData = result.obj.dataMan;
                        that.womenData = result.obj.dataWoman;
                    }
                });
                this.chart.setOption({
                    title: {
                        text: '本园服务各年龄段人数统计',
                        x:'center'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category', //类目轴
                            data: this.ageGroup,
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
                            axisTick: {
                                show: false
                            }
                        }
                    ],
                    series: [{
                        name: '年龄',
                        type: 'bar',
                        stack: '男',
                        itemStyle: {
                            normal: {
                                color: '#e66740',
                                barBorderRadius: [4, 4, 0, 0]
                            }
                        },
                        data: this.manData
                    },{
                        name: '年龄',
                        type: 'bar',
                        stack: '女',
                        itemStyle: {
                            normal: {
                                color: '#00b0d9',
                                barBorderRadius: [4, 4, 0, 0]
                            }
                        },
                        data: this.womenData
                    }]
                });
                this.chart.hideLoading()
            },

            //本园服务人群体型分布饼图
            CrowdSizeChart(id) {
                this.chart = echarts.init(document.getElementById(id));
                this.chart.showLoading();
                let that = this;
                $.ajax({
                    url: "/api/camera/getPeopleGBShape.do",
                    async: false,
                    dataType: "json"
                }).done(function (result) {
                    if (result.errCode === 0) {
                        that.peopleShape = result.obj;
                    }
                });
                this.chart.setOption({
                    title: {
                        text: '本园服务人群体型分布',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    //color: ['#2bd195', '#51bee3'],
                    series: [{
                        name: '体型',
                        type: 'pie',
                        radius : '60%',
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        data: this.peopleShape
                    }]
                });
                this.chart.hideLoading()
            },

            onPageLoad: function(dataList) {
                this.dataList = dataList;
                this.videoUrl = dataList[0].camUrl;
            }
        },
        created: function () {

        },
        mounted() {
            this.$nextTick(function () {
                this.stayTimeChart('j_stayTimeChart');
                this.timePointsChart('j_timePointsChart');
                this.allAgesChart('j_allAgesChart');
                this.CrowdSizeChart('j_CrowdSizeChart');
            });
        }
    }
</script>