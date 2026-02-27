/**
 * Created by nan on 2020/12/28
 * 增删改都是在对collection进行操作
 */
Ext.Loader.syncRequire([
    'CGP.background.model.BackgroundModel',
])
Ext.define('CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.view.Background', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    seriesId: null,
    title: i18n.getKey('background'),
    itemId: 'background',
    alias: 'widget.background',
    categoryId: null,
    rawData: null,
    isValid: function () {
        return true;
    },
    getValue: function () {
        var me = this;
        var result = [];
        if (me.rendered == true) {
            var container = me.items.items[0];
            var grid = container.grid;
            var store = grid.store;
           ;
            store.proxy.data.forEach(function (item) {
                result.push({
                    _id: item['_id'],
                    clazz: 'com.qpp.cgp.domain.background.Background'
                });
            });
            return {
                background: result
            };
        } else {
            return me.rawData;
        }
    },
    setValue: function (data) {
        var me = this;
        me.rawData = data.builderViewResourceConfig.backgrounds || [];
        var gridContainer = me.items.items[0];
        var grid = gridContainer.grid;
        grid.store.proxy.data = me.rawData;
        grid.store.load();
    },
    initComponent: function () {
        var me = this;
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab')
        var productId = builderConfigTab.productId;
        var store = Ext.create('Ext.data.Store', {
            data: [],
            proxy: {
                type: 'pagingmemory'
            },
            model: "CGP.background.model.BackgroundModel",
        });
        me.items = [
            {
                xtype: 'searchcontainer',
                filterCfg: {
                    height: 120,
                    hidden: true,
                },
                gridCfg: {
                    editAction: false,
                    deleteAction: true,
                    store: store,
                    defaults: {
                        width: 180
                    },
                    deleteActionHandler: function (view, rowIndex, colIndex, el, event, record, dom) {
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                            if (selector == 'yes') {
                                var grid = view.ownerCt;
                                var currentPage = record.store.currentPage;
                                var pageSize = record.store.pageSize;
                                var index = pageSize * (currentPage - 1) + rowIndex;
                                grid.store.proxy.data.splice(index, 1);
                                grid.store.load();
                            }
                        })
                    },
                    tbar: [
                        {
                            text: i18n.getKey('add'),
                            iconCls: 'icon_add',
                            handler: function (btn) {
                                var gridPanel = btn.ownerCt.ownerCt;
                                var win = Ext.create('CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.view.AddBackgroundWindow', {
                                    gridPanel: gridPanel,
                                    productId: productId,
                                    excludeIds: gridPanel.store.data.keys
                                });
                                win.show();
                            }
                        }
                    ],
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
                                                    title: '查看可用背景尺寸',
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
                                var imageName = record.get('sourceFileName');
                                var preViewUrl = null;
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
    },
    refreshData: function (record) {
        var me = this;
        me.items.items[0].grid.store.load();
    }
})