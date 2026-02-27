/**
 * Created by nan on 2020/11/5
 */
Ext.Loader.syncRequire([])
Ext.define('CGP.buildercommonresource.view.BackgroundColorGrid', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    alias: 'widget.backgroundcolorgrid',

    initComponent: function () {
        var me = this;
        var columns = [
            {
                text: i18n.getKey('id'),
                dataIndex: '_id',
                itemId: '_id',
            }, {
                text: i18n.getKey('color') + i18n.getKey('name'),
                dataIndex: 'colorName',
                itemId: 'colorName',
                width: 100,
            }, {
                text: i18n.getKey('description'),
                dataIndex: 'description',
                itemId: 'description',
                width: 200,
            }, {
                text: i18n.getKey('type'),
                dataIndex: 'clazz',
                itemId: 'clazz',
                width: 100,
                renderer: function (value, mateData, record) {
                    if (value == 'com.qpp.cgp.domain.common.color.RgbColor') {
                        return 'RGB颜色';
                    } else if (value == 'com.qpp.cgp.domain.common.color.CmykColor') {
                        return 'CMYK颜色';

                    } else if (value == 'com.qpp.cgp.domain.common.color.SpotColor') {
                        return 'SPOT颜色';

                    }
                }
            },
            {
                text: i18n.getKey('value'),
                dataIndex: 'clazz',
                width: 200,
                itemId: 'value',
                renderer: function (value, mateData, record) {
                    if (value == 'com.qpp.cgp.domain.common.color.RgbColor') {
                        return 'R:' + record.get('r') + ' G:' + record.get('g') + ' B:' + record.get('b') + '';
                    } else if (value == 'com.qpp.cgp.domain.common.color.CmykColor') {
                        return 'C:' + record.get('c') + ' M:' + record.get('m') + ' Y:' + record.get('y') + ' K:' + record.get('k') + '';
                    }
                }
            }, {
                text: i18n.getKey('显示颜色'),
                itemId: 'color',
                dataIndex: 'color',
/*
                flex: 1,
*/
                minWidth: 100
            }
        ];
        var filterItems = [
            {
                name: '_id',
                xtype: 'textfield',
                hideTrigger: true,
                isLike: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('id'),
                itemId: '_id'
            }, {
                name: 'colorName',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('color') + i18n.getKey('name'),
                itemId: 'colorName'
            }, {
                name: 'description',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            }, {
                name: 'clazz',
                xtype: 'combo',
                isLike: false,
                fieldLabel: i18n.getKey('type'),
                itemId: 'clazz',
                editable: false,
                valueField: 'value',
                displayField: 'display',
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        'value', 'display'
                    ],
                    data: [
                        {
                            value: 'com.qpp.cgp.domain.common.color.RgbColor',
                            display: 'RGB颜色'
                        },
                        {
                            value: 'com.qpp.cgp.domain.common.color.CmykColor',
                            display: 'CMYK颜色'
                        },
                        {
                            value: 'com.qpp.cgp.domain.common.color.SpotColor',
                            display: 'SPOT颜色'
                        }
                    ]
                })
            }];
        me.controller = Ext.create('CGP.buildercommonresource.controller.Controller');
        me.gridCfg = {
            store: Ext.create('CGP.buildercommonresource.store.CommonBackgroundColorStore', {}),
            frame: false,
            editAction: false,
            deleteActionHandler: function (gridview, rowIndex, colIndex, view, event, record, dom) {
                var id = record.getId();
                var grid = gridview.ownerCt;
                var queryGrid = grid.ownerCt;
                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                    if (selector == 'yes') {
                        queryGrid.controller.operateResource('backgroundColor', 'DELETE', id, grid);
                    }
                })
            },
            tbar: {
                xtype: 'uxstandardtoolbar',
                disabledButtons: ['config', 'export', 'import'],
                hiddenButtons: ['read', 'clear'],
                itemId: 'toolbar',
                btnCreate: {
                    handler: function (btn) {
                        var queryGrid = btn.ownerCt.ownerCt.ownerCt;
                        var win = Ext.create('Ext.window.Window', {
                            modal: true,
                            constrain: true,
                            width: 900,
                            title:  i18n.getKey('color'),
                            layout: 'fit',
                            items: [
                                {
                                    xtype: 'searchcontainer',
                                    itemId: 'grid',
                                    gridCfg: {
                                        store: Ext.create('CGP.buildercommonresource.store.CommonBackgroundColorStore', {
                                            proxy: {
                                                type: 'uxrest',
                                                url: adminPath + 'api/commonbuilderresourceconfigs/V2/remain/backgroundColors',
                                                reader: {
                                                    type: 'json',
                                                    root: 'data.content'
                                                }
                                            },
                                        }),
                                        deleteAction: false,
                                        editAction: false,
                                        columns: columns,
                                    },
                                    filterCfg: {
                                        header: false,
                                        minHeight: 60,
                                        items: filterItems
                                    }
                                }
                            ],
                            bbar: [
                                '->',
                                {
                                    xtype: 'button',
                                    iconCls: 'icon_save',
                                    text: i18n.getKey('confirm'),
                                    handler: function (btn) {
                                        var win = btn.ownerCt.ownerCt;
                                        var searchcontainer = win.getComponent('grid');
                                        var grid = searchcontainer.grid;
                                        var ids = grid.selectedRecords.keys;
                                        if (ids.length > 0) {
                                            queryGrid.controller.operateResource('backgroundColor', 'POST', ids, queryGrid.grid);
                                            win.close();
                                        }
                                    }
                                },
                                {
                                    xtype: 'button',
                                    iconCls: 'icon_cancel',
                                    text: i18n.getKey('cancel'),
                                    handler: function (btn) {
                                        var win = btn.ownerCt.ownerCt;
                                        win.close();
                                    }
                                }
                            ]
                        });
                        win.show();
                    }
                },
                btnDelete: {
                    handler: function (btn) {
                        var queryGrid = btn.ownerCt.ownerCt.ownerCt;
                        var grid = queryGrid.grid;
                        var ids = grid.selectedRecords.keys;
                        if (ids.length > 0) {
                            Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                                if (selector == 'yes') {
                                    queryGrid.controller.operateResource('backgroundColor', 'DELETE', ids, grid);
                                    grid.store.load();

                                }
                            })
                        }

                    }
                },
            },
            columns: columns
        };
        me.filterCfg = {
            minHeight: 120,
            items: filterItems
        };
        me.callParent();
    }
})