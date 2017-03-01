<template>
    <div class="row" v-show="getPermission({type: 'or', values: ['getAgeGBSex']})">
        <div class="rowTitle">
            天气监测
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="weatherInfo">
                    <p class="adress"><span>{{obj.regionName}}</span>，<span>{{obj.parkName}}</span></p>
                    <p class="pm"><img src="./img/pm.png" alt=""><span>{{obj.pm25}} {{obj.pm25Info}}</span></p>
                    <p class="temper"><span class="lagerSpan">{{obj.temperature}}&#8451;</span><span>{{obj.wheather}}</span></p>
                    <p class="pm"><span style="margin: 0 32px 0 0">湿度 {{obj.humidity}}</span><span>{{obj.wind}} {{obj.wStrength}}级</span></p>
                </div>
                <div class="weatherTrend pull-left" id="j_weatherTrendChart"></div>
            </div>
            <div class="weatherLine pull-left col-md-6" id="j_weatherLineChart"></div>
        </div>
        <div class="row">
            <div class="col-md-6">
                <div class="lifeIndex">
                    <p class="lifeTitle">生活指数</p>
                    <ul>
                        <li v-for="value in lifeInfo">
                            <p>{{value.title}}</p>
                            <p class="indexNum">{{value.value}}</p>
                            <p class="indexInfo">{{value.info}}</p>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="pull-left col-md-6" id="j_localWeatherChart"></div>
        </div>
        <div class="row">
            <div class="checkMore" style="margin: 40px auto 10px"><a href="./wifi.html">查看更多<i class="fa fa-angle-right"></i></a></div>
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
                chart1X: [],
                chart1D: [],
                chart2X: [],
                chart2D: [],
                chart3X: [],
                humidityData: [],
                temperatureData: [],
                lifeInfo: {},
                obj: {}

            }
        },
        computed: {},
        methods: {
            //权限管理
            getPermission: function (v) {
                let user = this.store.user,
                    privileges = this.store.privileges,
                    perS = base.checkPermission(user, privileges, v.values, v.type);
                return perS;
            },

            //获取天气简报和生活指数
            weatherData: function () {
                let that = this;
                $.ajax({
                 url: "/api/weather/getLatestWeatherData.do",
                 dataType: "json"
                 }).done(function (result) {
                    if (result.errCode === 0) {
                        that.obj = result.obj;
                        that.lifeInfo = result.obj.lifeInfo;
                    }
                 });
            },

            //

            //天气走势折线图
            weatherTrendChart(id) {
                // 绘图方法
                this.chart = echarts.init(document.getElementById(id));
                // 皮肤添加同一般使用方式
                this.chart.showLoading();
                // 返回到data中
                let that = this;
                $.ajax({
                    url: "/api/weather/getWeatherInfoGB4Hour.do",
                    async: false,
                    dataType: "json"
                }).done(function (result) {
                    if (result.errCode === 0) {

                        that.chart1X = result.obj.xAxis;
                        that.chart1D = result.obj.data;
                    }
                });
                this.chart.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            animation: false
                        }
                    },
                    grid: {
                       x: 30
                    },
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: this.chart1X,
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
                            name: '温度',
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
                        name: '温度',
                        type: 'line',
                        center: ['0', '0'],
                        avoidLabelOverlap: false, //是否启用防止标签重叠策略
                        label: {
                            normal: {
                                show: false
                            }
                        },

                        //roseType: 'radius', //是否展示成南丁格尔图，通过半径区分数据大小
                        data: this.chart1D
                    }]
                });
                this.chart.hideLoading()
            },

            //整点天气实况柱状图图
            weatherLineChart(id) {
                // 绘图方法
                this.chart = echarts.init(document.getElementById(id));
                // 皮肤添加同一般使用方式
                this.chart.showLoading();
                // 返回到data中
                let that = this;
                $.ajax({
                    url: "/api/weather/getWeatherInfoGBHour.do",
                    async: false,
                    dataType: "json"
                }).done(function (result) {
                    if (result.errCode === 0) {

                        that.chart2X = result.obj.xAxis;
                        that.chart2D = result.obj.data;
                    }
                });
                this.chart.setOption({
                    title: {
                        text: '整点天气实况',
                        x: 'center'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category', //类目轴
                            data: that.chart2X,
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
                            name: '温度',
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
                        name: '温度',
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                color: '#51bee3',
                                barBorderRadius: [4, 4, 0, 0]
                            }
                        },
                        data: that.chart2D,
                    }]
                });
                this.chart.hideLoading()
            },

            //本园区历史天气走势折线图
            localWeatherChart(id) {
                // 绘图方法
                this.chart = echarts.init(document.getElementById(id));
                // 皮肤添加同一般使用方式
                this.chart.showLoading();
                // 返回到data中
                var that = this;
                $.ajax({
                    url: "/api/weather/getWeatherInfoGBDay.do",
                    async: false,
                    dataType: "json"
                }).done(function (result) {
                    if (result.errCode === 0) {
                        that.chart3X = result.obj.xAxis;
                        that.humidityData = result.obj.humidityData;
                        that.temperatureData = result.obj.temperatureData;
                    }
                });
                this.chart.setOption({
                    title: {
                        text: '本园区历史天气走势图',
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
                        data:['PV','UV'],
                        x: 'right'
                    },
                    dataZoom: [
                        {
                            show: true,
                            realtime: true,
                            start: 0
                        },
                        {
                            type: 'inside',
                            realtime: true,
                            start: 65,
                            end: 85
                        }
                    ],
                    xAxis: [
                        {
                            type: 'category',
                            boundaryGap: false,
                            data: this.chart3X,
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
                            name: '人数(人/h)',
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
                        name: 'PV',
                        type: 'line',
                        radius: '80%',
                        center: ['50%', '50%'],
                        avoidLabelOverlap: false, //是否启用防止标签重叠策略
                        label: {
                            normal: {
                                show: false
                            }
                        },
                        data: this.humidityData
                    },
                        {
                            name: 'UV',
                            type: 'line',
                            radius: '80%',
                            center: ['50%', '50%'],
                            avoidLabelOverlap: false, //是否启用防止标签重叠策略
                            label: {
                                normal: {
                                    show: false
                                }
                            },
                            data: this.temperatureData
                        }]
                });
                this.chart.hideLoading()
            },
        },
        created: function () {
            this.weatherData();
        },
        mounted() {
            this.$nextTick(function () {
                this.weatherTrendChart('j_weatherTrendChart');
                this.weatherLineChart('j_weatherLineChart');
                this.localWeatherChart('j_localWeatherChart');
            })
        }
    }
</script>