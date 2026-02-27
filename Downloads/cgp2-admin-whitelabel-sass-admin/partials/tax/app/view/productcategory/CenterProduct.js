/**
 * CenterProduct
 * @Author: miao
 * @Date: 2021/11/6
 */
Ext.define("CGP.tax.view.productcategory.CenterProduct", {
    extend: "CGP.common.commoncomp.QueryGrid",
    alias: 'widget.centerproduct',
    minWidth: 300,
    border: false,
    tbarCfg: {
        disabledButtons: ['config'],
        itemId: 'toolbar',
        btnExport: {
            disabled: true
        },
        btnImport: {
            disabled: true
        }
    },
    constructor: function (config) {
        var me = this;

        me.callParent(arguments);

    },
    initComponent: function () {
        var me = this;
        // var store = Ext.create('CGP.tax.store.CategoryProduct', {
        //     categoryId: me.categoryId
        // });
        var store = Ext.create('CGP.tax.store.CategoryProduct', {
            categoryId: me.categoryId
        });
        me.gridCfg = {
            frame: true,
            viewConfig: {
                enableTextSelection: true
            },
            store: store,
            tbar: [
                {
                    xtype: 'button',
                    itemId:'productAddBtn',
                    text: i18n.getKey('add'),
                    iconCls: 'icon_create',
                    disabled :true,
                    handler: function () {
                        var store = this.ownerCt.ownerCt.getStore();
                        me.controller.addProductWindow(me.categoryId, store);
                    }
                },
                {
                    xtype: 'button',
                    itemId:'productDeleBtn',
                    text: i18n.getKey('delete'),
                    iconCls: 'icon_delete',
                    disabled :true,
                    handler: function (btn) {
                        me.controller.deleteSelectProducts(me);
                    }
                }
            ],
            deleteAction: false,
            editAction: false,
            selType: 'checkboxmodel',
            columns: [
                {
                    xtype: 'actioncolumn',
                    width: 40,
                    itemId: 'actioncolumn',
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    tdCls: 'vertical-middle',
                    items: [
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actiondelete',
                            tooltip: i18n.getKey('delete'),
                            handler: function (view, rowIndex, colIndex, item, e, record) {
                                Ext.Msg.confirm(i18n.getKey('info'),i18n.getKey('deleteConfirm'), function (select) {
                                    if (select == 'yes') {
                                        var productIds=[];
                                        productIds.push(record.get("id"));
                                        me.controller.deleteProducts(me.down('grid').store,me.categoryId, productIds);
                                    }
                                });
                            }
                        }
                    ]
                },
                {
                    text: i18n.getKey('id'),
                    dataIndex: 'id',
                    width: 100,
                    itemId: 'id'
                },
                {
                    text: i18n.getKey('model'),
                    dataIndex: 'model',
                    width: 200,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value
                    }
                },
                {
                    text: i18n.getKey('name'),
                    dataIndex: 'name',
                    width: 200,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value
                    }
                },
                {
                    text: i18n.getKey('sku'),
                    dataIndex: 'sku',
                    width: 180,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip="' + value + '"';
                        return value
                    }
                }
                ,
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'type'
                }


            ]
        };
        me.filterCfg = {
            height: 107,
            defaults: {
                width: 280
            },
            frame: true,
            border: false,
            header: false,
            items: [
                {
                    name: 'id',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id',
                    minValue: 1,
                    allowDecimals: false,
                    allowExponential: false,
                    hideTrigger: true
                },
                {
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    name: 'model',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('model'),
                    itemId: 'model'
                },
                {
                    name: 'type',
                    fieldLabel: i18n.getKey('type'),
                    itemId: 'type',
                    xtype: 'combo',
                    isLike: true,
                    editable: false,
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: 'Sku', value: 'SKU'
                            },
                            {
                                type: 'Configurable', value: 'Configurable'
                            }
                        ]
                    }),
                    displayField: 'type',
                    valueField: 'value',
                    queryMode: 'local'

                },
                {
                    name: 'sku',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('sku'),
                    itemId: 'sku'
                }
            ]
        };
        me.callParent(arguments);
    }
});