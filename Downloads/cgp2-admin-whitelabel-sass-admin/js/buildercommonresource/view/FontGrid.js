/**
 * Created by nan on 2020/11/4
 */
Ext.define('CGP.buildercommonresource.view.FontGrid', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    alias: 'widget.fontgrid',
    editPage: 'edit.html',
    controller: null,
    languageId: null,
    defaultFontId: null,
    initComponent: function () {
        var me = this;
        var columns = [
            {
                text: i18n.getKey('id'),
                width: 90,
                dataIndex: '_id',
                itemId: 'id',
                isLike: false,
            },
            {
                text: i18n.getKey('fontFamily'),
                dataIndex: 'fontFamily',
                width: 100,
                itemId: 'fontFamily'
            },
            {
                text: i18n.getKey('displayName'),
                dataIndex: 'displayName',
                width: 165,
                itemId: 'displayName'
            },
            {
                text: i18n.getKey('wordRegExp'),
                dataIndex: 'wordRegExp',
                width: 120,
                itemId: 'wordRegExp'
            }, {
                text: i18n.getKey('字体支持样式'),
                dataIndex: 'fontStyleKeys',
                width: 350,
                xtype: 'uxarraycolumnv2',
                itemId: 'fontStyleKeys',
                maxLineCount: 5,
                lineNumber: 3,
                renderer: function (value, mate, record) {
                    return value;

                }
            },
            {
                text: i18n.getKey('language'),
                dataIndex: 'languages',
                itemId: 'language',
                width: 350
                , xtype: 'uxarraycolumnv2',
                sortable: false,
                maxLineCount: 5,
                lineNumber: 3,
                renderer: function (value, mate, record) {
                    var result = '';
                    if (value.locale) {
                        result = value.code.code + '-' + value.locale.code;
                    } else {
                        result = value.code.code;
                    }
                    return result;
                }
            }
        ];
        var filterItems = [
            {
                name: '_id',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('id'),
                isLike: false,
                itemId: 'id'
            },
            {
                name: 'fontFamily',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('fontFamily'),
                itemId: 'fontFamily'
            },
            {
                name: 'displayName',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('displayName'),
                itemId: 'displayName'
            }, {
                name: 'languages',
                xtype: 'combo',
                fieldLabel: i18n.getKey('language'),
                itemId: 'language',
                editable: false,
                isLike: false,
                valueField: 'id',
                displayField: 'name',
                store: Ext.create('CGP.common.store.Language')
            }
        ];
        me.controller = Ext.create('CGP.buildercommonresource.controller.Controller');
        me.gridCfg = {
            store: Ext.create("CGP.buildercommonresource.store.DiyGroupFontStore", {
                autoLoad: true,
            }),
            editAction: false,
            deleteActionHandler: function (gridview, rowIndex, colIndex, view, event, record, dom) {
                var id = record.getId();
                var grid = gridview.ownerCt;
                var queryGrid = grid.ownerCt;
                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                    if (selector == 'yes') {
                        queryGrid.controller.operateResource('font', 'DELETE', id, grid);
                    }
                })
            },
            tbar: {
                xtype: 'uxstandardtoolbar',
                disabledButtons: ['config', 'export', 'import'],
                hiddenButtons: ['read', 'clear'],
                itemId: 'toolbar',
                btnCreate: {
                    text: i18n.getKey('add'),
                    iconCls: 'icon_add',
                    handler: function (btn) {
                        var queryGrid = btn.ownerCt.ownerCt.ownerCt;
                        var win = Ext.create('Ext.window.Window', {
                            modal: true,
                            constrain: true,
                            width: 900,
                            title: i18n.getKey('font'),
                            layout: 'fit',
                            items: [
                                {
                                    xtype: 'searchcontainer',
                                    itemId: 'grid',
                                    gridCfg: {
                                        store: Ext.create('CGP.buildercommonresource.store.DiyGroupFontStore', {
                                            autoLoad: true,
                                            proxy: {
                                                type: 'uxrest',
                                                url: adminPath + 'api/commonbuilderresourceconfigs/V2/remain/fonts',
                                                reader: {
                                                    type: 'json',
                                                    root: 'data.content'
                                                }
                                            },
                                        }),
                                        deleteAction: false,
                                        editAction: false,
                                        columns: [
                                            {
                                                text: i18n.getKey('id'),
                                                width: 90,
                                                dataIndex: '_id',
                                                itemId: 'id',
                                                isLike: false,
                                            },
                                            {
                                                text: i18n.getKey('fontFamily'),
                                                dataIndex: 'fontFamily',
                                                width: 100,
                                                itemId: 'fontFamily'
                                            },
                                            {
                                                text: i18n.getKey('displayName'),
                                                dataIndex: 'displayName',
                                                width: 165,
                                                itemId: 'displayName'
                                            },
                                            {
                                                text: i18n.getKey('wordRegExp'),
                                                dataIndex: 'wordRegExp',
                                                width: 120,
                                                itemId: 'wordRegExp'
                                            },
                                            {
                                                text: i18n.getKey('字体支持样式'),
                                                dataIndex: 'fontStyleKeys',
                                                width: 350,
                                                xtype: 'uxarraycolumnv2',
                                                itemId: 'fontStyleKeys',
                                                maxLineCount: 5,
                                                lineNumber: 3,
                                                renderer: function (value, mate, record) {
                                                    return value;

                                                }
                                            }
                                        ],
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
                                            queryGrid.controller.operateResource('font', 'POST', ids, queryGrid.grid);
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
                                    queryGrid.controller.operateResource('font', 'DELETE', ids, grid);
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
            header: {
                title: i18n.getKey('query'),
                height: 35
            },
            items: filterItems
        };
        me.callParent();
    }
})