/**
 * Created by nan on 2018/4/17.
 */
Ext.define('CGP.partner.view.suppliersupportableproduct.controller.Controller', {
    manageDeliveryMethodConfig: function (partnerId, productId, websiteId) {
        var record = Ext.create('CGP.partner.view.suppliersupportableproduct.model.PartnerSupportProductDeliverConfigModel');
        record.set('productId', productId);
        var partnerSupportedConfigId = '';
        Ext.Ajax.request({
            url: adminPath + 'api/partners/' + partnerId + '/producer/configs',
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    partnerSupportedConfigId = responseMessage.data._id;
                    record.set('partnerSupportedConfigId', responseMessage.data._id)
                }
            }
        });
        var partnerSupportProductDeliverConfigStore = Ext.create('CGP.partner.view.suppliersupportableproduct.store.PartnerSupportProductDeliverConfigStore', {
            params: {
                filter: '[{"name":"partnerSupportedConfigId","value":"' + partnerSupportedConfigId + '","type":"string"},{"name":"productId","value":' + productId + ',"type":"number"}]'
            },
            listeners: {
                load: function (store) {
                    record = store.getAt(0) || record;//获取到记录
                    if (store.count() > 0) {
                        /*  var form = view.getComponent('form');
                         var deliveryMethodType = form.getComponent('deliveryMethodType');
                         var receiveAddressId = form.getComponent('receiveAddressId');
                         deliveryMethodType.setValue(record.get('deliveryMethodType'));
                         receiveAddressId.store.on('load', function () {
                         receiveAddressId.setSubmitValue(record.get('receiveAddressId'));
                         })*/
                    }
                    var method = store.count() > 0 ? 'PUT' : 'POST';
                    var win = Ext.create('CGP.partner.view.suppliersupportableproduct.view.ReceiveAddressWindow', {
                        method: method,
                        record: record,
                        websiteId: websiteId
                    });
                    win.show();
                }
            }
        });
    },
    searchProduct: function () {
        var me = this;
        var queries = [];
        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();
        var params = {};
        queries.push({"name": "type", "value": "%sku%", "type": "string"})
        for (var i = 0; i < items.length; i++) {
            var query = {};
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            query.name = items[i].name;
            if (!Ext.isEmpty(items[i].isLike) && !items[i].isLike) {
                query.value = items[i].getValue();
            } else if (Ext.isEmpty(items[i].isLike) || items[i].isLike) {
                query.value = '%' + items[i].getValue() + '%'
            }
            if (items[i].xtype == 'numberfield') {
                query.type = 'number';

            } else {
                query.type = 'string';
            }
            queries.push(query);
            //添加对应的websiteId过滤
        }

        if (queries.length > 0) {
            store.proxy.extraParams = {
                filter: Ext.JSON.encode(queries)
            }
        } else {
            store.proxy.extraParams = {
                filter: Ext.JSON.encode([
                    {"name": "type", "value": "%sku%", "type": "string"}
                ])
            }
        }
        store.loadPage(1);
    },
    clearParams: function () {
        var me = this;
        var items = this.ownerCt.items.items;
        var store = this.ownerCt.ownerCt.getStore();
        for (var i = 0; i < items.length; i++) {
            if (items[i].xtype == 'button')
                continue;
            if (Ext.isEmpty(items[i].value))
                continue;
            items[i].setValue('');
        }

        store.proxy.extraParams = {
            filter: Ext.JSON.encode([
                [
                    {"name": "type", "value": "%sku%", "type": "string"}
                ]
            ])
        }
    },
    /**
     * 修改产品价格
     * @param record
     * @param store
     */
    modifyPrice: function (record, store, partnerId) {
        var win = Ext.create('Ext.window.Window', {
            title: i18n.getKey('modifyPrice'),
            height: 150,
            width: 300,
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'numberfield',
                    hideTrigger: true,
                    itemId: 'productPrice',
                    minValue: 0
                }
            ],
            bbar: [
                '->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (view) {
                        var win = view.ownerCt.ownerCt;
                        var value = win.getComponent('productPrice').getValue();
                        if (!Ext.isEmpty(value)) {
                            var jsonData = {
                                '_id': record.getId(),
                                'clazz': 'com.qpp.cgp.domain.partner.producer.ProducerSupportedProductConfig',
                                'productId': record.get('product').id,
                                'price': value
                            }
                            Ext.Ajax.request({
                                url: adminPath + 'api/producers/' + partnerId + '/supportedProductConfigs/' + record.getId(),
                                method: 'PUT',
                                jsonData: jsonData,
                                headers: {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                },
                                success: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    if (responseMessage.success) {
                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('edit') + i18n.getKey('success'), function () {
                                            store.load();
                                            win.close();
                                        });
                                    } else {
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    }
                                },
                                failure: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            });
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (view) {
                        win.close();

                    }
                }
            ]
        });
        win.show();
    },
    /**
     * 保存配送方式
     * @param btn
     * @param me
     */
    saveReceiveAddress: function (btn, me) {
        var form = btn.ownerCt.ownerCt.getComponent('form');
        if (form.isValid()) {
            var myMask = new Ext.LoadMask(form, {msg: "Please wait..."});
            var url = adminPath + 'api/productDeliveryMethodConfigs';
            if (me.method == 'PUT') {
                url = adminPath + 'api/productDeliveryMethodConfigs/' + me.record.get('_id')
            }
            var receiveAddressId = form.getComponent('receiveAddressId').getSubmitValue().toString();
            var deliveryMethodType = form.getComponent('deliveryMethodType').getValue();
            me.record.set('receiveAddressId', receiveAddressId);
            me.record.set('deliveryMethodType', deliveryMethodType);
            var jsonData = me.record.getData();
            if (me.method == 'POST') {
                delete jsonData._id;
            }
            myMask.show();
            Ext.Ajax.request({
                url: url,
                method: me.method,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                jsonData: jsonData,
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'));
                        myMask.hide();
                        me.close();
                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                        myMask.hide();
                        me.close();
                    }
                },
                failure: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    myMask.hide();
                    me.close();
                }
            });
        }
    },
    batchCreateEnableProduct: function (btn, me) {
        var grid = btn.ownerCt.ownerCt;
        var isAllSetedPrice = Ext.Array.each(me.selectedRecord.getRange(), function (record) {
            if (Ext.isEmpty(record.price)) {
                return false;
            }
        });
        if (!isAllSetedPrice) {
            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('必须为所有选中的产品设置值，才能进行批量操作！'))
        } else {
            me.loadMask.show();
            var jsonData = [];
            Ext.Array.each(me.selectedRecord.getRange(), function (record) {
                jsonData.push({
                    "clazz": 'com.qpp.cgp.domain.partner.producer.ProducerSupportedProductConfig',
                    "price": record.price,
                    "productId": record.id
                })
            });
            Ext.Ajax.request({
                url: adminPath + 'api/producers/' + me.partnerId + '/supportedProductConfigs/batch',
                method: 'POST',
                jsonData: jsonData,
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    me.loadMask.hide();
                    if (responseMessage.success) {
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('batchCreate') + i18n.getKey('success'), function () {
                            me.page.grid.getStore().load();
                            me.close();
                        });
                    } else {
                        me.loadMask.hide();
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    me.loadMask.hide();
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            })
        }
    }
})