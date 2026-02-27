/**
 * Created by admin on 2020/2/27.
 */
Ext.define("CGP.product.view.pricingStrategyv2.view.PricingTable", {
    extend: 'Ext.ux.form.GridField',
    layout: 'fit',
    bodyStyle: 'padding:10px',
    Defaults: {
        width: 80
    },

    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.view.pricingStrategyv2.controller.PricingStrategy');
        me.store.sort([
            {
                property: 'from',
                direction: 'ASC'
            }]);
        me.gridConfig = {
            renderTo: me.gridContainer,
//            plugins: [
//                new Ext.grid.plugin.CellEditing({
//                    clicksToEdit: 2
//                })
//            ],
            store: me.store,
            minHeight: 200,
            layout: 'fit',
            tbar: [
                '<strong style="color: green;font-size: 110%">' + i18n.getKey('price') + i18n.getKey('table') + '</strong>',
                '<strong style="color: red;font-weight: bold;">' + i18n.getKey('注意：最后一条记录的最大数量必须为2147483647,以保证数据完备;如果不是,则保存后自动变为该值') + '</strong>',
                '->',
                {
                    text: i18n.getKey('add'),
                    iconCls: 'icon_add',
                    handler: function () {
                        controller.PricingWind(me, null);
                    }
                }
            ],
            columns: [
                {
                    xtype: 'rownumberer',
                    text: i18n.getKey('seqNo'),
                    sortable: false,
                    width: 50
                },
                {
                    xtype: 'actioncolumn',
                    itemId: 'actioncolumn',
                    dataIndex: '_id',
                    width: 50,
                    sortable: false,
                    resizable: false,
                    menuDisabled: true,
                    items: [
                        {
                            iconCls: 'icon_edit icon_margin',
                            itemId: 'actionedit',
                            tooltip: 'Edit',
                            handler: function (view, rowIndex, colIndex) {

                                var store = view.getStore();
                                var record = store.getAt(rowIndex);
                                controller.PricingWind(me, record);
                            }
                        },
                        {
                            iconCls: 'icon_remove icon_margin',
                            itemId: 'actionremove',
                            tooltip: 'Remove',
                            handler: function (view, rowIndex, colIndex) {
                                Ext.Msg.confirm(i18n.getKey('info'), '删除后会导致数量区间不连续，' + i18n.getKey('deleteConfirm'), function (select) {
                                    if (select == 'yes') {
                                        var store = view.getStore();
                                        store.removeAt(rowIndex);
                                    }
                                });
                            }
                        },
                    ]
                },
//                {
//                    text: i18n.getKey('index'),
//                    dataIndex: 'index',
//                    width: 80,
//                    renderer: function (value) {
//                        return value;
//                    }
//                },
                {
                    text: i18n.getKey('minQty'),
                    dataIndex: 'from',
                    width: 150,
                    sortable: false,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip ="' + value + '"';
                        return value;
                    },
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false,
                        allowDecimals: false,
                        minValue: 1
                    }
                },
                {
                    text: i18n.getKey('maxQty'),
                    sortable: false,
                    dataIndex: 'to',
                    width: 150,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip ="' + value + '"';
                        return value;
                    },
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false,
                        allowDecimals: false,
                        minValue: 1
                    }
                },
                {
                    text: i18n.getKey('price'),
                    sortable: false,
                    dataIndex: 'price',
                    width: 120,
                    editor: {
                        xtype: 'numberfield',
                        allowBlank: false,
                        minValue: 0.01
                    }
                },
                {
                    text: i18n.getKey('description'),
                    sortable: false,
                    dataIndex: 'description',
                    flex: 1,
                    renderer: function (value, metadata) {
                        metadata.tdAttr = 'data-qtip ="' + value + '"';
                        return value;
                    },
                    editor: {
                        xtype: 'textfield'
                    }
                }
            ]
        };
        me.callParent(arguments);
    }
})

