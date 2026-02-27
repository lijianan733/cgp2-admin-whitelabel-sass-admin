/**
 * AreaTaxGrid
 * @Author: miao
 * @Date: 2021/11/4
 */
Ext.define("CGP.tax.view.AreaTaxGrid", {
    extend: "Ext.grid.Panel",
    alias: 'widget.areataxgrid',
    multiSelect: true,
    selType: 'checkboxmodel',
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.tax.controller.Tax');
        me.store = Ext.create('CGP.tax.store.AreaTax', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'tax._id',
                    type: 'string',
                    value: me.taxId
                }])
            }
        });
        if (me.memoryData) {
            me.store = Ext.create('CGP.tax.store.AreaTaxLocal', {
                data: []
            });
        }
        me.store.on('load', function (store, records, successful) {
            if (me.ownerCt.id == 'taxEdit') {
                var country = me.ownerCt.getComponent('country');
                var sourCountry = me.ownerCt.down('uxfieldset [itemId="sourceForm"] [itemId="country"]');
                if (store.count() > 0) {
                    country.setReadOnly(true);
                    country.setFieldStyle('background-color:silver');
                    sourCountry.setReadOnly(true);
                    sourCountry.setFieldStyle('background-color:silver');
                }
                else{
                    country.setReadOnly();
                    country.setFieldStyle('background-color:white');
                    sourCountry.setReadOnly();
                    sourCountry.setFieldStyle('background-color:white');
                }
            }
        });
        me.columns = [
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                dataIndex: '_id',
                width: 50,
                sortable: false,
                resizable: false,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',
                        itemId: 'actionedit',
                        tooltip: 'Edit',
                        handler: function (grid, rowIndex, colIndex, icon, event, record) {
                            controller.editAreaTax(grid, record);
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actionremove',
                        tooltip: 'Remove',
                        handler: function (grid, rowIndex, colIndex, icon, event, record) {
                            Ext.Msg.confirm(i18n.getKey('info'), i18n.getKey('deleteConfirm'), function (select) {
                                if (select == 'yes') {
                                    controller.deleAreaTax(grid, record);
                                }
                            });
                        }
                    },
                ]
            },
            {
                text: i18n.getKey('operation'),
                dataIndex: '_id',
                xtype: 'componentcolumn',
                width: 100,
                renderer: function (value, metadata, record) {
                    return {
                        xtype: 'toolbar',
                        layout: 'column',
                        style: 'padding:0',
                        default: {
                            width: 100
                        },
                        items: [
                            {
                                text: i18n.getKey('options'),
                                width: '100%',
                                flex: 1,
                                menu: {
                                    xtype: 'menu',
                                    items: [
                                        {
                                            text: i18n.getKey('productcategory') + i18n.getKey('taxRule'),
                                            itemId: 'categoryAreaTaxRule',
                                            disabledCls: 'menu-item-display-none',
                                            handler: function () {
                                                // top.remove('categoryAreaTax');
                                                // top.add({
                                                //     id: 'categoryAreaTax',
                                                //     title: i18n.getKey('product') + i18n.getKey('category')+i18n.getKey('area')+i18n.getKey('taxRule'),
                                                //     closable: true,
                                                //     taxId: record.get('tax')._id,
                                                //     areaTax:record.getData(),
                                                //     fromArea:true
                                                // });
                                                // controller.categoryTaxWind(record.get('tax')._id, record.getData(), record.get('_id'));
                                                controller.categoryTaxWind(record.get('tax')._id, record.getData());

                                            }
                                        }
                                    ],

                                }
                            }
                        ]
                    };
                }
            },
            {
                text: i18n.getKey('id'),
                sortable: false,
                dataIndex: '_id',
                width: 100,
                renderer: function (value, metadata, rec) {
                    metadata.tdAttr = 'data-qtip ="' + value + '"';
                    return value;
                }
            },
            {
                text: i18n.getKey('description'),
                sortable: false,
                dataIndex: 'description',
                width:200,
                renderer: function (value, metadata, rec) {
                    metadata.tdAttr = 'data-qtip ="' + value + '"';
                    return value;
                }
            },
            {
                text: i18n.getKey('targetArea'),
                sortable: false,
                dataIndex: 'area',
                width: 120,
                renderer: function (value, metadata, rec) {
                    var displayValue = value?.country?.name + ", " + (value?.state?.name || '') + ", " + (value.city || '');
                    metadata.tdAttr = 'data-qtip ="' + displayValue + '"';
                    return displayValue;
                }
            },
            {
                text: i18n.getKey('sourceArea'),
                sortable: false,
                dataIndex: 'sourceArea',
                width: 120,
                renderer: function (value, metadata, rec) {
                    var displayValue = value?.country?.name + ", " + (value?.state?.name || '') + ', ' + (value.city || '');
                    metadata.tdAttr = 'data-qtip ="' + displayValue + '"';
                    return displayValue;
                }
            },
            {
                text: i18n.getKey('taxRate'),
                sortable: false,
                dataIndex: 'rate',
                width: 80,
                renderer: function (value, metadata, rec) {
                    // metadata.tdAttr = 'data-qtip ="' + value + '"';
                    return value;
                }
            },
            {
                text: i18n.getKey('additionalAmount'),
                sortable: false,
                dataIndex: 'additionalAmount',
                width: 120,
                renderer: function (value, metadata, rec) {
                    return value;
                }
            },
            {
                text: i18n.getKey('amountThreshold'),
                sortable: false,
                dataIndex: 'amountThreshold',
                width: 200,
                renderer: function (value, metadata, rec) {
                    return value;
                }
            }
        ];
        me.bbar = Ext.create('Ext.PagingToolbar', {
            store: me.store,
            displayInfo: true, // 是否 ? 示， 分 ? 信息
            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
            emptyMsg: i18n.getKey('noData')
        });
        me.callParent(arguments);
    },
    isValid: function () {
        return true;
    }
});