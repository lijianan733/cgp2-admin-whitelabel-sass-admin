/**
 * Created by nan on 2020/12/26
 */
Ext.define('CGP.productcategory.view.info.background.view.CategoryBackgroundGrid', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    seriesId: null,
    title: i18n.getKey('可用背景分类'),
    itemId: 'categoryBackgroundGrid',
    alias: 'widget.categorybackgoundpanel',
    categoryId: null,
    initComponent: function () {
        var me = this;
        var store = Ext.create('CGP.productcategory.view.info.background.store.CategoryBackgroundStore', {
            categoryId: me.categoryId,
            autoLoad: false,
        });
        me.items = [
            {
                xtype: 'searchcontainer',
                filterCfg: {
                    height: 120,
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    defaults: {
                        width: 280,
                        isLike: false
                    },
                    items: [

                        {
                            name: '_id',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('id'),
                            itemId: 'id'
                        },
                        {
                            name: 'name',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('name'),
                            itemId: 'name'
                        },
                        {
                            name: 'displayName',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('displayName'),
                            itemId: 'displayName'
                        },
                    ]
                },
                gridCfg: {
                    editAction: false,
                    deleteAction: true,
                    store: store,
                    defaults: {
                        width: 180
                    },
                    deleteActionHandler: function (view, colInde, rowInde, el, event, record, dom) {
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                            if (selector == 'yes') {
                                var controller = Ext.create('CGP.productcategory.view.info.background.controller.Controller');
                                var categoryId = view.ownerCt.ownerCt.ownerCt.categoryId;
                                var backgroundId = record.getId();
                                controller.deleteCategoryBackground(backgroundId, categoryId, view.ownerCt);
                            }
                        })
                    },
                    tbar: [
                        {
                            text: i18n.getKey('add'),
                            iconCls: 'icon_add',
                            handler: function (btn) {
                                var gridPanel = btn.ownerCt.ownerCt;
                                var win = Ext.create('CGP.productcategory.view.info.background.view.AddNewBackgroundWindow', {
                                    categoryId: me.categoryId,
                                    mainPanel: me.ownerCt,
                                    categoryBackgroundGrid: gridPanel
                                });
                                win.show();
                            }
                        }
                    ],
                    columns: [
                        {
                            text: i18n.getKey('id'),
                            dataIndex: '_id',
                            width: 180,
                            tdCls: 'vertical-middle',
                            itemId: 'id',
                            sortable: true
                        },
                        {
                            text: i18n.getKey('name'),
                            dataIndex: 'name',
                            width: 180,
                            itemId: 'name'
                        },
                        {
                            text: i18n.getKey('displayName'),
                            dataIndex: 'displayName',
                            flex: 1,
                            itemId: 'displayName'
                        },
                    ]
                }
            }
        ];
        me.callParent();
    },
    refreshData: function (record) {
        var me = this;
        me.categoryId = record.getId();
        /*    var categoryField = me.items.items[0].filter.getComponent('category');
            categoryField.setValue(me.categoryId);*/
        var store = me.items.items[0].grid.store;
        store.proxy.url = adminPath + 'api/productCategories/' + me.categoryId + '/backgroundSeries';
        store.load();
    }
})