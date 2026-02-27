/**
 * @author xiu
 * @date 2023/8/22
 */
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.model.Order',
    'CGP.country.store.CountryStore',
    'CGP.common.commoncomp.AddressBookForm'
])
Ext.define('CGP.orderstatusmodify.view.orderitemsmultipleaddress.controller.Controller', {
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
                    console.log(data);
                }
            }
        }, true);
    },

    //异步修改存在加载动画
    asyncEditQuery: function (url, jsonData, isEdit, callFn, successMsg) {
        var method = isEdit ? 'PUT' : 'POST';

        JSAjaxRequest(url, method, true, jsonData, successMsg || false, callFn, true, {timeout: 600000});
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

    loadOrderData: function (orderId, form) {
        var result = [];
        JSAjaxRequest(adminPath + 'api/orders/' + orderId + '/v2', "GET", false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    var model = new CGP.orderstatusmodify.view.orderitemsmultipleaddress.model.Order(responseText.data);
                    result = model
                }
            }
        })
        return result;
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

    //获取url
    getUrl: function (author) {
        var urlGather = {
            mainUrl: adminPath + 'api/colors',

        }
        return urlGather[author];
    },

    // 获取状态名
    getStatusName: function (record) {
        var result = null,
            shipmentOrder = record.get('shipmentOrder');

        if (shipmentOrder) {
            var {status} = shipmentOrder,
                {frontendName, id} = status;
            if (id === 101) {
                frontendName = '待装箱'
            }

            result = {
                name: i18n.getKey(frontendName),
                id: id
            };
        } else {
            result = {
                name: '已生产',
                id: null
            };
        }

        return result;
    },

    // 修改收件人地址
    editReceiverAddress: function (value, callFn) {
        var controller = this;
        Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            width: 800,
            title: i18n.getKey('修改收件人地址'),
            diySetValue: function (data) {
                var me = this,
                    form = me.getComponent('form'),
                    items = form.items.items;
                items.forEach(item => {
                    var {name} = item;
                    item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name]);
                })
            },
            diyGetValue: function () {
                var result = {},
                    me = this,
                    form = me.getComponent('form'),
                    items = form.items.items;
                items.forEach(item => {
                    var {name} = item;
                    result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                })
                return result;
            },
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 10 25',
                    },
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'address_book_form',
                            width: '100%',
                            border: false,
                            layout: {
                                type: 'table',
                                columns: 2
                            },
                            bodyStyle: {},
                            itemId: 'addressBook',
                            name: 'addressBook',
                            listeners: {
                                afterrender: function () {
                                    var form = this;
                                    form.getComponent('sortOrder').hide();
                                }
                            }

                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'shipmentOrderId',
                            name: 'shipmentOrderId',
                            fieldLabel: i18n.getKey('shipmentOrderId'),
                            hidden: true
                        },
                        {

                            itemId: 'shipMethod',
                            name: 'shipMethod',
                            allowScroll: true,
                            fieldLabel: i18n.getKey('shipMethod')
                        },
                        {
                            xtype: 'combo',
                            labelWidth: 80,
                            width: 290,
                            margin: '0 25 10 50',
                            labelAlign: 'right',
                            fieldLabel: i18n.getKey('发货方式'),
                            name: 'shipMethod',
                            itemId: 'shipMethod',
                            valueField: 'code',
                            displayField: 'code',
                            editable: false,
                            msgTarget: 'side',
                            allowBlank: false,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['id', 'code'],
                                proxy: {
                                    type: 'uxrest',
                                    url: adminPath + 'api/shippingModules?websiteId=11&page=1&limit=1000',
                                    reader: {
                                        type: 'json',
                                        root: 'data'
                                    }
                                }
                            }),
                        },
                    ],
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            formData = win.diyGetValue(),
                            url = adminPath + 'api/shipmentOrders/modify/address';

                        if (form.isValid()) {
                            controller.asyncEditQuery(url, formData, true, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        Ext.Msg.alert('提示', '修改成功', function () {
                                            callFn(formData);
                                            win.close();
                                        })
                                    }
                                }
                            }, false);
                        }
                    }
                }
            },
            listeners: {
                afterrender: function (comp) {
                    value && comp.diySetValue(value);
                }
            }
        }).show();
    },

    // 修改发货要求地址
    editShipmentRequirementAddress: function (shipmentRequirementId, callFn) {
        var controller = this;
        Ext.create('Ext.window.Window', {
            layout: 'fit',
            modal: true,
            constrain: true,
            queryData: null,
            width: 800,
            title: i18n.getKey('修改收件人地址'),
            diySetValue: function (data) {
                var me = this,
                    form = me.getComponent('form'),
                    items = form.items.items;

                items.forEach(item => {
                    var {name} = item;
                    item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name]);
                })
            },
            diyGetValue: function () {
                var result = {},
                    me = this,
                    form = me.getComponent('form'),
                    items = form.items.items;
                items.forEach(item => {
                    var {name} = item;
                    result[name] = item.diyGetValue ? item.diyGetValue() : item.getValue();
                })
                return result;
            },
            items: [
                {
                    xtype: 'errorstrickform',
                    itemId: 'form',
                    defaults: {
                        margin: '10 25 10 25',
                    },
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'address_book_form',
                            width: '100%',
                            border: false,
                            layout: {
                                type: 'table',
                                columns: 2
                            },
                            bodyStyle: {},
                            itemId: 'addressBook',
                            name: 'addressBook',
                            listeners: {
                                afterrender: function () {
                                    var form = this;
                                    form.getComponent('sortOrder').hide();
                                }
                            }

                        },
                        {
                            xtype: 'numberfield',
                            itemId: 'shipmentOrderId',
                            name: 'shipmentOrderId',
                            fieldLabel: i18n.getKey('shipmentOrderId'),
                            hidden: true
                        },
                        {

                            itemId: 'shipMethod',
                            name: 'shipMethod',
                            allowScroll: true,
                            fieldLabel: i18n.getKey('shipMethod')
                        },
                        {
                            xtype: 'combo',
                            labelWidth: 80,
                            width: 290,
                            margin: '0 25 10 50',
                            labelAlign: 'right',
                            fieldLabel: i18n.getKey('发货方式'),
                            name: 'shipMethod',
                            itemId: 'shipMethod',
                            valueField: 'code',
                            displayField: 'code',
                            editable: false,
                            msgTarget: 'side',
                            allowBlank: false,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['id', 'code'],
                                proxy: {
                                    type: 'uxrest',
                                    url: adminPath + 'api/shippingModules?websiteId=11&page=1&limit=1000',
                                    reader: {
                                        type: 'json',
                                        root: 'data'
                                    }
                                }
                            }),
                        },
                    ],
                },
            ],
            bbar: {
                xtype: 'bottomtoolbar',
                saveBtnCfg: {
                    getFilterObjectKey: function (data, object) {
                        data.forEach(item => {
                            Object.keys(object).forEach(key => {
                                if (item === key) {
                                    delete object[key];
                                }
                            })
                        })
                        return object;
                    },
                    getItemsResult: function (data) {
                        var result = [];
                        data.forEach(item => {
                            var {orderItem, qty} = item,
                                {_id} = orderItem;

                            result.push({
                                "orderItem": {
                                    "_id": _id,
                                    "clazz": "com.qpp.cgp.domain.order.OrderLineItem"
                                },
                                "qty": qty,
                                "maxValue": qty,
                                "clazz": "com.qpp.cgp.domain.shipment.ShipmentRequirementItem"
                            })
                        })
                        return result;
                    },
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt,
                            form = win.getComponent('form'),
                            formData = win.diyGetValue(),
                            {addressBook, shipMethod, shipmentOrderId} = formData,
                            url = adminPath + 'api/shipmentRequirements/' + shipmentRequirementId,
                            {queryData} = win,
                            filterKey = ['createdBy', 'createdDate', 'modifiedBy', 'modifiedDate'],
                            newData = {
                                address: addressBook,
                                shipmentMethod: shipMethod,
                            },
                            newQueryData = btn.getFilterObjectKey(filterKey, queryData),
                            result = Ext.Object.merge(newQueryData, newData),
                            {items} = result

                        result['items'] = btn.getItemsResult(items);

                        if (form.isValid()) {
                            controller.asyncEditQuery(url, result, true, function (require, success, response) {
                                if (success) {
                                    var responseText = Ext.JSON.decode(response.responseText);
                                    if (responseText.success) {
                                        Ext.Msg.alert('提示', '修改成功', function () {
                                            callFn(formData);
                                            win.close();
                                        })
                                    }
                                }
                            }, false);
                        }
                    }
                }
            },
            listeners: {
                afterrender: function (comp) {
                    var url = adminPath + 'api/shipmentRequirements/' + shipmentRequirementId,
                        data = controller.getQuery(url);

                    comp.queryData = data;

                    if (data) {
                        var {address, shipmentMethod} = data,
                            result = {
                                "shipmentOrderId": shipmentRequirementId,
                                "addressBook": address,
                                "shipMethod": shipmentMethod
                            }

                        comp.diySetValue(result);
                    }
                }
            }
        }).show();
    },

    // 获取时间格式
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
    }
})