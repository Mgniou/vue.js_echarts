<template>
    <div class="page-header-top">
        <div class="container headerBox">
            <div class="weather" id="scrollBox">
                <marquee id="affiche" align="left" behavior="scroll" height="30" direction="left" scrollamount="3" scrolldelay="0" onMouseOut="this.start()" onMouseOver="this.stop()">
                    <div id="scrollBegin">
                        <p>{{obj.regionName}}</p>
                        <p>{{obj.temperature}}&#8451;</p>
                        <p>{{obj.todayInfo}}</p>
                    </div>
                </marquee>
            </div>

            <div class="time">{{currTime}}</div>

            <div class="weather">
                <p class="pull-right">{{currWeek}}</p>
                <p class="pull-right">（{{currLanur}}）</p>
                <p class="pull-right">{{currDate}}</p>

            </div>
        </div>
    </div>
</template>

<script>
    import base from 'commonjs/base.js';
    import cnDate from 'commonjs/cnDate.js';

    module.exports = {
        computed: {

        },
        data: function () {
            return {
                currTime: '',  //当前时间
                currDate: '',  //当前日期
                currLanur: '', //当前农历
                currWeek: '',  //当前周数
                obj: {}
            }
        },
        methods: {
            weatherInfo: function () {
                let that = this;
                $.ajax({
                    url: "/api/weather/getLatestWeatherData.do",
                    dataType: "json"
                }).done(function (result) {
                    if (result.errCode === 0) {
                        that.obj = result.obj;
                    }
                });
            },

            getCnDate: function () {
                let d = new Date();
                let yy = d.getFullYear();
                let mm = d.getMonth() + 1;
                let dd = d.getDate();
                this.currLanur = cnDate.getDate(yy, mm, dd)
            }
        },
        created: function () {
            let _this = this;
            setInterval(function () {
                function para(s) {
                    return s < 10 ? '0' + s: s;
                }
                let myDate=new Date();
                let str1 = para(myDate.getHours()) + ':';
                str1 += para(myDate.getMinutes());
                _this.currTime = str1;

                let str2 = myDate.getFullYear() + "年";
                str2 += (myDate.getMonth()+1) + "月";
                str2 += myDate.getDate() + "日";
                _this.currDate = str2;


                switch (myDate.getDay()) {
                    case 1:
                        _this.currWeek = "星期一";
                        break;
                    case 2:
                        _this.currWeek = "星期二";
                        break;
                    case 3:
                        _this.currWeek = "星期三";
                        break;
                    case 4:
                        _this.currWeek = "星期四";
                        break;
                    case 5:
                        _this.currWeek = "星期五";
                        break;
                    case 6:
                        _this.currWeek = "星期六";
                        break;
                    default:
                        _this.currWeek = "星期天";
                }
            }, 1000);
            _this.weatherInfo();
        },
        mounted() {
            this.getCnDate();
        }
    };
</script>