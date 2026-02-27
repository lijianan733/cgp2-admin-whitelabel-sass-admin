Ext.define("CGP.finishedproductitem.view.BatchPrintWin", {
    extend: 'Ext.window.Window',
    modal: true,
    width: 900,
    height: 600,
    layout: 'fit',
    constrain:true,
    maximizable:true,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.finishedproductitem.controller.Controller');
        me.title = i18n.getKey('batch') + i18n.getKey('print');
        var FinishedProductItem = Ext.create('CGP.finishedproductitem.store.FinishedProductItem', {
            pageSize: 75
        });
        var materialStore = Ext.data.StoreManager.lookup('materialStore');
        /*me.listeners = {
         close:function(){
         me.page.grid.getStore().load();
         }
         };*/
        var grid = Ext.create('CGP.common.commoncomp.QueryGrid', {
            gridCfg: {
                itemId: 'batchPrintGrid',
                store: FinishedProductItem,
                deleteAction: false,
                editAction: false,
                customPaging: [
                    {value: 25},
                    {value: 50},
                    {value: 75},
                    {value: 150},
                    {value: 300}
                ],
                columns: [
                    {
                        text: i18n.getKey('orderNumber'),
                        dataIndex: 'manufactureOrderItem',
                        xtype: 'gridcolumn',
                        width: 120,
                        tdCls: 'vertical-middle',
                        itemId: 'manufactureOrderItem1',
                        sortable: false,
                        renderer: function (value, metadata) {
                            value = value.orderLineItem.order.orderNumber;
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            metadata.style = "font-weight:bold;";
                            return value;
                        }

                    },
                    {
                        text: i18n.getKey('material'),
                        dataIndex: 'material',
                        xtype: 'gridcolumn',
                        width: 200,
                        tdCls: 'vertical-middle',
                        itemId: 'material1',
                        sortable: false,
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value.name + ' (' + value._id + ')' + '"';
                            return value.name + ' (' + value._id + ')'
                        }
                    },
                    {
                        width: 170,
                        autoSizeColumn: false,
                        text: i18n.getKey('partner'),
                        dataIndex: 'manufactureOrderItem',
                        itemId: 'partner1',
                        xtype: 'gridcolumn',
                        renderer: function (value, metadata, record) {
                            var partner = value.orderLineItem.order.partner;
                            if (!Ext.isEmpty(partner)) {
                                var result = partner.name + '<' + partner.id + '>';
                                metadata.tdAttr = 'data-qtip="' + result + '"';
                                return result;
                            }
                        }
                    },
                    {
                        text: i18n.getKey('qty'),
                        dataIndex: 'qty',
                        xtype: 'gridcolumn',
                        width: 70,
                        tdCls: 'vertical-middle',
                        itemId: 'qty1',
                        sortable: false
                    },
                    {
                        text: i18n.getKey('isTest'),
                        dataIndex: 'manufactureOrderItem',
                        itemId: 'isTest1',
                        xtype: 'gridcolumn',
                        width: 90,
                        renderer: function (value, metadata) {
                            return i18n.getKey(value.orderLineItem.order.isTest);
                        }
                    }
                ]
            },
            filterCfg: {
                header: false,
                itemId: 'batchPrintForm',
                items: [
                    {
                        name: 'manufactureOrderItem.id',
                        xtype: 'numberfield',
                        fieldLabel: i18n.getKey('manufactureOrderItemId'),
                        hideTrigger: true,
                        itemId: 'manufactureOrderItemId',
                        listeners: {
                            render: function (comp) {
                                var manufactureOrderId = JSGetQueryString('manufactureOrderId');
                                if (manufactureOrderId) {
                                    comp.setValue(parseInt(manufactureOrderId));
                                }
                            }
                        }
                    },
                    {
                        name: 'manufactureOrderItem.orderLineItem.order.orderNumber',
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('orderNumber'),
                        itemId: 'orderNumber',
                        enforceMaxLength: true,
                        maxLength: 12,
                        listeners: {
                            render: function (comp) {
                                var orderNumber = JSGetQueryString('orderNumber');
                                if (orderNumber) {
                                    comp.setValue(orderNumber);
                                }
                            }
                        }
                    },
                    {
                        name: 'materialId',
                        xtype: 'gridcombo',
                        itemId: 'material',
                        fieldLabel: i18n.getKey('material'),
                        multiSelect: false,
                        displayField: 'name',
                        valueField: '_id',
                        labelAlign: 'right',
                        isComboQuery: true,
                        store: materialStore,
                        queryMode: 'remote',
                        matchFieldWidth: false,
                        pickerAlign: 'bl',
                        gridCfg: {
                            store: materialStore,
                            height: 300,
                            width: 600,
                            columns: [
                                {
                                    text: i18n.getKey('id'),
                                    width: 80,
                                    dataIndex: '_id'
                                },
                                {
                                    text: i18n.getKey('name'),
                                    width: 150,
                                    dataIndex: 'name'
                                },
                                {
                                    text: i18n.getKey('type'),
                                    width: 150,
                                    dataIndex: 'type'
                                }
                            ],
                            tbar: {
                                layout: {
                                    type: 'column'
                                },
                                defaults: {
                                    width: 170,
                                    isLike: false,
                                    padding: 2
                                },
                                items: [
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: i18n.getKey('id'),
                                        name: '_id',
                                        isLike: false,
                                        labelWidth: 40
                                    },
                                    {
                                        xtype: 'textfield',
                                        fieldLabel: i18n.getKey('name'),
                                        name: 'name',
                                        labelWidth: 40
                                    },
                                    '->',
                                    {
                                        xtype: 'button',
                                        text: i18n.getKey('search'),
                                        handler: controller.searchProduct,
                                        width: 80
                                    },
                                    {
                                        xtype: 'button',
                                        text: i18n.getKey('clear'),
                                        handler: controller.clearParams,
                                        width: 80
                                    }
                                ]
                            },
                            bbar: Ext.create('Ext.PagingToolbar', {
                                store: materialStore,
                                displayInfo: true, // 是否 ? 示， 分 ? 信息
                                displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                emptyMsg: i18n.getKey('noData')
                            })
                        }
                    },
                    {
                        name: 'isNeedPrint',
                        xtype: 'combo',
                        triggerAction: 'all',
                        autoScroll: true,
                        /*listeners: {
                         render: function(comp){
                         var isNeedPrint = JSGetQueryString('isNeedPrint');
                         if(isNeedPrint){
                         comp.setValue(Boolean(isNeedPrint));
                         }
                         }
                         },*/
                        fieldLabel: i18n.getKey('isNeedPrint'),
                        itemId: 'isNeedPrint',
                        displayField: 'type',
                        valueField: 'value',
                        value: true,
                        hidden: true,
                        labelAlign: 'right',
                        store: Ext.data.Store({
                            fields: [
                                {name: 'type', type: 'string'},
                                {name: 'value', type: 'boolean'}
                            ],
                            data: [
                                {type: '否', value: false},
                                {type: '是', value: true}
                            ]
                        }),
                        queryMode: 'remote',
                        matchFieldWidth: true,
                        pickerAlign: 'tl-bl'
                    },
                    {
                        name: 'manufactureOrderItem.orderLineItem.order.isTest',
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
                        name: 'manufactureOrderItem.orderLineItem.order.partner.id',
                        xtype: 'combo',
                        pageSize: 25,
                        editable: false,
                        store: Ext.create('CGP.order.store.PartnerStore'),
                        displayField: 'name',
                        valueField: 'id',
                        fieldLabel: i18n.getKey('partner'),
                        itemId: 'partner'
                    },
                    {
                        name: 'excludeStatusIds',
                        xtype: 'textfield',
                        hidden: true,
                        isLike: false,
                        value: '156202,156203,156204,241635',
                        itemId: 'excludeStatusIds'
                    },
                    {
                        name: 'excludeOrderStatusIds',
                        xtype: 'textfield',
                        hidden: true,
                        isLike: false,
                        value: '41',
                        itemId: 'excludeOrderStatusIds'
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
                        name: 'manufactureOrderItem.orderLineItem.order.producePartner.id',
                        xtype: 'combobox',
                        editable: false,
                        fieldLabel: i18n.getKey('supplier'),
                        itemId: 'order.producePartner.id',
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
        me.bbar = ['->', {
            text: i18n.getKey('confirm') + i18n.getKey('print'),
            itemId: 'okBtn',
            iconCls: 'icon_agree',
            handler: function (btn) {
                var records = grid.grid.getSelectionModel().getSelection();
                if (records.length = 0) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请先选择订单'), function () {
                        return;
                    })
                }
                var producePartnerOrder = [];
                var selectedRecords = [];
                for (var i = 0; i < records.length; i++) {
                    if (records[i].get('manufactureOrderItem').orderLineItem.order.producePartner) {
                        grid.grid.getSelectionModel().deselect(records[i]);
                        producePartnerOrder.push(records[i].get('manufactureOrderItem').orderLineItem.order.orderNumber)
                    } else {
                        selectedRecords.push(records[i]);
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
                    Ext.Msg.alert(i18n.getKey('prompt'), '以下订单号：' + producePartnerOrderString + '<br>是属于供应商的订单,无权操作，已被取消选中。', function () {
                        return;
                    });
                } else {
                    controller.batchPrint( grid, FinishedProductItem, me.page, btn);
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