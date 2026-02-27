/**
 * Created by nan on 2018/5/17.
 */
Ext.Loader.syncRequire([
    'CGP.common.field.WebsiteCombo'
])
Ext.define('CGP.order.view.batchdeliverywindow.BatchDeliveryWindow', {
    extend: 'Ext.window.Window',
    width: 1200,
    height: 700,
    layout: 'fit',
    modal: true,
    constrain: true,
    maximizable: true,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.order.controller.Order');
        var store = Ext.create('CGP.order.store.BatchDeliverOrderStore', {
            params: {
                sort: '[{"property":"datePurchased","direction":"DESC"}]'
            }
        });
        me.title = i18n.getKey('batchDelivery');
        var grid = Ext.create('CGP.common.commoncomp.QueryGrid', {
            width: 1200,
            height: 700,
            gridCfg: {
                store: store,
                itemId: 'batchBalanceAccountWindowGrid',
                deleteAction: false,
                editAction: false,
                customPaging: [
                    {value: 25},
                    {value: 50},
                    {value: 75},
                    {value: 150},
                    {value: 300}
                ],
                columnDefaults: {
                    tdCls: 'vertical-middle'
                },
                columns: [
                    //订单号
                    {
                        width: 180,
                        autoSizeColumn: false,
                        text: i18n.getKey('orderNumber'),
                        dataIndex: 'orderNumber',
                        itemId: 'orderNumber',
                        xtype: 'gridcolumn'

                    },
                    /*    {
                            width: 120,
                            text: i18n.getKey('bindOrderNumbers'),
                            dataIndex: 'bindOrders',
                            itemId: 'bindOrderNumbers',
                            sortable: false,
                            renderer: function (v, m, r) {
                                if (Ext.isEmpty(v)) {
                                    return '<font color="red">空</font>'
                                }
                                return v.map(function (item) {
                                    return item.orderNumber;
                                }).join('<br>');
                            }
                        },*/
                    {
                        width: 120,
                        text: i18n.getKey('deliveryNo'),
                        dataIndex: 'shipmentInfo',
                        itemId: 'deliveryNo',
                        sortable: false,
                        renderer: function (v, m, r) {
                            if (Ext.isEmpty(v.deliveryNo)) {
                                return '<font color="red">空</font>'
                            }
                            return v.deliveryNo;
                        }
                    },
                    {
                        width: 120,
                        text: i18n.getKey('shippingMethod'),
                        dataIndex: 'shipmentInfo',
                        sortable: false,
                        itemId: 'shippingMethodName',
                        renderer: function (v, m, r) {
                            return v.shippingMethodName || null;
                        }
                    },
                    {
                        width: 120,
                        text: i18n.getKey('cost'),
                        dataIndex: 'shipmentInfo',
                        itemId: 'cost',
                        sortable: false,
                        renderer: function (v, m, r) {
                            return v.cost || null;
                        }
                    },
                    {
                        width: 120,
                        text: i18n.getKey('shippingMethod'),
                        dataIndex: 'shipmentInfo',
                        sortable: false,
                        itemId: 'shippingMethodName',
                        renderer: function (v, m, r) {
                            return v.shippingMethodName || null;
                        }
                    },
                    {
                        width: 120,
                        text: i18n.getKey('weight') + '(千克)',
                        dataIndex: 'shipmentInfo',
                        sortable: false,
                        itemId: 'weight',
                        renderer: function (v, m, r) {
                            return Number(v.weight) || null;
                        }
                    },
                    {
                        width: 120,
                        text: i18n.getKey('expresspostage') + '(元)',
                        dataIndex: 'shipmentInfo',
                        itemId: 'cost',
                        sortable: false,
                        renderer: function (v, m, r) {
                            return Number(v.cost).toString() || null;
                        }
                    }
                ]
            },
            filterCfg: {
                //height: 200,
                header: false,
                layout: {
                    type: 'table',
                    columns: 3
                },
                defaults: {
                    width: 350
                },
                items: [
                    {
                        name: 'orderNumber',
                        enforceMaxLength: true,
                        maxLength: 12,
                        xtype: 'textfield',
                        listeners: {
                            render: function (comp) {
                                var orderNumber = JSGetQueryString('orderNumber');
                                if (orderNumber) {
                                    comp.setValue(orderNumber);
                                }
                            }
                        },
                        fieldLabel: i18n.getKey('orderNumber'),
                        itemId: 'orderNumber',
                        width: 360
                    },
                    {
                        name: 'bindOrderNumber',
                        enforceMaxLength: true,
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('bindOrderNumbers'),
                        itemId: 'bindOrderNumbers'
                    },
                    {
                        name: 'customerEmail',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('customerEmail'),
                        itemId: 'customerEmail'
                    },
                    {
                        style: 'margin-right:50px; margin-top : 0px;',
                        name: 'datePurchased',
                        xtype: 'datefield',
                        itemId: 'fromDate',
                        scope: true,
                        fieldLabel: i18n.getKey('datePurchased'),
                        width: 360,
//                    itemXType: 'datefield',
                        format: 'Y/m/d'
                        //                    scope: true,
                        //                    width: 218
                    },
                    {
                        name: 'orderType',
                        xtype: 'combobox',
                        editable: false,
                        fieldLabel: i18n.getKey('orderType'),
                        itemId: 'orderType',
                        store: new Ext.data.Store({
                            fields: ['title', 'value'],
                            data: [
                                {
                                    value: 'MP',
                                    title: '普通订单'
                                },
                                {
                                    value: 'RM',
                                    title: '补款订单'
                                },
                                {
                                    value: '',
                                    title: i18n.getKey('allType')
                                }
                            ]
                        }),
                        value: '',
                        displayField: 'title',
                        valueField: 'value'
                    },
                    {
                        fieldLabel: i18n.getKey('orderStatus'),
                        name: 'status.id',
                        itemId: 'orderStatus',
                        hidden: true,
                        xtype: 'combo',
                        editable: false,
                        store: Ext.create('CGP.common.store.OrderStatuses'),
                        displayField: 'name',
                        valueField: 'id',
                        value: 106,
                        listeners: {
                            afterrender: function (combo) {
                                var store = combo.getStore();
                                store.on('load', function () {
                                    if (!combo.getValue())
                                        combo.select(store.getAt(0));
                                });
                            }
                        }
                    },
                    {
                        width: 360,
                        name: 'website.id',
                        itemId: 'website',
                        hidden: true,
                        xtype: 'websitecombo',
                    },
                    {
                        name: 'partner.id',
                        xtype: 'combo',
                        pageSize: 25,
                        editable: false,
                        store: Ext.create('CGP.order.store.PartnerStore'),
                        displayField: 'name',
                        listeners: {
                            change: function (comp, newValue, oldValue) {
                                var extraParams = comp.ownerCt.getComponent('extraParams');
                                var extraParamsName = extraParams.getComponent('extraParamName');
                                var extraParamsNameStore = extraParamsName.getStore();
                                extraParamsNameStore.on('add', function (store, records, index) {
                                    if (!Ext.isEmpty(records)) {
                                        extraParamsName.select(store.getAt(0))
                                    }
                                });
                                if (!Ext.isEmpty(newValue)) {
                                    //extraParams.setDisabled(false);
                                    var partnerConfigStore = Ext.create('CGP.partner.store.PartnerConfigStore', {
                                        partnerId: newValue,
                                        groupId: 24
                                    });
                                    partnerConfigStore.load({
                                        callback: function (records, operation, success) {
                                            if (success) {
                                                extraParamsName.reset();
                                                extraParamsNameStore.removeAll();
                                                extraParams.setDisabled(true);
                                                Ext.each(records, function (record) {
                                                    if (record.get('key') == "PARTNER_" + newValue + "_CONFIG_KEY_ORDER_EXTRA_PARAM_RT_TYPE") {
                                                        Ext.Ajax.request({
                                                            url: adminPath + 'api/rtTypes/' + record.get('value') + '/rtAttributeDefs',
                                                            method: 'GET',
                                                            headers: {
                                                                'Authorization': 'Bearer ' + Ext.util.Cookies.get('token')
                                                            },
                                                            success: function (resp) {
                                                                var response = Ext.JSON.decode(resp.responseText);
                                                                var isSuccess = response.success;
                                                                if (isSuccess == true) {
                                                                    extraParamsNameStore = extraParamsName.getStore();
                                                                    if (Ext.isEmpty(response.data)) {
                                                                        extraParams.setDisabled(true);
                                                                    } else {
                                                                        extraParams.setDisabled(false);
                                                                        extraParamsNameStore.add(response.data)
                                                                    }
                                                                } else {
                                                                    //Ext.Msg.alert('提示', response.data.message);
                                                                }
                                                            },
                                                            failure: function (resp) {
                                                                mask.hide();
                                                                //var message = Ext.JSON.decode(resp.responseText).data.message;
                                                                //Ext.Msg.alert('提示', message);
                                                            }
                                                        });
                                                    }
                                                })
                                            } else {
                                                extraParams.setDisabled(true);
                                                extraParamsName.reset();
                                                Ext.Msg.alert('提示', '加载partner配置失败！');
                                                return;
                                            }
                                        }
                                    })
                                } else {
                                    extraParamsNameStore.removeAll();
                                    extraParams.setDisabled(true);
                                }

                            }
                        },
                        valueField: 'id',
                        fieldLabel: i18n.getKey('partner'),
                        itemId: 'partner'
                    },
                    {
                        name: 'extraParams',
                        xtype: 'fieldcontainer',
                        itemId: 'extraParams',
                        disabled: true,
                        fieldLabel: i18n.getKey('extraParams'),
                        width: 360,
                        defaults: {
                            style: 'margin:0'
                        },
                        layout: {
                            type: 'table',
                            columns: 2,
                            tdAttrs: {
                                style: 'margin:0'
                            }
                        },
                        items: [
                            {
                                xtype: 'combo',
                                fieldLabel: false,
                                displayField: 'name',
                                valueField: 'name',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['name'],
                                    proxy: {
                                        type: 'memory'
                                    },
                                    data: [/*{name: 'batch_no'}*/]
                                }),
                                width: 130,
                                editable: false,
                                queryMode: 'local',
                                isExtraParam: true,
                                itemId: 'extraParamName'
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: false,
                                width: 130,
                                name: 'extraParam',
                                //margin:'10 0 0 0',
                                isExtraParam: true,
                                itemId: 'extraParamValue'
                            }
                        ]
                    },
                    {
                        name: 'isTest',
                        xtype: 'combobox',
                        editable: false,
                        fieldLabel: i18n.getKey('isTest'),
                        itemId: 'isTest',
                        store: new Ext.data.Store({
                            fields: ['name', {
                                name: 'value',
                                type: 'boolean'
                            }],
                            data: [
                                {
                                    value: true,
                                    name: '是'
                                },
                                {
                                    value: false,
                                    name: '否'
                                }
                            ]
                        }),
                        displayField: 'name',
                        value: !JSWebsiteIsStage(),
                        valueField: 'value'
                    },
                    {
                        name: 'isRedo',
                        xtype: 'combobox',
                        editable: false,
                        hidden: !Ext.isEmpty(JSGetQueryString('statusId')),
                        fieldLabel: i18n.getKey('redo') + i18n.getKey('order'),
                        itemId: 'isRedo',
                        value: Ext.Array.contains(['103', '104', '105', '106', '107'], JSGetQueryString('statusId')) ? !Ext.isEmpty(JSGetQueryString('isRedo')) : '',
                        store: new Ext.data.Store({
                            fields: ['name', {
                                name: 'value',
                                type: 'boolean'
                            }],
                            data: [
                                {
                                    value: true,
                                    name: '是'
                                },
                                {
                                    value: false,
                                    name: '否'
                                }
                            ]
                        }),
                        displayField: 'name',
                        valueField: 'value'
                    }
                ]
            }
        });
        me.items = [grid];
        me.grid = grid;
        me.bbar = ['->', {
            text: i18n.getKey('batchDelivery'),
            itemId: 'okBtn',
            iconCls: 'icon_agree',
            handler: function (btn) {
                var grid = me.grid;
                var myMask = new Ext.LoadMask(grid, {msg: "请等待..." + '<br>' + '发货订单较多时，结算时间较长，请耐心等待！'});
                var selectItems = grid.grid.getSelectionModel().getSelection();
                var orderIds = [];
                var producePartnerOrder = [];//partner的订单
                var deliverInfoNoCompleteRecords = [];//订单发货信息不全订单
                var jsonData = {
                    "comment": null,
                    "customerNotify": false,
                    "orderIds": orderIds,
                    "statusIds": 107//目标状态
                };
                if (selectItems.length == 0) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '请先选择订单');
                } else {
                    for (var i = 0; i < selectItems.length; i++) {
                        if (selectItems[i].get('producePartner')) {
                            grid.grid.getSelectionModel().deselect(selectItems[i]);
                            producePartnerOrder.push(selectItems[i].get('orderNumber'));
                        }
                    }
                    if (producePartnerOrder.length > 0) {
                        var producePartnerOrderString = '';
                        for (var i = 0; i < producePartnerOrder.length; i++) {
                            if (i % 2 == 0 && i != producePartnerOrder.length - 1) {
                                producePartnerOrderString += producePartnerOrder[i] + '<br>'
                            } else {
                                producePartnerOrderString += producePartnerOrder[i] + ','
                            }
                        }
                        Ext.Msg.alert(i18n.getKey('prompt'), '以下订单号：' + producePartnerOrderString + '<br>是属于供应商的订单，无权操作，已被取消选中。', function () {
                            return;
                        });
                    } else {
                        for (var i = 0; i < selectItems.length; i++) {//遍历选中的记录，去除发货信息不全的记录
                            if (!selectItems[i].get('isComplete')) {
                                grid.grid.getSelectionModel().deselect(selectItems[i]);//去除选中
                                deliverInfoNoCompleteRecords.push(selectItems.splice(i, 1)[0]);
                                i--;
                                console.log(selectItems)
                            } else {
                                orderIds.push(selectItems[i].get('id'))
                            }
                        }
                        var deliverInfoNoCompleteRecordsString = '';
                        if (deliverInfoNoCompleteRecords.length > 0) {//遍历信息缺失订单
                            deliverInfoNoCompleteRecordsString += '以下订单号:';
                            for (var i = 0; i < deliverInfoNoCompleteRecords.length; i++) {
                                if (i % 2 == 0 && i != deliverInfoNoCompleteRecords.length - 1) {
                                    deliverInfoNoCompleteRecordsString += deliverInfoNoCompleteRecords[i].get('orderNumber') + '<br>'
                                } else {
                                    deliverInfoNoCompleteRecordsString += deliverInfoNoCompleteRecords[i].get('orderNumber') + ','
                                }
                            }
                            deliverInfoNoCompleteRecordsString += '信息不全,已取消选中<br>'
                        }
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey(deliverInfoNoCompleteRecordsString + '是否批量发货选中的' + selectItems.length + '个订单'), function (id) {
                                if (id === 'yes') {
                                    myMask.show();
                                    Ext.Ajax.request({
                                        url: adminPath + 'api/orders/batchUpdateStatus',
                                        method: 'PUT',
                                        timeout: 1000000,
                                        headers: {
                                            Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                        },
                                        jsonData: jsonData,
                                        success: function (response) {
                                            myMask.hide();
                                            var responseMessage = Ext.JSON.decode(response.responseText);
                                            if (responseMessage.success) {
                                                grid.grid.store.load();
                                                me.prePageStore.load();
                                                Ext.Msg.alert('提示', selectItems.length + '个订单已批量发货完成！');
                                            } else {
                                                myMask.hide();
                                                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                            }
                                        },
                                        failure: function (response) {
                                            myMask.hide();
                                            var responseMessage = Ext.JSON.decode(response.responseText);
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                        }
                                    });
                                }

                            }
                        )
                    }
                }
            }
        }, {
            text: i18n.getKey('cancel'),
            iconCls: 'icon_cancel',
            handler: function (btn) {
                me.close();
            }
        }];
        me.callParent(arguments);
    }
})