/**
 * @author xiu
 * @date 2025/1/21
 */
Ext.define('CGP.extraorderreportforms.controller.Controller', {
    id: JSGetQueryString('id'),

    //修改
    editQuery: function (url, jsonData, isEdit, attributeVersionId) {
        var data = [],
            method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequest(url, method, false, jsonData, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, true, attributeVersionId);
        return data
    },

    //查询
    getQuery: function (url, attributeVersionId) {
        var data = [];

        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, false, attributeVersionId);
        return data;
    },

    //删除
    deleteQuery: function (url, store) {
        JSAjaxRequest(url, 'DELETE', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    store && store.load();
                }
            }
        }, true)
    },

    //获取url
    getUrl: function (author, params) {
        const id = params?.id;
        var urlGather = {
            mainUrl: 'api/colors',
            addPart: 'addPart',
            deletePart: 'deletePart',
            selectPart: 'selectPart' + id,
            deletePartGrid: 'deletePartGrid' + id
        }
        return adminPath + urlGather[author];
    },

    //异步修改存在加载动画
    asyncEditQuery: function (url, jsonData, isEdit, callFn, Msg, attributeVersionId) {
        var method = isEdit ? 'PUT' : 'POST';

        JSAjaxRequest(url, method, true, jsonData, Msg, callFn, true, attributeVersionId);
    },

    // 过滤属性版本的get请求
    getAttributeVersionQuery: function (url, attributeVersionId) {
        var data = [];

        JSAjaxRequestForAttributeVersion(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, false, attributeVersionId);
        return data;
    },

    // 过滤属性版本的edit请求
    editAttributeVersionQuery: function (url, jsonData, isEdit, attributeVersionId) {
        var data = [],
            method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';

        JSAjaxRequestForAttributeVersion(url, method, false, jsonData, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    data = responseText?.data?.content || responseText?.data;
                }
            }
        }, true, attributeVersionId);
        return data
    },

    // 过滤属性版本的edit请求
    asyncEditAttributeVersionQuery: function (url, jsonData, isEdit, callFn, hideMsg, attributeVersionId) {
        var method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';


        JSAjaxRequestForAttributeVersion(url, method, true, jsonData, !hideMsg && successMsg, callFn, true, attributeVersionId);
    },

    // 获取过滤栏样式
    getFiltersType: function (jsonData, isColumnsText) {
        var controller = this,
            result = [],
            newComboArray = [];

        jsonData.forEach(item => {
            var {text, type, name, comboArray} = item,
                filterTypeGather = {
                    // string
                    string: {
                        xtype: 'textfield',
                        name: name || text,
                        itemId: name || text,
                        isLike: false,
                        labelWidth: 120,
                        fieldLabel: i18n.getKey(text),
                    },
                    // number
                    number: {
                        xtype: 'numberfield',
                        name: name || text,
                        itemId: name || text,
                        isLike: false,
                        decimalPrecision: 12,
                        fieldLabel: i18n.getKey(text),
                    },
                    // 文本
                    text: {
                        xtype: 'textfield',
                        name: name || text,
                        itemId: name || text,
                        isLike: false,
                        fieldLabel: i18n.getKey(text),
                    },
                    // 时间
                    date: {
                        xtype: 'daterange',
                        style: 'margin-right:50px; margin-top : 0px',
                        name: name || text,
                        itemId: name || text,
                        fieldLabel: i18n.getKey(text),
                        width: 360,
                        isLike: true,
                        scope: true,
                        editable: false,
                        haveReset: true,
                        format: 'Y/m/d',
                        submitFormat: 'Y/m/d',
                        valueType: 'formatDateTime'
                    },
                    // 月份
                    month: {
                        xtype: 'datefield',
                        style: 'margin-right:50px; margin-top : 0px;',
                        name: name || text,
                        itemId: name || text,
                        scope: true,
                        fieldLabel: i18n.getKey(text),
                        width: 360,
                        editable: false,
                        format: 'Y/m'
                    },
                    // 货币
                    currency: {
                        xtype: 'combo',
                        haveReset: true,
                        fieldLabel: i18n.getKey(text),
                        name: name || text,
                        itemId: name || text,
                        store: Ext.create('CGP.currency.store.Currency', {
                            params: {
                                filter: Ext.JSON.encode([
                                    {
                                        name: 'website.id',
                                        type: 'number',
                                        value: 11
                                    },
                                ])
                            },
                            pageSize: 1000,
                            autoLoad: false
                        }),
                        displayField: 'code',
                        valueField: 'code',
                    },
                    // 地区
                    state: {
                        xtype: 'combo',
                        haveReset: true,
                        fieldLabel: i18n.getKey(text),
                        name: name || text,
                        itemId: name || text,
                        store: Ext.create('CGP.zone.store.Zone', {
                            pageSize: 1000,
                            autoLoad: false
                        }),
                        displayField: 'name',
                        valueField: 'name',
                    },
                    /*// 国家
                    country: {
                        xtype: 'combo',
                        haveReset: true,
                        fieldLabel: i18n.getKey(text),
                        name: name || text,
                        itemId: name || text,
                        store: CountryStore,
                        displayField: 'name',
                        valueField: 'name',
                    },*/
                    // 类型选项
                    combo: {
                        xtype: 'combo',
                        haveReset: true,
                        name: name || text,
                        itemId: name || text,
                        isLike: false,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'display'],
                            data: newComboArray,
                            autoLoad: false
                        }),
                        valueField: 'value',
                        displayField: 'display',
                        fieldLabel: i18n.getKey(text),
                    },
                    // 出货方式
                    shippingMethod: {
                        xtype: 'combo',
                        haveReset: true,
                        fieldLabel: i18n.getKey(text),
                        name: name || text,
                        itemId: name || text,
                        store: Ext.create('CGP.deliveryorder.store.ShippingMethodStore', {
                            pageSize: 1000,
                            autoLoad: false
                        }),
                        displayField: 'name',
                        valueField: 'name',
                    },
                };

            result.push(filterTypeGather[type || 'text']);
        })

        return result;
    },

    getTimestampFromDateString: function (params, resultType) {
        var {date, type} = params,
            controller = this,
            // 根据传入的时间类型选择不同的方法转换为最易处理的时间戳
            typeGather = {
                beijingTime: new Date(date).getTime(),
                timestamp: date,
                formatDateTime: new Date(date).getTime()
            },
            timestampValue = typeGather[type],
            // 根据想要的结果类型返回结果时间
            dateGather = {
                // 转换为东八区时间
                beijingTime: function () {
                    const startDate = new Date(timestampValue);
                    startDate.setHours(startDate.getHours() + 8);
                    return startDate.toISOString().split('.')[0] + '+08:00';
                },
                // 转为时间戳
                timestamp: function () {
                    return timestampValue;
                },
                // 转为显示时间
                formatDateTime: function () {
                    return Ext.Date.format(new Date(timestampValue), 'Y-m-d G:i:s');
                },
            }

        return date ? dateGather[resultType]() : '';
    },

    getColumnsType: function (jsonData) {
        var controller = this,
            result = [];

        jsonData.forEach(item => {
            var {text, type, name, isSortable} = item,
                column = {
                    text: i18n.getKey(text),
                    dataIndex: name,
                    sortParam: name,
                    name: name,
                    width: 250,
                    height: 40,
                    align: 'center',
                    sortable: !!isSortable,
                    renderer: function (value, mateData, record) {
                        var typeGather = {
                                date: controller.getTimestampFromDateString({
                                    date: value,
                                    type: 'beijingTime'
                                }, 'formatDateTime'),
                                string: value
                            },
                            resultText = typeGather[type],
                            newText = resultText;

                        if (resultText === 'null' || !resultText || resultText === '0') {
                            newText = '';
                        }

                        mateData.tdAttr = 'data-qtip="' + resultText + '"';

                        return i18n.getKey(newText);
                    }
                }

            if (['orderNumber', 'partnerId', 'storeUrl'].includes(name)) {
                column = {
                    xtype: 'atagcolumn',
                    text: i18n.getKey(text),
                    dataIndex: name,
                    sortParam: name,
                    name: name,
                    width: name === 'storeUrl' ? 400 : 200,
                    height: 40,
                    align: 'center',
                    sortable: !!isSortable,
                    getDisplayName: function (value, metaData, record) {
                        metaData.tdAttr = 'data-qtip="' + `跳转至${name}页` + '"';
                        return JSCreateHyperLink(value);
                    },
                    clickHandler: function (value, metaData, record, rowIndex, colIndex, store, view) {
                        var nameGather = {
                                orderNumber: function () {
                                    JSOpen({
                                        id: 'page',
                                        url: path + "partials/order/order.html?orderNumber=" + value,
                                        title: '订单 所有订单',
                                        refresh: true
                                    })
                                },
                                partnerId: function () {
                                    JSOpen({
                                        id: 'partner',
                                        url: path + 'partials/partner/main.html?id=' + value,
                                        title: i18n.getKey('partner'),
                                        refresh: true
                                    })
                                },
                                storeUrl: function () {
                                    window.open(value);
                                }
                            },
                            pageAddress = nameGather[name];

                        pageAddress();
                    }
                }
            }

            result.push(column);
        })

        return result;
    },

    exportExcel: function (url, query) {
        var filter = [],
            x = new XMLHttpRequest();

        filter = Ext.encode(query);
        x.open("GET", url, true);
        x.setRequestHeader('Content-Type', 'application/json');
        x.setRequestHeader('Access-Control-Allow-Origin', '*');
        x.setRequestHeader('Authorization', 'Bearer ' + Ext.util.Cookies.get('token'));
        x.responseType = 'blob';
        x.onload = function (e) {

            const blob = new Blob([x.response], {type: x.response.type});
            var newUrl = window.URL.createObjectURL(blob),
                a = document.createElement('a');
            a.href = newUrl
            a.download = '退款申请'
            a.click()
        }
        x.send(Ext.encode({
            "filter": filter,
        }));
    },

    isCancelled: false, // 添加一个取消标志
    getAsyncTestResult: function (url, Msg, startCallBack, finishedCallBack, failedCallBack) {
        var controller = this,
            data = controller.getQuery(url),
            {status,errorMessage} = data;


        console.log(data);
        if (status) {
            var statusGather = {
                FINISHED: function () {
                    finishedCallBack && finishedCallBack(data);
                    startCallBack(false);
                },
                ERROR: function () {
                    failedCallBack && failedCallBack(errorMessage);
                    Ext.Msg.alert('提示', errorMessage);
                    startCallBack(false);
                },
                UPDATING: function () {
                    setTimeout(() => {
                        if (!controller.isCancelled) { // 检查是否已取消
                            controller.getAsyncTestResult(url, false, startCallBack, finishedCallBack, failedCallBack);
                        }
                    }, 10000);
                },
            }

            startCallBack(true);
            statusGather[status]();
        }
    }
})