/**
 * Created by nan on 2021/9/8
 */
Ext.Loader.syncRequire([
    'CGP.pcresourcelibrary.view.CategoryGridCombo'
])
Ext.define('CGP.pcresourcelibrary.view.PCResourceItemGrid', {
        extend: 'Ext.ux.grid.ComponentGrid',
        alias: 'widget.pcresourceitemgrid',
        resourceLibraryId: null,
        resourceType: null,
        categoryId: null,//指定的分类Id
        store: null,
        initComponent: function () {
            var me = this;
            var resourceLibraryId = me.resourceLibraryId;
            me.store = me.store || Ext.create('CGP.pcresourcelibrary.store.PCResourceItemStore', {
                autoLoad: false,
            });
            me.componentViewCfg = {
                columns: 5,
                multiSelect: true,
                tableAlign: 'left',
                actionBarCfg: null,//编辑和删除的区域配置
                editHandler: function (btn) {
                    var toolbar = btn.ownerCt;
                    var record = toolbar.record;
                    var componentGrid = toolbar.view;
                    var win = Ext.create("CGP.pcresourcelibrary.view.EditPCResourceItemWin", {
                        resourceItemGrid: componentGrid,
                        record: record,
                        categoryId: componentGrid.ownerCt.ownerCt.categoryId,
                        resourceType: componentGrid.ownerCt.ownerCt.resourceType,
                        resourceLibraryId: JSGetQueryString('id')
                    });
                    win.show();
                },
                deleteHandler: function (btn) {
                    var toolbar = btn.ownerCt;
                    var record = toolbar.record;
                    var componentGrid = toolbar.view;
                    Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                        if (selector == 'yes') {
                            componentGrid.store.remove(record);
                            componentGrid.store.sync({
                                callback: function () {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                                }
                            });
                        }
                    })
                },
                renderer: function (record, view) {
                    var me = this;
                    var displayDescription = record.get('displayDescription');
                    var id = record.getId();
                    var displayName = displayDescription ? displayDescription.displayName : null
                    var preViewUrl = '';
                    var imageUrl = '';
                    if (displayDescription.clazz == 'com.qpp.cgp.domain.pcresource.DisplayImage') {
                        imageUrl = imageServer + displayDescription.thumbnail;
                        if (imageUrl.indexOf('.pdf') != -1) {
                            imageUrl += '?format=jpg';
                            preViewUrl = imageUrl + '&width=100&height=100';
                        } else {
                            preViewUrl = imageUrl + '?width=100&height=100';
                        }
                    } else {
                        var canvas = document.createElement("canvas");
                        var ctx = canvas.getContext("2d");
                        canvas.width = '300';
                        canvas.height = '300';
                        ctx.fillStyle = displayDescription.colorCode;
                        ctx.fillRect(0, 0, 300, 300);
                        imageUrl = canvas.toDataURL("image/png");
                        preViewUrl = imageUrl;
                    }
                    return {
                        xtype: "container",
                        width: 200,
                        layout: {
                            type: 'vbox',
                            align: 'center',
                            pack: 'center'
                        },
                        fieldLabel: i18n.getKey('name'),
                        items: [
                            {
                                xtype: 'displayfield',
                                fieldStyle: {
                                    textAlign: 'center'
                                },
                                readOnly: true,
                                value: displayName,
                                width: '100%',
                            },
                            {
                                xtype: 'imagecolumn',
                                width: 150,
                                dataIndex: 'thumbnail',
                                text: i18n.getKey('languageImgText'),
                                buildUrl: function (value, metadata, record) {
                                    return preViewUrl;
                                },
                                buildPreUrl: function (value, metadata, record) {
                                    return preViewUrl;
                                },
                                buildTitle: function (value, metadata, record) {
                                    return `${i18n.getKey('check')} < ${preViewUrl} > 预览图`;
                                },
                            },
                            {
                                xtype: 'displayfield',
                                fieldStyle: {
                                    textAlign: 'center'
                                },
                                readOnly: true,
                                value: '<div>' + i18n.getKey('id') + ':' + id + '</div>',
                                width: '100%',
                            },
                        ]
                    };
                }
            };
            me.filterCfg = {
                items: [
                    {
                        name: 'library._id',
                        xtype: 'textfield',
                        isLike: false,
                        value: resourceLibraryId,
                        hidden: true,
                        fieldLabel: i18n.getKey('pcResourceLibrary'),
                        itemId: 'library'
                    },
                    {
                        xtype: 'categorygridcombo',
                        allowBlank: true,
                        name: 'category._id',
                        itemId: 'category',
                        isLike: false,
                        valueType: 'idReference',
                        fieldLabel: i18n.getKey('category'),
                        categoryId: me.categoryId,
                        resourceType: me.resourceType,
                        diyGetValue: function () {
                            return this.getValue()
                        },
                    },
                    {
                        name: 'tag',
                        xtype: 'combo',
                        itemId: 'tag',
                        fieldLabel: i18n.getKey('tags'),
                        valueField: 'value',
                        displayField: 'display',
                        isLike: false,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'display'],
                            data: [],
                        }),
                        diyGetValue: function () {
                            var data = this.getValue();
                            if (data) {
                                return '[' + data.toString() + ']';
                            }
                        }
                    },
                    {
                        xtype: 'textfield',
                        name: 'displayDescription.displayName',
                        itemId: 'displayName',
                        isLike: false,
                        fieldLabel: i18n.getKey('displayName'),
                    }
                ]
            };
            me.tbarCfg = {
                btnCreate: {
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt.ownerCt;
                        var win = Ext.create("CGP.pcresourcelibrary.view.EditPCResourceItemWin", {
                            resourceItemGrid: grid,
                            resourceType: grid.resourceType,
                            categoryId: grid.categoryId,
                            resourceLibraryId: resourceLibraryId
                        });
                        win.show();
                    }
                },
                btnDelete: {
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt.ownerCt;
                        var selections = grid.getView().getSelectionModel().getSelection();
                        if (selections.length > 0) {
                            grid.store.remove(selections);
                            grid.store.sync({
                                callback: function () {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                                }
                            })
                        }
                    }
                },
                btnExport: {
                    disabled: false,
                    iconCls: 'icon_create',
                    width: 100,
                    text: i18n.getKey('批量新建'),
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt.ownerCt;
                        var win = Ext.create("CGP.pcresourcelibrary.view.BatchCreateWindow", {
                            resourceItemGrid: grid,
                            resourceType: grid.resourceType,
                            categoryId: grid.categoryId,
                            resourceLibraryId: resourceLibraryId
                        });
                        win.show();
                    }
                },
                btnImport: {
                    disabled: false,
                    iconCls: 'icon_edit',
                    width: 100,
                    text: i18n.getKey('批量新建'),
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt.ownerCt;
                        var selections = grid.getView().getSelectionModel().getSelection();
                        if (selections.length > 0) {
                            grid.store.remove(selections);
                            grid.store.sync({
                                callback: function () {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'));
                                }
                            })
                        }
                    }
                }
            };
            me.callParent();
        }
    }
)