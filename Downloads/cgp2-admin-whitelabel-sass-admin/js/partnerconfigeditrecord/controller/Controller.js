/**
 * @author xiu
 * @date 2024/5/31
 */
Ext.Loader.syncRequire([
    'CGP.partnerconfigeditrecord.store.PartnerconfigeditrecordStore',
])
Ext.define('CGP.partnerconfigeditrecord.controller.Controller', {
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

    createOrderingConfigRecord: function (id) {
        const controller = this,
            store = Ext.create('CGP.partnerconfigeditrecord.store.PartnerconfigeditrecordStore', {
                params: {
                    partnerId: id
                }
            });
        Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            width: 900,
            maxHeight: 700,
            autoScroll: true,
            title: i18n.getKey('拼单配置修改记录'),
            items: [
                {
                    xtype: 'grid',
                    name: 'grid',
                    itemId: 'grid',
                    store: store,
                    columns: [
                        {
                            xtype: 'rownumberer',
                            width: 45,
                            text: i18n.getKey('序号'),
                        },
                        {
                            text: i18n.getKey('修改时间'),
                            width: 150,
                            dataIndex: 'createdDate',
                            sortable: true,
                            renderer: function (value, metaData, record) {
                                var time = new Date(controller.convertToZeroTimeZone(value)).getTime();
                                return controller.getEndTime(time);
                            }
                        },
                        {
                            text: i18n.getKey('拼单类型'),
                            width: 150,
                            dataIndex: 'type',
                            sortable: true,
                            renderer: function (value, metaData, record) {
                                var valueGather = {
                                        PERIOD: {
                                            color: 'green',
                                            text: '自动拼单',
                                        },
                                        DIRECT: {
                                            color: 'green',
                                            text: '直接下单',
                                        },
                                        MANUAL: {
                                            color: 'green',
                                            text: '手动拼单',
                                        }
                                    },
                                    {color, text} = valueGather[value];

                                return JSCreateFont(color, true, text);
                            }
                        },
                        {
                            text: i18n.getKey('修改用户'),
                            width: 150,
                            dataIndex: 'createdBy',
                            sortable: true
                        },
                        {
                            text: i18n.getKey('配置详情'),
                            flex: 1,
                            dataIndex: '_id',
                            sortable: false,
                            renderer: function (value, metaData, record) {
                                const type = record.get('type'),
                                    startDate = record.get('startDate'),
                                    intervalDays = record.get('intervalDays');
                                if (type === 'PERIOD') {
                                    const result = [
                                        {
                                            title: i18n.getKey('拼单周期'),
                                            value: intervalDays + ' 天'
                                        },
                                        {
                                            title: i18n.getKey('拼单起效时间'),
                                            value: startDate
                                        }
                                    ]
                                    return JSCreateHTMLTable(result);
                                }
                            }
                        },
                    ],
                    bbar: {
                        xtype: 'pagingtoolbar',
                        store: store,
                        displayInfo: true, // 是否 ? 示， 分 ? 信息
                        displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                        emptyText: i18n.getKey('noDat')
                    }
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