/**
 * CategoryGrid
 * @Author: miao
 * @Date: 2021/11/9
 */
Ext.define("CGP.tax.view.productcategory.CategoryGrid", {
    extend: "Ext.grid.Panel",
    alias: 'widget.categorygrid',
    selModel: {
        model: 'SINGLE'
    },
    taxId: null,
    isView: false,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.tax.controller.Tax');
        var filters = [
            {
                name: 'tax._id',
                type: 'string',
                value: me.taxId
            }];
        if (me.areaTax?._id) {
            filters.push({
                name: 'AreaTaxId',
                type: 'string',
                value: me.areaTax?._id
            })
        }
        var store = Ext.create('CGP.tax.store.TaxProductCategory', {
            // taxId: me.taxId
            params: {
                filter: Ext.JSON.encode(filters)
            }
        });

        me.store = store;
        me.store.on('load', function (store, records, successful) {
            me.getSelectionModel().select(0);
        });
        me.dockedItems = [
            {
                xtype: 'toolbar',
                dock: 'top',
                hidden: me.isView,
                items: [
                    '->',
                    {
                        xtype: 'button',
                        text: i18n.getKey('create') + i18n.getKey('productcategory'),
                        iconCls: 'icon_create',
                        handler: function () {
                            controller.editCatetory(me, null);
                        }
                    }
                ]
            }
        ];
        me.columns = [
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                dataIndex: '_id',
                width: 50,
                sortable: false,
                resizable: false,
                hidden: me.isView,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',
                        itemId: 'actionedit',
                        tooltip: 'Edit',
                        handler: function (grid, rowIndex, colIndex, icon, event, record) {
                            controller.editCatetory(grid, record);
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actionremove',
                        tooltip: 'Remove',
                        handler: function (grid, rowIndex, colIndex, icon, event, record) {
                            controller.deleteCatetory(grid, record);
                        }
                    },
                ]
            },
            {
                text: i18n.getKey('id'),
                sortable: false,
                dataIndex: '_id',
                width: 80,
                renderer: function (value, metadata, rec) {
                    metadata.tdAttr = 'data-qtip ="' + value + '"';
                    return value;
                }
            },
            {
                text: i18n.getKey('name'),
                sortable: false,
                dataIndex: 'name',
                flex: 1,
                renderer: function (value, metadata, rec) {
                    metadata.tdAttr = 'data-qtip ="' + value + '"';
                    return value;
                }
            },
            {
                xtype: 'componentcolumn',
                text: i18n.getKey('status'),
                sortable: false,
                hidden: !me.isView,
                dataIndex: 'existsAreaCategoryTax',
                width: 50,
                renderer: function (value, metadata, record, rowIndex, colIndex, store, view) {
                    var displayValue = ' <img  style="width: 16px;height: 16px;vertical-align: middle;" src=' + path + 'ClientLibs/extjs/resources/themes/images/shared/32_32/cog_add.png>';

                    if (value) {
                        displayValue = {
                            xtype: 'displayfield',
                            value: '<a href="#" id="click-deleteTaxRule" style="color: blue"> ' + ' <img  style="width: 16px;height: 16px;vertical-align: middle;" src=' + path + 'ClientLibs/extjs/resources/themes/images/shared/32_32/accept.png>' + '</a>',
                            listeners: {
                                render: function (display) {
                                    var clickElement = document.getElementById('click-deleteTaxRule');
                                    clickElement.addEventListener('click', function () {
                                        var centerPanel = view.ownerCt.ownerCt.down('categorytaxrule');
                                        controller.deleteCategoryTax(centerPanel, record);
                                    });
                                }
                            }
                        }
                    }
                    return displayValue;
                }
            }
        ];
        me.bbar = Ext.create('Ext.PagingToolbar', {//底端的分页栏
            store: store,
            displayInfo: false, // 是否 ? 示， 分 ? 信息
            displayMsg: false, //?示的分?信息
            emptyMsg: i18n.getKey('noData')
        });
        me.callParent(arguments);

    },
    // listeners: {
    //
    // }
});