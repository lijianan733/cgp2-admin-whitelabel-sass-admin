Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.model.Order',
])
Ext.define('Order.status.controller.Status', {
    extend: 'Ext.app.Controller',


    refs: [
        {
            ref: 'form',
            selector: 'orderstatus'
        },
        {
            ref: 'shipmentInfo',
            selector: 'shipmentinfo'
        }
    ],

    requires: ['Order.status.model.OrderDetail'],

    constructor: function () {

        var me = this;

        var searcher = Ext.Object.fromQueryString(document.location.search);
        var id;
        if (!Ext.isEmpty(searcher) && searcher.id) {
            me.id = searcher.id;
        }


        me.callParent(arguments);
    },

    loadOrderDetail: function () {

        var me = this,
            id = me.id;
        var form = me.getForm();
        var model = Ext.ModelManager.getModel('Order.status.model.OrderDetail');
        var lm = form.setLoading(i18n.getKey('loading'));
        Ext.Ajax.request({
            method: 'GET',
            url: adminPath + 'api/orders/' + id + '/v2',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            timeout: 3000000,
            success: function (response) {
                var r = Ext.JSON.decode(response.responseText);
                if (!r.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), r.message);
                    lm.hide();
                    return;
                } else {
                    var record = Ext.create('Order.status.model.OrderDetail', r.data);
                    form.setData(record);
                    me.record = record;
                    me.orderNumber = record.get('orderNumber');
                    lm.hide();
                }

            },
            failure: function (response) {
                var r = Ext.JSON.decode(response.responseText);
                lm.hide();
                Ext.Msg.alert(i18n.getKey('prompt'), r.message);
            }
        });
        /*model.load(id, {
            timeout: 3000000,
            success: function (record, operation) {

                if (!operation.getResultSet().success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), operation.getResultSet().message);
                }
                form.setData(record);
                me.record = record;
                me.orderNumber = record.get('orderNumber');
                lm.hide();
            },
            failure: function (record, operation) {
                lm.hide();
                Ext.Msg.alert(i18n.getKey('prompt'), operation.getError());
            }
        })*/
    },
    /**
     * 在修改为160已交收,待发货时，自动打印标签
     */
    saveStatus: function () {
        var me = this,
            id = me.id;
        var form = me.getForm();
        if (!form.getComponent('orderStatus').getSubmitValue()) {
            Ext.Msg.alert(i18n.getKey('prompt'), "选择需要修改的订单状态！");
            return;
        }

        var data = form.getData();
        var statusId = data.statusId;//目标状态
        var loadMask = form.setLoading(i18n.getKey('submiting'));
        Ext.Ajax.request({
            method: 'PUT',
            url: adminPath + 'api/orders/' + id + '/status/v1',
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            timeout: 500000,
            success: function (response, options) {
                var r = Ext.JSON.decode(response.responseText);
                if (!r.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), r.data.message);
                    loadMask.hide();
                    return;
                } else {
                    //自动打印标签
                    if (statusId == 106) {
                        var orderNumber = form.record.get('orderNumber');
                        var controller = Ext.create('CGP.order.controller.Order');
                        controller.printLabel(orderNumber);
                    }
                    if (r.code == 500099) {
                        Ext.Msg.confirm('提示', '排版审核不通过，是否跳转至订单项页面，重新上传订制文件？', callback);

                        function callback(confirmCode) {
                            if (confirmCode == 'yes') {
                                JSOpen({
                                    id: 'orderlineitempage',
                                    url: path + 'partials/orderlineitem/orderlineitem.html' +
                                        '?orderNumber=' + me.record.get('orderNumber') +
                                        '&isTest2=' + me.record.get('isTest'),
                                    title: '订单项管理 所有状态',
                                    refresh: true
                                })
                            }
                        }
                    }
                }
                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('modifySuccess'), function () {
                    window.location.reload();
                });
                loadMask.hide();
                /*
                                me.afterSave();
                */
            },
            failure: function (response, options) {
                loadMask.hide();
                var r = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), r.data.message);
            }
        });

    },
    /**
     *保存成功之后调到订单列表 并且刷新订单列表
     */
    afterSave: function () {

        if (parent && parent.frames['tabs_iframe_orderpage']) {
            //设置订单列表为活动tab
            window.parent.Ext.getCmp('tabs').setActiveTab('orderpage');

            //刷新列表  调用order列表页面的刷新方法
            parent.frames['tabs_iframe_orderpage'].contentWindow.refreshGrid();
        }
        //关闭当前页
        window.parent.Ext.getCmp('tabs').remove('modifyOrderStatus');
    },
    /**
     * 获取关联物料的materialPath
     * @param {Number} materialId 产品物料Id
     * @param {String} materialPath
     */
    checkMaterialPath: function (materialId, materialPath) {
        Ext.Ajax.request({
            url: adminPath + 'api/materials/' + materialId,
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                var success = response.success;
                if (success) {
                    var data = response.data;
                    var materialName = data.name;
                    var materialId = data._id;
                    var type;
                    if (data.clazz == 'com.qpp.cgp.domain.bom.MaterialType') {
                        type = 'MaterialType'
                    } else if (data.clazz == 'com.qpp.cgp.domain.bom.MaterialSpu') {
                        type = 'MaterialSpu'
                    }
                    Ext.create('Order.status.view.productmaterialbomgrid.BomTree', {
                        materialPath: materialPath,
                        root: {
                            _id: materialId,
                            clazz: data.clazz,
                            name: materialName,
                            type: type,
                            icon: type == 'MaterialSpu' ? '../../ClientLibs/extjs/resources/themes/images/material/S.png' : '../../ClientLibs/extjs/resources/themes/images/material/T.png'
                        }

                    }).show();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });


    },

    /**
     * 保存用户参数
     * @param btn
     */
    saveUserParams: function (btn) {
        var win = btn.ownerCt.ownerCt;
        if (!win.isValid()) {
            return false;
        }
        var data = win.getValue();
        var method = 'PUT', url = adminPath + 'api/orders/' + win.orderId + '/userImpositionParams';
        var request = {
            url: url,
            method: method,
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var resp = Ext.JSON.decode(res.responseText);
                if (resp.success) {
                    Ext.Msg.alert('提示', '保存成功！');
                    var userParamsStore = Ext.data.StoreManager.lookup('userParamsStore');
                    userParamsStore.load();
                    // var modifyStatus=win.parent.Ext.down('form').getComponent('modifyStatus');
                    // if(modifyStatus)
                    //     modifyStatus.enable();
                    win.close();

                } else {
                    Ext.Msg.alert('提示', '请求错误：' + resp.data.message)
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        };
        Ext.Ajax.request(request);
    },

    saveMachineConfig: function (machineContainer, orderId) {
        var items = machineContainer.items.items;
        var data = [];
        for (var item of items) {
            var itemData = item.orderitemParam;
            itemData.userImpositionParams = {};
            itemData.userImpositionParams[item.name] = item.getValue();
            data.push(itemData);
        }
        var method = 'PUT', url = adminPath + 'api/orders/' + orderId + '/userImpositionParams';
        var request = {
            url: url,
            method: method,
            jsonData: data,
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (res) {
                var resp = Ext.JSON.decode(res.responseText);
                if (resp.success) {
                    // Ext.Msg.alert('提示', '保存成功！');
                    var userParamsStore = Ext.data.StoreManager.lookup('userParamsStore');
                    userParamsStore.load();

                } else {
                    Ext.Msg.alert('提示', '请求错误：' + resp.data.message)
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        };
        Ext.Ajax.request(request);
    },

    /**
     * 获取用户参数
     * @param comp
     */
    getUserParams: function (comp) {
        Ext.Ajax.request({
            method: 'GET',
            url: adminPath + 'api/orders/' + comp.orderId + '/userImpositionParams',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (response) {
                var r = Ext.JSON.decode(response.responseText);
                if (r.success) {
                    comp.setValue(r.data)
                } else {
                    Ext.Msg.alert(i18n.getKey('prompt'), r.message);
                    return;
                }
            },
            failure: function (response) {
                var r = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('prompt'), r.message);
            }
        });
    },

    addOrderitemMachine: function (orderitemParam, machineContainer) {
        var me = this;
        var orderitemId = orderitemParam.orderItemId;
        if (orderitemParam?.userParams?._id) {
            var url = adminPath + 'api/rtTypes/' + (orderitemParam?.userParams?._id) + '/rtAttributeDefs',
                method = 'GET';
            var request = {
                url: url,
                method: method,
                // jsonData: data,
                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                success: function (res) {
                    var resp = Ext.JSON.decode(res.responseText);
                    if (resp.success) {
                        if (Ext.isArray(resp.data) && resp.data[0]) {
                            var store = Ext.create('Ext.data.Store', {
                                fields: ['name', 'value'],
                                data: resp.data[0].options
                            });
                            var itemMachine = {
                                xtype: 'combo',
                                itemId: orderitemId + '_machine',
                                name: resp.data[0].name,
                                fieldLabel: i18n.getKey('orderLineItem') + '(' + orderitemId.toString() + ')',
                                orderitemParam: orderitemParam,
                                queryMode: 'local',
                                displayField: 'name',
                                allowBlank: false,
                                editable: false,
                                valueField: 'value',
                                store: store,
                                value: orderitemParam.userImpositionParams[resp.data[0].name] || orderitemParam.userParamDefaultValues.objectJSON[resp.data[0].name]
                            };
                            machineContainer.add(itemMachine);
                        }
                    } else {
                        Ext.Msg.alert('提示', '请求错误：' + resp.data.message)
                    }
                },
                failure: function (resp) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            };
            Ext.Ajax.request(request);
        }
    },

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
    /**
     * 检查所有订单项上报关分类是否确定了
     */
    checkCustomElementComplete: function () {
        var orderID = this.id;
        var url = adminPath + `api/orders/${orderID}/customs/check`;
        var result = true;
        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data;
                }
            }
        })
        return result;

    }
});