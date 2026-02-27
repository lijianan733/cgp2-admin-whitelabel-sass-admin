Ext.Loader.syncRequire(['CGP.common.store.ProductStore', 'CGP.common.store.MaterialStore']);
Ext.onReady(function () {
    var store = Ext.create('CGP.manufactureorderitem.store.ManuFactureOrderItemStore');
    var materialStore = Ext.data.StoreManager.lookup('materialStore');
    var controller = Ext.create('CGP.manufactureorderitem.controller.Controller');
    var excludeStatusIds = JSGetQueryString('excludeStatusIds');
    var productStore = Ext.create('CGP.common.store.ProductStore', {
        storeId: 'productStore',
    });
    var viewport = Ext.create('Ext.ux.ui.GridPage', {
        accessControl: [],
        permissions: ['update', 'delete'],//设置是否隐藏编辑和删除按钮
        gridCfg: {
            store: store,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 100,
                    tdCls: 'vertical-middle',
                    xtype: 'gridcolumn',
                    itemId: 'id',
                    sortable: true
                },
                {
                    text: i18n.getKey('operation'),
                    sortable: false,
                    width: 105,
                    autoSizeColumn: false,
                    tdCls: 'vertical-middle',//这个css在html文件那里定义的
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
                                                text: i18n.getKey('checkFinalProduct'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    var checkFinalProductId = record.get('id');
                                                    JSOpen({
                                                        id: 'finishedproductitempage',
                                                        url: path + "/partials/finishedproductitem/finishedproductitem.html?manufactureOrderId=" + checkFinalProductId,
                                                        title: '成品项管理 所有状态',
                                                        refresh: true
                                                    });
                                                }
                                            }
                                            ,
                                            {
                                                text: i18n.getKey('checkMaterial'),
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
                                            },
                                            {
                                                text: i18n.getKey('checkOrderLineItem'),
                                                disabledCls: 'menu-item-display-none',
                                                handler: function () {
                                                    var orderLineItem = record.get('orderLineItem').id;
                                                    var isTest = record.get('orderLineItem').isTest;
                                                    JSOpen({
                                                        id: 'orderlineitempage',
                                                        url: path + "partials/orderlineitem/orderlineitem.html" +
                                                            "?id=" + orderLineItem +
                                                            '&isTest2=' + isTest,
                                                        title: '订单项管理 所有状态',
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
                    text: i18n.getKey('descriptionAttr'),
                    dataIndex: 'material',
                    width: 350,
                    tdCls: 'vertical-middle',
                    xtype: 'gridcolumn',
                    itemId: 'skuAttribute',
                    sortable: false,
                    renderer: function (value) {
                        var returnstr = {};
                        var rtObjectdata = '';
                        var spuRtTypeRtObjectdata = '';
                        if (value.rtObject) {
                            for (var item in value.rtObject.objectJSON) {
                                returnstr['rtObject' + item] = value.rtObject.objectJSON[item];
                                rtObjectdata += '<p >' + item + ':' + returnstr['rtObject' + item] + '</p>'
                            }
                        }
                        if (value.spuRtTypeRtObject) {
                            for (var item in value.spuRtTypeRtObject.objectJSON) {
                                returnstr['spuRtTypeRtObject' + item] = value.spuRtTypeRtObject.objectJSON[item];
                                spuRtTypeRtObjectdata += '<p >' + item + ':' + returnstr['spuRtTypeRtObject' + item] + '</p>'
                            }
                        }
                        return rtObjectdata + spuRtTypeRtObjectdata;

                    }

                },
                {
                    text: i18n.getKey('orderLineItemId'),
                    dataIndex: 'orderLineItem',
                    width: 150,
                    tdCls: 'vertical-middle',
                    xtype: 'gridcolumn',
                    renderer: function (value) {
                        return value.id;
                    },
                    itemId: 'orderLineItemId',
                    sortable: false
                },
                {
                    text: i18n.getKey('productOrderStatus'),
                    width: 150,
                    dataIndex: 'status',
                    xtype: 'gridcolumn',
                    tdCls: 'vertical-middle',
                    itemId: 'status',
                    sortable: false,
                    renderer: function (value) {
                        return '<font color=red>' + i18n.getKey(value.name) + '</font>';
                    }
                },
                {
                    text: i18n.getKey('material'),
                    dataIndex: 'material',
                    width: 200,
                    flex: 1,
                    tdCls: 'vertical-middle',
                    xtype: 'gridcolumn',
                    itemId: 'material',
                    sortable: false,
                    renderer: function (value) {
                        return value.name + '(' + value._id + ')';
                    }
                }
            ]
        },
        filterCfg: {
            layout: {
                type: 'table',
                columns: 4
            },
            defaults: {},
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
                    name: 'orderLineItem.id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('orderLineItemId'),
                    hideTrigger: true,
                    itemId: 'orderLineItemId'
                },
                {
                    name: 'materialId',
                    xtype: 'gridcombo',
                    /*listeners:{
                     change: function(comp,newValue,oldValue){
                     comp.ownerCt.getComponent('product.id').setValue(newValue._id);
                     }
                     },*/
                    itemId: 'material',
                    fieldLabel: i18n.getKey('material'),
                    multiSelect: false,
                    displayField: 'name',
                    valueField: '_id',
                    editable: false,
                    labelAlign: 'right',
                    //value: getQueryString('productId'),
                    store: materialStore,
                    queryMode: 'remote',
                    isComboQuery: true,
                    matchFieldWidth: false,
                    haveReset: true,
                    pickerAlign: 'bl',
                    gridCfg: {
                        store: materialStore,
                        height: 300,
                        width: 600,
                        columns: [{
                            text: i18n.getKey('id'),
                            width: 80,
                            dataIndex: '_id'
                        }, {
                            text: i18n.getKey('name'),
                            width: 150,
                            dataIndex: 'name'
                        }/*, {
                         text: i18n.getKey('category'),
                         width: 150,
                         dataIndex: 'category'
                         }*/, {
                            text: i18n.getKey('type'),
                            width: 150,
                            dataIndex: 'type'
                        }],
                        tbar: {
                            layout: {
                                type: 'column'
                            },
                            defaults: {
                                width: 170,
                                isLike: false,
                                padding: 2
                            },
                            items: [{
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('id'),
                                name: '_id',
                                isLike: false,
                                labelWidth: 40
                            }, {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('name'),
                                name: 'name',
                                labelWidth: 40
                            }, '->', {
                                xtype: 'button',
                                text: i18n.getKey('search'),
                                handler: controller.searchProduct,
                                width: 80
                            }, {
                                xtype: 'button',
                                text: i18n.getKey('clear'),
                                handler: controller.clearParams,
                                width: 80
                            }]
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
                    name: 'status.id',
                    xtype: 'combo',
                    store: Ext.create('CGP.manufactureorderitem.store.ManufactureOrderItemStatusesStore'),
                    valueField: 'id',
                    editable: false,
                    haveReset: true,
                    displayField: 'name',
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'status',
                }, {
                    name: 'excludeStatusIds',
                    xtype: 'textfield',
                    hidden: true,
                    isLike: false,
                    value: excludeStatusIds,
                    itemId: 'excludeStatusIds'
                }
            ]
        },
        listeners: {
            /*afterload: function (p) {
                p.filter.getComponent('orderNumber').on('change',function(comp, newValue, oldValue){
                    if(newValue == 12){
                        p.grid.getStore().loadPage(1);
                    }
                });
            }*/
        }
    });

});
