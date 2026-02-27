/**
 * Created by nan on 2020/12/18
 */

Ext.define('CGP.background.view.CenterGridPanel', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    seriesId: null,
    initComponent: function () {
        var me = this;
        var store = Ext.create('CGP.background.store.BackgroundStore');
        me.items = [
            {
                xtype: 'searchcontainer',
                hidden: true,
                filterCfg: {
                    height: 130,
                    header: {
                        height: 40,
                        title: i18n.getKey('background')
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
                            itemId: 'sourceFileName'
                        },
                        {
                            name: 'series._id',
                            allowReset: false,
                            xtype: 'textfield',
                            hidden: true,
                            itemId: 'series'
                        }
                    ]
                },
                gridCfg: {
                    editAction: false,
                    deleteAction: true,
                    store: store,
                    defaults: {
                        width: 180
                    },
                    tbar: {
                        xtype: 'uxstandardtoolbar',
                        /*items: [

                            {
                                itemId: 'btnDelete',
                                text: i18n.getKey('delete'),
                                iconCls: 'icon_delete',
                                handler: function (btn) {

                                }
                            }

                        ],*/
                        btnCreate: {
                            handler: function (btn) {
                                var gridPanel = btn.ownerCt.ownerCt;
                                var centerPanel = gridPanel.ownerCt.ownerCt;
                                var win = Ext.create('CGP.background.view.AddBackGroundWindow', {
                                    gridPanel: gridPanel,
                                    seriesId: centerPanel.seriesId
                                });
                                win.show();
                            }
                        },
                        btnDelete: {
                            handler: function (btn) {
                                var gridPanel = btn.ownerCt.ownerCt;
                                gridPanel.destorySelected();
                            }
                        },
                        hiddenButtons: ['read', 'clear', 'config', 'help'],
                        disabledButtons: ['export', 'import'],
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
                                            text: i18n.getKey('管理可用尺寸'),
                                            width: '100%',
                                            handler: function () {
                                                var win = Ext.create('CGP.background.view.ManageBackgroundImageWindow', {
                                                    backgroundId: record.getId(),
                                                    title: '管理可用背景尺寸',
                                                    readOnly: false,
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
                            xtype: 'imagecolumn',
                            tdCls: 'vertical-middle',
                            width: 200,
                            dataIndex: 'fileUrl',
                            text: i18n.getKey('image'),
                            //订单的缩略图特殊位置
                            buildUrl: function (value, metadata, record) {
                                var imageUrl = value;
                                if (imageUrl.indexOf('.pdf') != -1) {
                                    imageUrl += '?format=jpg';
                                }
                                return imageUrl;
                            },
                            //订单的缩略图特殊位置
                            buildPreUrl: function (value, metadata, record) {
                                var imageUrl = value;
                                if (imageUrl.indexOf('.pdf') != -1) {
                                    imageUrl += '?format=jpg';
                                }
                                return imageUrl;
                            },
                            buildTitle: function (value, metadata, record) {
                                var imageName = record.get('sourceFileName');
                                return `${i18n.getKey('check')} < ${imageName} > 预览图`;
                            }
                        },
                        {
                            text: i18n.getKey('withColor'),
                            dataIndex: 'withColor',
                            itemId: 'withColor',
                            width: 200,
                            flex: 1,
                            renderer: function (value, mateData, record) {
                                var controller = Ext.create('CGP.color.controller.Controller');
                                return controller.getColor(value);
                            }
                        },
                    ]
                }
            }
        ];
        me.callParent();
    },
    refreshData: function (seriesId) {
        var me = this;
        var searchContainer = me.items.items[0];
        searchContainer.show();
        var series = searchContainer.filter.getComponent('series');
        series.setValue(seriesId);
        me.seriesId = seriesId;
        searchContainer.grid.store.load();
    }
})