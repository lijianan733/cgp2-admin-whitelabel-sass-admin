/**
 * Created by nan on 2020/12/26
 */
Ext.define('CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.view.AddBackgroundWindow', {
    extend: 'Ext.window.Window',
    title: i18n.getKey('optional') + i18n.getKey('background'),
    modal: true,
    constrain: true,
    seriesId: null,
    width: 1000,
    height: 600,
    layout: 'fit',
    gridPanel: null,
    excludeIds: null,
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
                    if (selections.length > 0) {
                        for (var i = 0; i < selections.length; i++) {
                            win.gridPanel.store.proxy.data.push(selections[i].getData());
                        }
                        win.gridPanel.store.load();
                        win.close();
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
        var store = me.store = Ext.create('CGP.background.store.BackgroundStore', {
            autoLoad: true,
            proxy: {
                type: 'uxrest',
                url: adminPath + 'api/products/' + me.productId + '/backgrounds',
                reader: {
                    type: 'json',
                    root: 'data.content'
                }
            }
        });
        var backgroundSeriesStore = Ext.create('CGP.background.store.BackgroundSeriesStore')
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
                            xtype: 'gridcombo',
                            fieldLabel: i18n.getKey('category'),
                            allowBlank: false,
                            valueField: '_id',
                            displayField: 'name',
                            store: backgroundSeriesStore,
                            editable: false,
                            itemId: 'series',
                            name: 'series._id',
                            matchFieldWidth: false,
                            gridCfg: {
                                store: backgroundSeriesStore,
                                width: 450,
                                height: 400,
                                columns: [
                                    {
                                        text: i18n.getKey('id'),
                                        dataIndex: '_id',
                                        itemId: '_id',
                                    },
                                    {
                                        text: i18n.getKey('name'),
                                        dataIndex: 'name',
                                        itemId: 'name',
                                    }, {
                                        text: i18n.getKey('displayName'),
                                        dataIndex: 'displayName',
                                        itemId: 'displayName',
                                        flex: 1
                                    }
                                ],
                                bbar: Ext.create('Ext.PagingToolbar', {
                                    store: backgroundSeriesStore,
                                    displayInfo: true,
                                    displayMsg: '',
                                    emptyMsg: i18n.getKey('noData')
                                })
                            },
                        },
                        {
                            name: 'excludeIds',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('excludeIds'),
                            itemId: 'excludeIds',
                            hidden: true,
                            isNumber: false,
                            value: '[' + me.excludeIds.toString() + ']',
                            allowReset: false,//不允许重置时清除该字段里面的数据
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
                    columns: [
                        {
                            text: i18n.getKey('operation'),
                            sortable: false,
                            width: 120,
                            autoSizeColumn: false,
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata, record) {
                                return {
                                    xtype: 'toolbar',
                                    layout: 'column',
                                    style: 'padding:0',
                                    items: [
                                        {
                                            text: i18n.getKey('查看可用尺寸'),
                                            width: '100%',
                                            handler: function () {
                                                var win = Ext.create('CGP.background.view.ManageBackgroundImageWindow', {
                                                    backgroundId: record.getId(),
                                                    title: i18n.getKey('查看可用尺寸'),
                                                    readOnly: true,
                                                });
                                                win.show();
                                            }
                                        }
                                    ]
                                }
                            }
                        },
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
                            dataIndex: 'sourceFileName',
                            width: 180,
                            itemId: 'sourceFileName'
                        },
                        {
                            text: i18n.getKey('category'),
                            dataIndex: 'series',
                            itemId: 'series',
                            renderer: function (value, mateData, record) {
                                return value.name;
                            }
                        },
                        {
                            text: i18n.getKey('withColor'),
                            dataIndex: 'withColor',
                            itemId: 'withColor',
                            renderer: function (value, mateData, record) {
                                var controller = Ext.create('CGP.color.controller.Controller');
                                return controller.getColor(value);
                            }
                        },
                        {
                            dataIndex: 'fileUrl',
                            text: i18n.getKey('image'),
                            xtype: 'componentcolumn',
                            flex: 1,
                            width: 200,
                            tdCls: 'vertical-middle',
                            renderer: function (value, metadata, record) {
                                var imageUrl = value;
                                var preViewUrl = null;
                                var imageName = record.get('sourceFileName');
                                if (imageUrl.indexOf('.pdf') != -1) {
                                    imageUrl += '?format=jpg';
                                    preViewUrl = imageUrl + '&width=100&height=100';
                                } else {
                                    preViewUrl = imageUrl + '?width=100&height=100';
                                }
                                return {
                                    xtype: 'imagecomponent',
                                    src: preViewUrl,
                                    autoEl: 'div',
                                    style: 'cursor: pointer',
                                    width: 100,
                                    height: 100,
                                    listeners: {
                                        el: {
                                            click: function () {
                                                var win = Ext.create('Ext.ux.window.CheckImageWindow', {
                                                    src: imageUrl,
                                                    title: i18n.getKey('图片_') + imageName
                                                });
                                                win.show();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ];
        me.callParent();
    }
})