/**
 * AreaTaxMain
 * @Author: miao
 * @Date: 2021/11/12
 */
Ext.define("CGP.tax.view.AreaTaxMain", {
    extend: "CGP.common.commoncomp.QueryGrid",
    alias: 'widget.areataxmain',
    initComponent: function () {
        var me = this;
        var taxId = JSGetQueryString('id');
        var countryId = JSGetQueryString('countryId'), countryName = JSGetQueryString('countryName');
        var souCountryId = JSGetQueryString('souCountryId'), souCountryName = JSGetQueryString('souCountryName');
        var controller = Ext.create('CGP.tax.controller.Tax');
        var store = Ext.create('CGP.tax.store.AreaTax', {
            // params: {
            //     filter: Ext.JSON.encode([{
            //         name: 'tax._id',
            //         type: 'string',
            //         value: taxId
            //     }])
            // }
        });

        me.filterCfg = {
            height: 107,
            defaults: {
                width: 260,
                isLike: false
            },
            frame: true,
            border: false,
            header: false,
            items: [
                {
                    name: '_id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('id'),
                    itemId: 'id',
                },
                {
                    name: 'description',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('description'),
                    itemId: 'description'
                },
                {
                    name: 'tax._id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('taxId'),
                    itemId: 'taxId',
                    hidden: true,
                    value: taxId
                }
            ]
        };
        me.gridCfg = {
            frame: true,
            viewConfig: {
                enableTextSelection: true
            },
            store: store,
            tbar: [
                {
                    itemId: 'areaTaxAdd',
                    text: i18n.getKey('add'),
                    iconCls: 'icon_add',
                    // disabled: true,
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt;
                        var record = Ext.create('CGP.tax.model.AreaTax');
                        record.set('area', {
                            country: {
                                id: countryId,
                                name: countryName,
                                clazz: 'com.qpp.cgp.domain.common.Country'
                            }
                        });
                        record.set('sourceArea', {
                            country: {
                                id: souCountryId,
                                name: souCountryName,
                                clazz: 'com.qpp.cgp.domain.common.Country'
                            }
                        });
                        record.set('tax', {_id: taxId, clazz: 'com.qpp.cgp.domain.tax.Tax'});
                        controller.editAreaTax(grid, record);
                    }
                },
                {
                    itemId: 'areaTaxDelete',
                    text: i18n.getKey('delete'),
                    iconCls: 'icon_delete',
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt;
                        controller.deleteAreaTax(grid);
                    }
                }
            ],
            deleteAction: false,
            editAction: false,
            selType: 'checkboxmodel',
            columns: [
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
                    width: 200,
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
            ],
        };
        me.callParent(arguments);
    },

});