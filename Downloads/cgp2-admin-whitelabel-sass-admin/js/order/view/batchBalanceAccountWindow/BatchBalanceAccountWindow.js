/**
 * Created by nan on 2018/3/1.
 */
//弹出的窗口，用于批量结算
Ext.define("CGP.order.view.batchBalanceAccountWindow.BatchBalanceAccountWindow", {
    extend: 'Ext.window.Window',
    modal: true,
    width: 1200,
    height: 700,
    layout: 'fit',
    constrain:true,
    maximizable:true,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.order.controller.Order');
        var store = Ext.create('CGP.order.store.BatchBalanceAccountStore');
        me.title = i18n.getKey('batchBalanceAccount');
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
                    {
                        text: i18n.getKey('orderNumber'),
                        dataIndex: 'orderNumber',
                        width: 120,
                        tdCls: 'vertical-middle',
                        itemId: 'batchBalanceAccountWindowGridOrderNumber',
                        sortable: false
                    },
                    {
                        text: i18n.getKey('bindOrderNumbers'),
                        dataIndex: 'bindOrderNumbers',
                        width: 120,
                        itemId: 'batchBalanceAccountWindowGridBindOrderNumbers',
                        sortable: false
                    },
                    {
                        text: i18n.getKey('deliveryNo'),
                        dataIndex: 'deliveryNo',
                        width: 120,
                        itemId: 'batchBalanceAccountWindowGridDeliveryNo',
                        sortable: false
                    },
                    {
                        text: i18n.getKey('partner'),
                        dataIndex: 'partner',
                        width: 120,
                        itemId: 'batchBalanceAccountWindowGridPartner',
                        sortable: false,
                        renderer: function (value, metadata, record) {
                            if (!Ext.isEmpty(value)) {
                                var result = value.name + '<' + value.id + '>';
                                metadata.tdAttr = 'data-qtip="' + result + '"';
                                return result;
                            }
                        }
                    },
                    {
                        text: i18n.getKey('extraParams'),
                        width: 170,
                        sortable: false,
                        itemId: 'batchBalanceAccountWindowGridExtraParams',
                        xtype: "componentcolumn",
                        dataIndex: 'extraParam',
                        renderer: function (value, metadata, record) {
                            var returnstr = controller.createExtraParamsString(value);
                            var tipValue = '';
                            var recordCount = 0;
                            if (value && value.objectJSON) {
                                for (var i in value.objectJSON) {
                                    recordCount++;
                                    if (recordCount > 2)
                                        break;
                                    tipValue += i + " : " + value.objectJSON[i] + '<br>';
                                }
                            }
                            metadata.tdAttr = 'data-qtip="' + tipValue + '"';//显示的文本
                            return returnstr;
                        }
                    },
                    {
                        text: i18n.getKey('datePurchased'),
                        dataIndex: 'datePurchased',
                        width: 120,
                        itemId: 'batchBalanceAccountWindowGridDatePurchased',
                        sortable: true,
                        renderer: function (value, metadata, record) {
                            metadata.style = "color: gray";
                            value = Ext.Date.format(value, 'Y/m/d H:i');
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return '<div style="white-space:normal;">' + value + '</div>';
                        }
                    },
                    {
                        text: i18n.getKey('deliveryDate'),
                        dataIndex: 'deliveryDate',
                        width: 120,
                        itemId: 'batchBalanceAccountWindowGridDeliveryDate',
                        sortable: true,
                        renderer: function (value, metadata, record) {
                            metadata.style = "color: gray";
                            value = Ext.Date.format(value, 'Y/m/d H:i');
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return '<div style="white-space:normal;">' + value + '</div>';
                        }
                    },
                    {
                        text: i18n.getKey('receivedDate'),
                        dataIndex: 'settlementDate',
                        width: 120,
                        itemId: 'receivedDate',
                        sortable: false,
                        renderer: function (value, metadata, record) {
                            var beforeDate = value;
                            var afterDate = Date.parse(beforeDate) - (24 * 60 * 60 * 1000 * 8);//可结算日期加-8
                            var showValue = new Date(afterDate)
                            metadata.style = "color: gray";
                            showValue = Ext.Date.format(showValue, 'Y/m/d H:i');
                            metadata.tdAttr = 'data-qtip="' + showValue + '"';
                            return '<div style="white-space:normal;">' + showValue + '</div>';
                        }
                    },
                    {
                        text: i18n.getKey('settlementDate'),
                        dataIndex: 'receivedDate',
                        width: 120,
                        itemId: 'settlementDate',
                        sortable: true,
                        xtype: 'datecolumn',
                        renderer: function (value, metadata, record) {
                            var beforeDate = value;
                            var afterDate = Date.parse(beforeDate) + (24 * 60 * 60 * 1000 * 8);//可结算日期加8
                            var showValue = new Date(afterDate)
                            metadata.style = "color: gray";
                            showValue = Ext.Date.format(showValue, 'Y/m/d H:i');
                            metadata.tdAttr = 'data-qtip="' + showValue + '"';
                            return '<div style="white-space:normal;">' + showValue + '</div>';
                        }
                    },
                    {
                        text: i18n.getKey('status'),
                        dataIndex: 'status',
                        width: 120,
                        itemId: 'status',
                        sortable: true,
                        renderer: function (value, metadata, record) {
                            return i18n.getKey(value.name);
                        }
                    },
                    {
                        text: i18n.getKey('isTest'),
                        dataIndex: 'isTest',
                        width: 120,
                        itemId: 'isTest',
                        sortable: true,
                        renderer: function (value, metadata) {
                            return i18n.getKey(value);
                        }
                    }
                ]
            },
            filterCfg: {
                minHeight: 120,
                header: false,
                items: [
                    {
                        name: 'orderNumber',
                        enforceMaxLength: true,
                        maxLength: 12,
                        itemId: 'orderNumber',
                        xtype: 'textfield',
                        listeners: {
                            render: function (comp) {
                                var orderNumber = JSGetQueryString('orderNumber');
                                if (orderNumber) {
                                    comp.setValue(orderNumber);
                                }
                            }
                        },
                        fieldLabel: i18n.getKey('orderNumber')
                    },
                    {
                        name: 'bindOrderNumber',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('bindOrderNumbers'),
                        itemId: 'bindOrderNumber',
                        isLike: false
                    },
                    {
                        name: 'deliveryNo',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('deliveryNo'),
                        itemId: 'deliveryNo',
                        isLike: false
                    },
                    {
                        itemId: 'datePurchased',
                        style: 'margin-right:50px; margin-top : 0px;',
                        name: 'datePurchased',
                        xtype: 'datefield',
                        scope: true,
                        fieldLabel: i18n.getKey('datePurchased'),
                        format: 'Y/m/d'

                    },
                    {
                        itemId: 'deliveryDate',
                        style: 'margin-right:50px; margin-top : 0px;',
                        name: 'deliveryDate',
                        xtype: 'datefield',
                        scope: true,
                        fieldLabel: i18n.getKey('deliveryDate'),
                        format: 'Y/m/d'

                    },
                    {
                        itemId: 'receivedDate',
                        style: 'margin-right:50px; margin-top : 0px;',
                        name: 'receivedDate',
                        xtype: 'datefield',
                        scope: true,
                        fieldLabel: i18n.getKey('receivedDate'),
                        format: 'Y/m/d'

                    },
                    {
                        itemId: 'settlementDate',
                        style: 'margin-right:50px; margin-top : 0px;',
                        name: 'settlementDate',
                        xtype: 'datefield',
                        scope: true,
                        change: -8,
                        fieldLabel: i18n.getKey('settlementDate'),
                        format: 'Y/m/d'
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
                                var extraParams = comp.ownerCt.getComponent('extraParamsextraParamsextraParams');
                                var extraParamsName = extraParams.getComponent('extraParamName');
                                var extraParamsNameStore = extraParamsName.getStore();
                                extraParamsNameStore.on('add', function (store, records, index) {
                                    if (!Ext.isEmpty(records)) {
                                        extraParamsName.select(store.getAt(0))
                                    }
                                });
                                if (!Ext.isEmpty(newValue)) {
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
                        name: 'extraParam',
                        xtype: 'fieldcontainer',
                        itemId: 'extraParamsextraParamsextraParams',
                        disabled: true,
                        fieldLabel: i18n.getKey('extraParams'),
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
                                    data: []
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
                        value: false,
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
                    },
                    {
                        name: 'hasProducer',
                        xtype: 'combobox',
                        fieldLabel: i18n.getKey('是否已分配供应商'),
                        itemId: 'hasProducer',
                        editable: false,
                        isBoolean: true,

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
                    },
                    {
                        name: 'producePartner.id',
                        xtype: 'combobox',
                        editable: false,
                        fieldLabel: i18n.getKey('supplier'),
                        itemId: 'producePartner.id',
                        store: Ext.create('CGP.partner.store.PartnerStore', {
                            params: {
                                filter: '[{"name":"businessName","value":"producer","type":"string"}]'
                            },
                            listeners: {
                                'load': function (store, records) {
                                    for (var i = 0; i < records.length; i++) {
                                        records[i].set('showValue', records[i].get('name') + "<" + records[i].get('id') + ">")
                                    }
                                }
                            }
                        }),
                        displayField: 'showValue',
                        valueField: 'id'
                    }
                ]
            }
        });
        me.items = [grid];
        me.grid = grid;
        me.bbar = ['->', {
            text: i18n.getKey('batchBalanceAccount'),
            itemId: 'okBtn',
            iconCls: 'icon_agree',
            handler: function (btn) {
                var grid = me.grid;
                var myMask = new Ext.LoadMask(grid, {msg: "请等待..."+'<br>'+'结算订单较多时，结算时间较长，请耐心等待！'});
                var selectItems = grid.grid.getSelectionModel().getSelection();
                var orderIds = [];
                var producePartnerOrder = [];
                var selectedRecords = [];
                var jsonData = {
                    "comment": null,
                    "customerNotify": false,
                    "orderIds": orderIds,
                    "statusIds": 224101
                };
                if (selectItems.length == 0) {
                    Ext.Msg.alert(i18n.getKey('prompt'), '请先选择订单');
                } else {
                    for (var i = 0; i < selectItems.length; i++) {
                        if (selectItems[i].get('producePartner')) {
                            grid.grid.getSelectionModel().deselect(selectItems[i]);
                            producePartnerOrder.push(selectItems[i].get('orderNumber'));
                        } else {
                            orderIds.push(selectItems[i].get('id'));
                            selectedRecords.push(selectItems[i])
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
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否批量结算选中的' + selectItems.length + '个订单'), function (id) {
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
                                                Ext.Msg.alert('提示',selectItems.length+'个订单已结算完成！');
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
});