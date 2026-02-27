/**
 * @author xiu
 * @date 2022/10/25
 */
Ext.syncRequire([
    'CGP.common.typesettingschedule.view.ImpressionFieldSet',
])
Ext.define('CGP.common.typesettingschedule.controller.Controller', {
    count: 1,

    //修改
    editQuery: function (url, jsonData, isEdit) {
        var data = [],
            method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequest(url, method, true, jsonData, successMsg, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText.data.content || responseText.data;
                }
            }
        }, true);
    },

    //异步修改存在加载动画
    asyncEditQuery: function (url, jsonData, isEdit, callFn, successMsg) {
        var method = isEdit ? 'PUT' : 'POST';

        JSAjaxRequest(url, method, true, jsonData, successMsg, callFn, true);
    },

    //查询
    getQuery: function (url) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText.data.content || responseText.data;
                }
            }
        })
        return data;
    },

    //删除
    deleteQuery: function (url) {
        JSAjaxRequest(url, 'DELETE', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    console.log(responseText.data.content || responseText.data);
                }
            }
        }, true)
    },

    /**
     * 获取Stage的状态与信息
     * @param status 数据状态
     * */
    getStageStatusInfo(status) {
        var info = {};
        var statusGather = {
            FINISHED: 1,
            FAILURE: 0,
            RUNNING: -2,
            WAITING: -1
        };
        var IsStatus = statusGather[status];
        info['isSuccess'] = status;
        info['isStatus'] = IsStatus;
        return info;
    },

    /**
     * 获取请求Job项信息
     * @param count job项标识符
     * @param id 请求id
     * @param orderItemId 订单项id
     * @param callback 回调函数
     */
    getQueryJobItemInfo: function (count, id, orderItemId, callback) {
        var url, data;
        var countGether = {
            0: function () {
                return 'pages?orderItemId=' + orderItemId + '&jobConfigId=' + id;
            },
            1: function () {
                return 'impressions?jobTaskId=' + id;
            },
            2: function () {
                return 'distributions?jobTaskId=' + id;
            }
        }
        url = composingPath + 'composing/result/' + countGether[count]();
        JSAjaxRequest(url, 'GET', true, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText['data'];
                    callback(data);
                }
            }
        });
        return data;
    },

    /**
     * 转换时间格式
     * @param time 时间
     */
    getEndTime: function (time) {
        if (!time) {
            return '未查询到信息 '
        }
        return Ext.Date.format(new Date(+time), 'Y-m-d G:i:s')
    },

    /**
     * 获取状态信息
     * @param data 数据
     */
    getDataStatus: function (data) {
        return data['stageStatus'];
    },

    /**
     * 获取并计算进度值
     * @param value 进度
     */
    getScheduleValue: function (value) {
        var schedule = 0;
        value && (schedule = value);
        value === 100 && (schedule = 99);
        return schedule;
    },

    /**
     * 获取错误信息
     * @param data 数据
     */
    getErrorMessage: function (data) {
        var controller = this;
        if (data) {
            var relatedInfo = [];
            var errorInfo = '未查询到信息';
            var datas = data['datas'];
            var exception = datas['exception'] ? datas['exception'] : null;
            exception && exception['errorParams'] && (errorInfo = datas['exception']['errorParams']['message']);
            (exception && !exception['errorParams']) && (errorInfo = exception['message']);
            for (var item in datas) {
                (item !== 'exception') && relatedInfo.push({title: item, value: datas[item]});
            }
            return JSCreateHTMLTable([
                {
                    title: i18n.getKey('失败时间'),
                    value: controller.getEndTime(data['endTime'])
                },
                {
                    title: i18n.getKey('错误信息'),
                    value: errorInfo
                },
                {
                    title: i18n.getKey('相关参数'),
                    value: JSCreateHTMLTable(relatedInfo)
                }
            ], 'center',60)
        }
    },

    /**
     * 获取字符串格式
     * @color string 字体颜色
     * @isBold boolean 是否加粗
     * @text string 文本
     * @fontSize number 文本大小
     */
    getTitleBold: function (color, isBold, text, fontSize = 15) {
        var bold = isBold ? 'bold' : 'none';
        return "<font style= 'font-size:" + fontSize + "px;color:" + color + ";font-weight:" + bold + "'>" + text + '</font>'
    },

    // 获取总数
    getTotalCount: function (url) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText.data.totalCount;
                }
            }
        })
        return data;
    },

    // 获取生产基地
    getManufactureCenterText: function (code) {
        var result = {
                text: '',
                color: '',
                btnBackgroundColor: []
            },
            newCode = code || 'PL0001';
        if (newCode) {
            var manufactureCenterGather = {
                PL0003: {
                    text: '越南',
                    color: 'green',
                    btnBackgroundColor: ['#4caf50', '#43a047', '#388e3c', '#43a047'],
                },
                PL0002: {
                    text: '美国',
                    color: 'orange',
                    btnBackgroundColor: ['#4b9cd7', '#3892d3', '#358ac8', '#3892d3'],
                },
                PL0001: {
                    text: '东莞',
                    color: '#358ac8',
                    btnBackgroundColor: ['#4b9cd7', '#3892d3', '#358ac8', '#3892d3'],
                }
            }

            result = manufactureCenterGather[newCode];
        }
        return result;
    },
})