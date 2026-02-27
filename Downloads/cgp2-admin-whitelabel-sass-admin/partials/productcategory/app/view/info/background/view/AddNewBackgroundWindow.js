/**
 * Created by nan on 2020/12/26
 */
Ext.define('CGP.productcategory.view.info.background.view.AddNewBackgroundWindow', {
    extend: 'Ext.window.Window',
    title: i18n.getKey('optional') + i18n.getKey('background'),
    modal: true,
    constrain: true,
    seriesId: null,
    width: 1000,
    height: 600,
    grid: null,
    layout: 'fit',
    categoryId: null,
    categoryBackgroundGrid: null,
    listeners: {
        show: function () {
            var win = this;
            win.setZIndex(1024);
        },
    },
    bbar: {
        items: [
            '->',
            {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    var gridContainer = win.items.items[0];
                    var selections = gridContainer.grid.getSelectionModel().getSelection();
                    var controller = Ext.create('CGP.productcategory.view.info.background.controller.Controller');
                    if (selections.length > 0) {
                        for (var i = 0; i < selections.length; i++) {
                            controller.categoryAddBackgroundSeries(selections[i].get('_id'), win.categoryId, gridContainer);
                        }
                        win.close();
                        win.categoryBackgroundGrid.store.load();
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    win.close();
                }
            }
        ]
    },
    initComponent: function () {
        var me = this;
        Ext.WindowManager.zseed = 1000;
        var store = me.store = Ext.create('Ext.data.Store', {
            fields: [
                '_id', 'name', 'displayName'
            ],
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/productCategories/' + me.categoryId + '/excludeBackgroundSeries',
                reader: {
                    type: 'json',
                    root: 'data.content'
                }
            },
            autoLoad: true
        });
        me.items = [
            {
                xtype: 'searchcontainer',
                filterCfg: {
                    height: 80,
                    header: false,
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
                            name: 'sourceFileName',
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
                    deleteAction: false,
                    store: store,
                    defaults: {
                        width: 180
                    },
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
    }
})