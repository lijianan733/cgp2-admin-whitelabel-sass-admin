/**
 * @author xiu
 * @date 2024/5/31
 */
Ext.define('CGP.orderinghistoryrecord.controller.Controller', {
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
    asyncEditQuery: function (url, jsonData, isEdit, callFn, hideMsg, attributeVersionId) {
        var method = isEdit ? 'PUT' : 'POST',
            successMsg = method === 'POST' ? 'addsuccessful' : 'saveSuccess';


        JSAjaxRequest(url, method, true, jsonData, !hideMsg && successMsg, callFn, true, attributeVersionId);
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

    // 将东八区时间转为时间戳
    convertToZeroTimeZone: function (dateTimeString) {
        const dateTime = new Date(dateTimeString); // 将时间字符串转换为 Date 对象
        return dateTime.toISOString();
    },

    getFailureInfo: function (code) {
        const textGather = {
            300518: '下单item为空,空id数组',
            300591: '不支持的拼单类型,仅支持零售订单',
            300590: '计重单位错误',
            300583: '匿名用户网站代码不能为空！',
            300581: 'user绑定的website不存在',
            3005822: '订单项已经拼单',
            300720: '获取登录信息失败',
            300584: '计算价格Price为空',
            300585: '不合法的价格信息',
            300586: '价格信息的金额数值为空！',
            300587: '货币信息为空！',
            300517: '不支持此运输方式',
            712312: 'vat的countryCode校验不通过',
            1500013: '稅地址校验失败',
            1500014: '地址校驗超時',
            1500015: '地址校验失败',
            400510: '支付结果返回值为空，支付失败',
            400511: '拼单下单结果为空，下单失败',
            400512: '拼单下单的orderNumber或者orderId为空',
            400513: '不支持此自动拼单策略',
            500240: '创建PayPa1结算单失败',
            400514: 'partner没有配置免密支付',
            500241: '支付异常该账号授权无效',
            30000020: '产品不存在或者未激活',
            400515: '当前没有可拼单的店铺零售订单',
        }
        return textGather[code] || '';
    },

    createOrderingConfigRecord: function (data) {
        const controller = this;
        Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            width: 700,
            maxHeight: 700,
            title: i18n.getKey('拼单配置修改记录'),
            items: [
                {
                    xtype: 'grid',
                    name: 'grid',
                    itemId: 'grid',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {
                                name: 'partnerOrderNumber',
                                type: 'string',
                            },
                            {
                                name: 'success',
                                type: 'boolean',
                            },
                            {
                                name: 'failureStage',
                                type: 'object',
                            },
                            {
                                name: 'failureInfo',
                                type: 'object',
                            },
                        ],
                        proxy: {
                            type: 'memory'
                        },
                        data: data
                    }),
                    columns: [
                        {
                            xtype: 'rownumberer',
                            width: 45,
                            text: i18n.getKey('序号'),
                        },
                        {
                            text: i18n.getKey('status'),
                            width: 100,
                            dataIndex: 'success',
                            sortable: true,
                            renderer: function (value, metaData, record) {
                                var valueGather = {
                                        true: {
                                            color: 'green',
                                            text: '成功',
                                        },
                                        false: {
                                            color: 'red',
                                            text: '失败',
                                        }
                                    },
                                    {color, text} = valueGather[value];

                                return JSCreateFont(color, true, text);
                            }
                        },
                        {
                            xtype: 'atagcolumn',
                            text: i18n.getKey('订单号'),
                            width: 150,
                            dataIndex: 'partnerOrderNumber',
                            sortable: true,
                            getDisplayName: function (value) {
                                return '<a href="#">' + value + '</a>'
                            },
                            clickHandler: function (value, metadata, record) {
                                JSOpen({
                                    id: 'page',
                                    url: path + "partials/order/order.html?orderNumber=" + value,
                                    title: '订单 所有订单',
                                    refresh: true
                                });
                            },
                        },
                        {
                            xtype: 'atagcolumn',
                            text: i18n.getKey('操作'),
                            width: 100,
                            dataIndex: 'partnerOrderNumber',
                            sortable: true,
                            getDisplayName: function (value, metadata, record) {
                                return value ? '<a href="#">' + i18n.getKey('查看拼单信息') + '</a>' : '';
                            },
                            clickHandler: function (value, metadata, record) {
                                var partnerOrderNumber = record.get('partnerOrderNumber'),
                                    url = adminPath + 'api/bulkOrderSubmitRecord/' + partnerOrderNumber + '?page=1&limit=1000',
                                    title = '拼单信息',
                                    orderInfo = controller.getQuery(url);
                                JSShowJsonDataV2(orderInfo, title);
                            },
                        },
                        {
                            text: i18n.getKey('错误信息'),
                            flex: 1,
                            dataIndex: 'failureInfo',
                            renderer: function (value, metaData, record) {
                                var {code, message} = value,
                                    errorInfo = message || '其他错误信息',
                                    result = controller.getFailureInfo(code) || JSAutoWordWrapStr(errorInfo)

                                metaData.tdAttr = 'data-qtip="' + "<div>"+result+"</div>"+ '"';
                                
                                return result;
                            }
                        },
                    ],
                }
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    hidden: true
                },
                cancelBtnCfg: {
                    text: i18n.getKey('确认'),
                    iconCls: 'icon_agree',
                }
            },
        }).show();
    }
})
