/**
 * Created by nan on 2021/11/4
 */
Ext.Loader.syncRequire([
    'CGP.pcresourcelibrary.view.CategoryGridCombo'
])
Ext.define('CGP.pcresourcelibrary.view.PCResourceItemGridV2', {
        extend: 'CGP.common.commoncomp.QueryGrid',
        alias: 'widget.pcresourceitemgridv2',
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
            me.gridCfg = {
                editActionHandler: function (grid, rowIndex, colIndex, view, event, record, dom) {//编辑按钮的操作
                    var componentGrid = grid.ownerCt.ownerCt;
                    var win = Ext.create("CGP.pcresourcelibrary.view.EditPCResourceItemWin", {
                        resourceItemGrid: componentGrid.grid,
                        record: record,
                        categoryId: componentGrid.categoryId,
                        resourceType: componentGrid.resourceType,
                        resourceLibraryId: JSGetQueryString('id')
                    });
                    win.show();
                },
                deleteActionHandler: function (grid, rowIndex, colIndex, view, event, record, dom) {//编辑按钮的操作
                    var componentGrid = grid.ownerCt;
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
                tbar: {
                    xtype: 'uxstandardtoolbar',
                    disabledButtons: ['config'],
                    hiddenButtons: ['read', 'clear'],
                    itemId: 'toolbar',
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
                            var grid = btn.ownerCt.ownerCt;
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
                        width: 120,
                        text: i18n.getKey('批量修改分类'),
                        handler: function (btn) {
                            var grid = btn.ownerCt.ownerCt;
                            var selections = grid.getView().getSelectionModel().getSelection();
                            if (selections.length > 0) {
                                var ids = [];
                                selections.forEach(function (item) {
                                    ids.push(item.getId())
                                });
                                var win = Ext.create('Ext.window.Window', {
                                    modal: true,
                                    constrain: true,
                                    title: i18n.getKey('选择分类'),
                                    layout: 'fit',
                                    items: [
                                        {
                                            xtype: 'categorygridcombo',
                                            allowBlank: true,
                                            name: 'categoryId',
                                            itemId: 'categoryId',
                                            isLike: false,
                                            margin: '10 25 10 25',
                                            valueType: 'idReference',
                                            fieldLabel: i18n.getKey('category'),
                                            categoryId: me.categoryId,
                                            resourceType: me.resourceType,
                                            diyGetValue: function () {
                                                return this.getValue()
                                            },
                                        }
                                    ],
                                    bbar: {
                                        xtype: 'bottomtoolbar',
                                        saveBtnCfg: {
                                            handler: function (btn) {
                                                var category = btn.ownerCt.ownerCt.getComponent('categoryId');
                                                var categroyId = category.getValue();
                                                var controller = Ext.create('CGP.pcresourcelibrary.controller.Controller');
                                                controller.batchUpdateCategory(ids, categroyId, grid);
                                                win.close();
                                            }
                                        }
                                    }
                                });
                                win.show();
                            } else {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请选择需要修改的配置'));
                            }
                        }
                    }
                },
                store: me.store,
                columns: [
                    {
                        text: i18n.getKey('id'),
                        dataIndex: '_id',
                    },
                    /*{
                        text: i18n.getKey('category'),
                        dataIndex: 'category',
                        itemId: 'category',
                    },*/
                    {
                        text: i18n.getKey('tag'),
                        dataIndex: 'tag',
                        width: 200,
                    },/*, {
                        text: i18n.getKey('languageFilter'),
                        dataIndex: 'languageFilter',
                        itemId: 'languageFilter',
                    },*/
                    {//描述信息
                        text: i18n.getKey('displayName'),
                        dataIndex: 'displayDescription',
                        width: 200,
                        renderer: function (value, mateData, record) {
                            return value.displayName;

                        }
                    },
                    {
                        text: i18n.getKey('resources'),
                        dataIndex: 'resource',
                        xtype: 'componentcolumn',
                        width: 200,
                        renderer: function (value, mateData, record) {
                            var str = JSCreateHTMLTable([
                                {
                                    title: i18n.getKey('resources') + i18n.getKey('type'),
                                    value: value.clazz.split('.').pop()
                                },
                                {
                                    title: i18n.getKey('resources') + i18n.getKey('id'),
                                    value: value._id
                                }
                            ])
                            return {
                                xtype: 'component',
                                html: str,
                            }
                        }
                    },
                    {
                        text: i18n.getKey('thumbnail'),
                        dataIndex: 'displayDescription',
                        xtype: 'componentcolumn',
                        width: 120,
                        renderer: function (value, mateData, record) {
                            if (value.clazz == 'com.qpp.cgp.domain.pcresource.DisplayColor') {
                                return {
                                    xtype: 'displayfield',
                                    value: ('<a class=colorpick style="background-color:' + value.colorCode + '"></a>' + value.colorCode)
                                }
                            } else {
                                var imageUrl = imageServer + value.thumbnail;
                                var imageName = value.displayName;
                                var preViewUrl = null;
                                if (imageUrl.indexOf('.pdf') != -1) {
                                    imageUrl += '?format=jpg';
                                } else {
                                }
                                return {
                                    xtype: 'imagecomponent',
                                    src: imageUrl,
                                    autoEl: 'div',
                                    style: 'cursor: pointer',
                                    width: 50,
                                    height: 50,
                                    imgCls: 'imgAutoSize',
                                    listeners: {
                                        afterrender:function(view){
                                            Ext.create('Ext.ux.window.ImageViewer', {
                                                imageSrc: imageUrl,
                                                actionItem: view.el.dom.id,
                                                winConfig: {
                                                    title: `${i18n.getKey('check')} < ${value.thumbnail} > 预览图`
                                                },
                                                viewerConfig: null,
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    },
                ]
            };
            me.filterCfg = {
                header: false,
                height: 80,
                bodyStyle: {
                    borderColor: 'silver'
                },
                items: [
                    {
                        name: '_id',
                        xtype: 'textfield',
                        isLike: false,
                        fieldLabel: i18n.getKey('id'),
                    },
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
            me.callParent();
        }
    }
)