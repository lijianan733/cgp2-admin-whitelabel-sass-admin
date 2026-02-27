/**
 * Created by admin on 2017/10/31.
 */
Ext.Loader.syncRequire(['CGP.common.store.ProductStore', 'CGP.common.store.MaterialStore']);
Ext.onReady(function () {
    var FinishedProductItem = Ext.create('CGP.finishedproductitem.store.FinishedProductItem');
    var controller = Ext.create('CGP.finishedproductitem.controller.Controller');
    var materialStore = Ext.data.StoreManager.lookup('materialStore');
    var excludeStatusIds = JSGetQueryString('excludeStatusIds');
    var productStore = Ext.create('CGP.common.store.ProductStore', {
        storeId: 'productStore',
    });
    var mainGrid = Ext.create('Ext.ux.ui.GridPage', {
        accessControl: [],
        permissions: ['update', 'delete'],//设置是否隐藏编辑和删除按钮
        gridCfg: {
            /*viewConfig:{
             listeners: {
             beforerefresh: function(){
             var a = new Date();
             console.log(a);
             },
             refresh:function(){
             var b = new Date();
             console.log(b);
             }
             }
             },*/
            store: FinishedProductItem,
            frame: false,
            customPaging: [
                {value: 25},
                {value: 50},
                {value: 75}
            ],
            /*selModel: {
             checkOnly: true
             },*/
            //multiSelect: true,
            columnDefaults: {
                autoSizeColumn: true
            }, /*plugins: {
             ptype: 'bufferedrenderer',
             trailingBufferZone: 20,  // Keep 20 rows rendered in the table behind scroll
             leadingBufferZone: 50   // Keep 50 rows rendered in the table ahead of scroll
             //synchronousRender: false
             },*/
            listeners: {
                beforerender: function (comp) {
                    comp.setLoading();
                },
                render: function (comp) {
                    comp.setLoading(false);
                }
            },
            columns: [
                /*{
                 text: i18n.getKey('orderNumber'),
                 dataIndex: 'manufactureOrderItem',
                 xtype: 'gridcolumn',
                 width: 120,
                 tdCls: 'vertical-middle',
                 itemId: 'manufactureOrderItem',
                 sortable: false,
                 renderer: function (value, metadata) {
                 value = value.orderLineItem.order.orderNumber;
                 metadata.tdAttr = 'data-qtip="' + value + '"';
                 metadata.style = "font-weight:bold;";
                 return value;
                 }

                 },*/
                {
                    text: i18n.getKey('orderNumber'),
                    dataIndex: 'manufactureOrderItem',
                    xtype: 'gridcolumn',
                    width: 120,
                    tdCls: 'vertical-middle',
                    itemId: 'manufactureOrderItem',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        value = value.orderLineItem.order.orderNumber;
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return new Ext.Template('<a style="text-decoration: none;" href="javascript:{handler}">' + value + '</a>').apply({
                            handler: 'showOrderDetail(' + record.get('manufactureOrderItem').orderLineItem.order.id + ',' + '\'' + value + '\'' + ')'
                        });
                    }

                },
                {
                    text: i18n.getKey('operation'),
                    sortable: false,
                    width: 105,
                    autoSizeColumn: false,
                    tdCls: 'vertical-middle',
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record) {
                        return {
                            xtype: 'toolbar',
                            layout: 'column',
                            tdCls: 'vertical-middle',
                            style: 'padding:0',
                            items: [
                                {
                                    text: i18n.getKey('options'),
                                    width: '100%',
                                    flex: 1,
                                    menu: {
                                        xtype: 'menu',
                                        items: [
                                            {
                                                text: i18n.getKey('check') + i18n.getKey('material'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    var material = record.get('material');
                                                    JSOpen({
                                                        id: 'material' + '_edit',
                                                        url: path + "partials/material/edit.html?materialId=" + material._id + '&isLeaf=' + material.leaf + '&parentId= &isOnly=true',
                                                        title: i18n.getKey('materialInfo') + '(' + i18n.getKey('id') + ':' + material._id + ')',
                                                        refresh: true
                                                    });
                                                }
                                            }
                                            ,
                                            {
                                                text: i18n.getKey('checkOrderLineItem'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    var orderLineItemId = record.get('manufactureOrderItem').orderLineItem.id;
                                                    var isTest = record.get('manufactureOrderItem').orderLineItem.isTest;
                                                    JSOpen({
                                                        id: 'orderlineitempage',
                                                        url: path + 'partials/orderlineitem/orderlineitem.html' +
                                                            '?id=' + orderLineItemId +
                                                            '&isTest2=' + isTest,
                                                        title: '订单项管理 所有状态',
                                                        refresh: true
                                                    });
                                                }
                                            },
                                            {
                                                text: i18n.getKey('check') + i18n.getKey('manufactureOrderItems'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    var manufactureOrderItemId = record.get('manufactureOrderItem').id;
                                                    JSOpen({
                                                        id: 'manufactureorderitempage',
                                                        url: path + 'partials/manufactureorderitem/manufactureorderitem.html?id=' + manufactureOrderItemId,
                                                        title: i18n.getKey('manufactureOrderItems'),
                                                        refresh: true
                                                    });
                                                }
                                            }


                                        ]

                                    }
                                }
                            ]
                        }
                    }
                },
                {
                    width: 120,
                    autoSizeColumn: false,
                    text: i18n.getKey('partner'),
                    dataIndex: 'manufactureOrderItem',
                    itemId: 'partner',
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
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 80,
                    tdCls: 'vertical-middle',
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    sortable: true
                },
                {
                    text: i18n.getKey('material'),
                    dataIndex: 'material',
                    xtype: 'gridcolumn',
                    width: 200,
                    tdCls: 'vertical-middle',
                    itemId: 'material',
                    sortable: false,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value.name + ' (' + value._id + ')' + '"';
                        return value.name + ' (' + value._id + ')'
                    }
                },
                {
                    text: i18n.getKey('qty'),
                    dataIndex: 'qty',
                    xtype: 'gridcolumn',
                    width: 70,
                    tdCls: 'vertical-middle',
                    itemId: 'qty',
                    sortable: false
                },
                {
                    text: i18n.getKey('descriptionAttr'),
                    dataIndex: 'material',
                    xtype: 'componentcolumn',
                    itemId: 'descriptionAttr',
                    tdCls: 'vertical-middle',
                    width: 250,
                    sortable: false,
                    renderer: function (value) {
                        var items = [];
                        var objectJson = {};
                        if (value.rtObject) {
                            if (value.rtObject.objectJSON) {
                                objectJson = Ext.Object.merge(value.rtObject.objectJSON, {});
                            }
                        }
                        if (value.spuRtTypeRtObject) {
                            if (value.spuRtTypeRtObject.objectJSON) {
                                objectJson = Ext.Object.merge(value.spuRtTypeRtObject.objectJSON, objectJson);
                            }
                        }
                        Ext.Object.each(objectJson, function (key, value) {
                            items.push({
                                title: key,
                                value: value
                            })
                        });
                        return JSCreateHTMLTable(items);
                    }
                },
                {
                    text: i18n.getKey('completedStatus'),
                    dataIndex: 'currentItems',
                    xtype: 'componentcolumn',
                    itemId: '',
                    width: 170,
                    tdCls: 'vertical-middle',
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        var isOutsourcing = record.get('isOutsourcing');
                        var isNeedPrint = record.get('isNeedPrint');
                        var qty = record.get('qty');
                        return controller.statusTemplate(isOutsourcing, isNeedPrint, value, qty, mainGrid.grid, FinishedProductItem, record);
                        /*var isOutsourcing = record.get('isOutsourcing');
                         var isNeedPrint = record.get('isNeedPrint');
                         var qty = record.get('qty');
                         var produceOperation = Ext.create('CGP.finishedproductitem.view.ProduceOperation',{
                         isOutsourcing: isOutsourcing,
                         isNeedPrint: isNeedPrint,
                         currentItems: value,
                         qty: qty,
                         grid: mainGrid.grid,
                         store: FinishedProductItem,
                         record: record
                         });
                         if(excludeStatusIds == '241635'){
                         return produceOperation;
                         }else{
                         return i18n.getKey('completed');
                         }
                         }*/
                    }
                },
                {
                    text: i18n.getKey('isTest'),
                    dataIndex: 'manufactureOrderItem',
                    itemId: 'isTest',
                    xtype: 'gridcolumn',
                    width: 90,
                    renderer: function (value, metadata) {
                        return i18n.getKey(value.orderLineItem.order.isTest);
                    }
                },
                {
                    text: i18n.getKey('isOutsourcing'),
                    dataIndex: 'isOutsourcing',
                    xtype: 'booleancolumn',
                    itemId: 'isOutsourcing',
                    tdCls: 'vertical-middle',
                    sortable: false,
                    renderer: function (value) {
                        return i18n.getKey(value);
                    }
                },
                {
                    text: i18n.getKey('isNeedPrint'),
                    dataIndex: 'isNeedPrint',
                    xtype: 'booleancolumn',
                    tdCls: 'vertical-middle',
                    itemId: 'isNeedPrint',
                    sortable: false,
                    renderer: function (value) {
                        return i18n.getKey(value);
                    }
                },
                {
                    text: i18n.getKey('statusHistories'),
                    width: 100,
                    tdCls: 'vertical-middle',
                    xtype: "componentcolumn",
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        return new Ext.Template('<table>' + '<tr>' + '<td>' + '<a style="text-decoration: none;" href="javascript:{handler}">' + i18n.getKey('check') + '</a>' + '</td>' + '</tr>' +
                            '</table>').apply({
                            handler: 'showFinishedProductItemHistores(' + record.get('id') + ')'
                        });


                    }
                },
                {
                    text: i18n.getKey('composingAddress'),
                    width: 150,
                    tdCls: 'vertical-middle',
                    xtype: "componentcolumn",
                    sortable: false,
                    renderer: function (value, metadata, record) {
                        var orderNumber = record.get('manufactureOrderItem').orderLineItem.order.orderNumber;
                        return new Ext.Template('<table>' + '<tr>' + '<td>' + '<a style="text-decoration: none;" href="javascript:{handler}">' + i18n.getKey('check') + i18n.getKey('address') + '</a>' + '</td>' + '</tr>' +
                            '</table>').apply({
                            handler: 'checkComposingAddress(\'' + orderNumber + '\')'
                        });


                    }
                }, {
                    width: 150,
                    autoSizeColumn: false,
                    text: i18n.getKey('supplier'),
                    dataIndex: 'manufactureOrderItem',
                    itemId: 'producePartner',
                    xtype: 'gridcolumn',
                    renderer: function (value, metadata, record) {
                        if (!Ext.isEmpty(value.orderLineItem.order.producePartner)) {
                            var result = value.orderLineItem.order.producePartner.name + '<' + value.orderLineItem.order.producePartner.id + '>';
                            metadata.tdAttr = 'data-qtip="' + result + '"';
                            return result;
                        }
                    }
                }
            ]
        },

        filterCfg: {
            layout: {
                type: 'table',
                columns: 4
            },
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('id'),
                    allowDecimals: false,
                    hideTrigger: true,
                    itemId: 'id'

                },
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
                }, {
                    name: 'manufactureOrderItem.orderLineItem.id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('orderLineItemId'),
                    itemId: 'orderLineItemId',
                    hideTrigger: true,
                    minValue: 0,
                    listeners: {
                        render: function (comp) {
                            var orderLineItemId = JSGetQueryString('orderLineItemId');
                            if (orderLineItemId) {
                                comp.setValue(parseInt(orderLineItemId));
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
                    editable: false,
                    matchFieldWidth: false,
                    haveReset: true,
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
                    id: 'isOutsourcing',
                    name: 'isOutsourcing',
                    xtype: 'combo',
                    triggerAction: 'all',
                    autoScroll: true,
                    editable: false,
                    haveReset: true,
                    fieldLabel: i18n.getKey('isOutsourcing'),
                    itemId: 'isOutsourcing',
                    displayField: 'type',
                    valueField: 'value',
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
                    name: 'status.id',
                    xtype: 'combo',
                    store: Ext.create('CGP.finishedproductitem.store.finishedProductItemStatuses'),
                    valueField: 'id',
                    editable: false,
                    displayField: 'name',
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'status',
                    listeners: {
                        afterrender: function (combo) {
                            var store = combo.getStore();
                            store.on('load', function () {
                                this.insert(0, {
                                    id: null,
                                    name: i18n.getKey('allStatus')
                                });
                                if (!combo.getValue())
                                    combo.select(store.getAt(0));
                            });
                        }
                    }
                },
                {
                    id: 'isNeedPrint',
                    name: 'isNeedPrint',
                    xtype: 'combo',
                    triggerAction: 'all',
                    autoScroll: true,
                    haveReset: true,
                    editable: false,
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
                    haveReset: true,
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
                    haveReset: true,
                    store: Ext.create('CGP.order.store.PartnerStore'),
                    displayField: 'name',
                    valueField: 'id',
                    fieldLabel: i18n.getKey('partner'),
                    itemId: 'partner',
                    matchFieldWidth: false
                },
                {
                    name: 'excludeStatusIds',
                    xtype: 'textfield',
                    hidden: true,
                    isLike: false,
                    value: excludeStatusIds,
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
                    haveReset: true,
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
                    haveReset: true,
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
        },
        listeners: {
            afterload: function (p) {
                p.filter.getComponent('orderNumber').on('change', function (comp, newValue, oldValue) {
                    if (newValue.length == 12) {
                        p.grid.getStore().loadPage(1);
                    }
                });
                controller.afterPageLoad(p);
            }
        }
    })
    window.showFinishedProductItemHistores = controller.showFinishedProductItemHistores;
    window.checkComposingAddress = function (orderNumber) {
        Ext.create('Ext.window.Window', {
            modal: true,
            autoShow: true,
            width: 310,
            border: false,
            height: 150,
            padding: '10 0 0 0',
            title: i18n.getKey('composingAddress'),
            bbar: [
                '->', {
                    xtype: 'button',
                    text: i18n.getKey('copy') + i18n.getKey('address'),
                    iconCls: 'icon_copy',
                    handler: function (comp) {
                        var select = document.getElementById('selectaddress-inputEl');
                        select.select();
                        document.execCommand('copy');
                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('copy') + i18n.getKey('success'))
                    }
                }
            ],
            items: [
                {
                    xtype: 'textarea',
                    name: 'select',
                    width: 290,
                    //itemId: 'selecttest',
                    id: 'selectaddress',
                    fieldStyle: 'border: 0;',
                    fieldLabel: false,
                    value: system.config.composited_file_directory + orderNumber
                }
            ]
        })
    },
        window.showOrderDetail = function (id, orderNumber) {

            var status = 1;
            JSOpen({
                id: 'orderDetails',
                url: path + 'partials/orderitemsmultipleaddress/main.html?id=' + id + '&status=' + status+ '&orderNumber=' + orderNumber,
                title: i18n.getKey('orderDetails') + '(' + i18n.getKey('orderNumber') + ':' + orderNumber + ')',
                refresh: true
            });
        }
});