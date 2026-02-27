/**
 * LeftCatetory
 * @Author: miao
 * @Date: 2021/11/6
 */
Ext.define("CGP.tax.view.productcategory.LeftCategoryQuery", {
    extend: "CGP.common.commoncomp.QueryGrid",
    alias: 'widget.leftcategoryquery',
    layout: 'border',
    // border:0,
    taxId: null,
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.tax.controller.Tax');
        var store = Ext.create('CGP.tax.store.TaxProductCategory');
        store.on('load',function (store, records, successful){
            me.down('grid').getSelectionModel().select(0);
        });
        me.gridCfg = {
            frame: true,
            selType:'rowmodel',
            viewConfig: {
                enableTextSelection: true
            },
            store: store,
            tbar: [
                "->",
                {
                    xtype: 'button',
                    text: i18n.getKey('add') + i18n.getKey('category'),
                    iconCls: 'icon_create',
                    handler: function () {
                        controller.editCatetory(me.down('grid'), null);
                    }
                }
            ],
            deleteAction: false,
            editAction: false,
            // selType: 'checkboxmodel',
            columns: [
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
                                Ext.Msg.confirm(i18n.getKey('info'),i18n.getKey('deleteConfirm'), function (select) {
                                    if (select == 'yes') {
                                        controller.deleteCatetory(grid, record);
                                    }
                                });
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
                    text: i18n.getKey('status'),
                    sortable: false,
                    hidden: !me.isView,
                    dataIndex: 'existsAreaCategoryTax',
                    width: 50,
                    renderer: function (value, metadata, rec) {
                        var displayValue = ' <img  style="width: 16px;height: 16px;vertical-align: middle;" src=' + path + 'ClientLibs/extjs/resources/themes/images/shared/32_32/cog_add.png>';
                        if (value) {
                            displayValue = ' <img  style="width: 16px;height: 16px;vertical-align: middle;" src=' + path + 'ClientLibs/extjs/resources/themes/images/shared/32_32/accept.png>';
                        }
                        return displayValue;
                    }
                }
            ],
            listeners:{
                select:function (rowModel, CategoryRcd, index, eOpts) {
                    var categoryGrid = rowModel.view.ownerCt;
                    var selecteds=categoryGrid.getSelectionModel().getSelection();
                    if(selecteds.length>1){
                        Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('一次只能选中一条数据!'));
                        return false;
                    }
                    var centerPanel = categoryGrid.ownerCt.ownerCt.down('centerproduct');
                    var productStore = centerPanel.down('grid').store;
                    centerPanel.categoryId = CategoryRcd.get('_id')
                    productStore.proxy.url = adminPath + 'api/productoftax/' + CategoryRcd.get('_id') + '/exists/products';
                    productStore.load();
                    centerPanel.down('uxfilter').reset();
                    centerPanel.down('toolbar').getComponent('productAddBtn').enable();
                    centerPanel.down('toolbar').getComponent('productDeleBtn').enable();
                }
            }
        };
        me.filterCfg = {
            height: 107,
            layout: {
                type: 'vbox',
                align: 'center'
            },
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
                    name: 'name',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('name'),
                    itemId: 'name'
                },
                {
                    name: 'tax._id',
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('taxId'),
                    itemId: 'taxId',
                    hidden:true,
                    value:me.taxId
                }
            ]
        };
        me.callParent(arguments);
    },


});