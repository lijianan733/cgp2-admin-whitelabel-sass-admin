/**
 * Created by nan on 2021/5/24
 * 管理特例化的pcs预处理配置
 *  有列表布局预处理
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.GametilePCSForm'
]);
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.ManageSpecialConfigPanel', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    outTab: null,
    controller: null,
    listeners: {
        afterrender: function () {
            //检测产品锁定状态
            var page = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        }
    },
    filterCfg: {
        header: false,
        minHeight: 85,
        items: [
            {
                name: '_id',
                xtype: 'textfield',
                autoStripChars: true,
                allowExponential: false,
                isLike: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('id'),
                itemId: '_id'
            },
            {
                name: 'description',
                xtype: 'textfield',
                isLike: false,
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            },
            {
                name: 'clazz',
                xtype: 'textfield',
                hidden: true,
                isLike: false,
                value: 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.PCSGridTemplatePreprocessCommonConfig',
                fieldLabel: i18n.getKey('clazz'),
                itemId: 'clazz'
            }
        ]
    },
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.controller.Controller');
        me.tbarCfg = {
            xtype: 'uxstandardtoolbar',
            disabledButtons: [],
            hiddenButtons: ['read', 'clear', 'sepQuery'],
            btnExport: {
                disabled: true
            },
            btnImport: {
                disabled: true
            },
            btnRead: {
                handler: function () {
                    me.grid.getStore().loadPage(1);
                }
            },
            btnClear: {
                handler: function () {
                    me.filter.reset();
                }
            },
            btnCreate: {
                xtype: 'splitbutton',//连续值的添加约束按钮
                width: 100,
                menu: new Ext.menu.Menu({
                    items: [
                        {
                            text: i18n.getKey('新建通用网格预处理'),
                            handler: function (btn) {
                                var outTab = me.ownerCt;
                                controller.editGridPcsPreprocess(null, null, me.PMVTId, outTab);
                            }
                        },
                        {
                            text: i18n.getKey('新建gametile预处理'),
                            handler: function (btn) {
                                var win = Ext.create('Ext.window.Window', {
                                    modal: true,
                                    constrain: true,
                                    height: 600,
                                    width: 900,
                                    maximizable: true,
                                    title: i18n.getKey('使用Gametile模板快速新建'),
                                    layout: 'fit',
                                    items: [
                                        {
                                            xtype: 'gametilepcsform',
                                            header: false,
                                            PMVTId: me.PMVTId,
                                            itemId: 'gameTilePCSForm',
                                            contentData: me.contentData,
                                        }
                                    ],
                                    bbar: [
                                        '->',
                                        {
                                            xtype: 'button',
                                            text: i18n.getKey('save'),
                                            iconCls: 'icon_save',
                                            handler: function (btn) {
                                                var win = btn.ownerCt.ownerCt;
                                                var form = win.getComponent('gameTilePCSForm');
                                                if (form.isValid()) {
                                                    var data = form.diyGetValue();
                                                    console.log(data);
                                                    var result = controller.builderGameTileData(data);
                                                    controller.saveRecord(result, me.PMVTId, null, i18n.getKey('addsuccessful'), {createOrEdit: 'create'}, null);
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
                                });
                                win.show();
                            }
                        },
                    ]
                }),
                handler: function (view) {
                    var outTab = me.ownerCt;
                    controller.editGridPcsPreprocess(null, null, me.PMVTId, outTab);
                }
            },
            btnDelete: {
                handler: function (view) {
                    var grid = view.ownerCt.ownerCt;
                    Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteSelectedComfirm'), function (selector) {
                        if (selector == 'yes') {
                            var selected = grid.getSelectionModel().getSelection();
                            var keys = Ext.Array.slice(grid.getSelectionModel().selected.keys);
                            if (!Ext.isEmpty(keys))
                                grid.view.loadMask.show();
                            var store = grid.getStore();
                            Ext.each(keys, function (key) {
                                var record = store.getById(key) || store.getById(key + '');//处理现在id有些是字符串，有些是int
                                store.remove(record);
                            }, this);
                            store.sync({
                                callback: function (o, m) {
                                    grid.view.loadMask.hide();
                                    if (o.proxy.reader.rawData.success) {
                                        var msg = Ext.ux.util.getMsg(o);
                                        //if (msg) Ext.ux.util.prompt(msg);
                                        Ext.ux.util.prompt('删除成功！');
                                    } else {
                                        Ext.ux.util.prompt(o.proxy.reader.rawData.data.message);
                                        store.reload({
                                            callback: function () {
                                                grid.getSelectionModel().select(selected);
                                            }
                                        });
                                    }
                                }
                            });

                        }
                    })
                }
            },
        };
        me.gridCfg = {
            store: Ext.create("CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.store.GridPCSPreProcessStore", {
                PMVTId: me.PMVTId,
                listeners: {
                    load: function (store, record) {//过滤掉非连续值的属性,过滤掉自己这个属性
                        store.filterBy(function (item) {
                            return item.data.clazz == 'com.qpp.cgp.domain.pcspreprocess.operatorconfig.PCSGridTemplatePreprocessCommonConfig';
                        })
                    }
                }
            }),
            frame: false,
            columnDefaults: {
                width: 200,
                autoSizeColumn: true
            },
            tbar: me.tbarCfg,
            editActionHandler: function (grid, rowIndex, colIndex, view, event, record, dom) {//编辑按钮的操作
                controller.editGridPcsPreprocess(record.getId(), null, me.PMVTId, me.ownerCt);
            },
            deleteActionHandler: function (gridView, rowIndex, colIndex, view, event, record, dom) {//编辑按钮的操作
                var grid = gridView.ownerCt;
                var store = grid.store;
                Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (selector) {
                    if (selector == 'yes') {
                        var mask = grid.setLoading();
                        controller.deleteRecord(store, record, me.PMVTId, mask)
                    }
                })
            },
            columns: [
                {
                    dataIndex: '_id',
                    text: i18n.getKey('id'),
                },
                {
                    dataIndex: 'description',
                    width: 200,
                    text: i18n.getKey('description'),
                },
                {
                    dataIndex: 'index',
                    text: i18n.getKey('index'),
                }, {
                    dataIndex: 'condition',
                    width: 200,
                    xtype: 'valueexcomponentcolumn',
                    nullCanEdit: false,//在渲染时，如果valueEx值为null,是否返回null，还是一个编辑的按钮
                    canChangeValue: false,//是否可以通过编辑改变record的
                    readOnly: true,
                    text: i18n.getKey('condition'),
                }, {
                    dataIndex: 'itemQty',
                    flex: 1,
                    xtype: 'valueexcomponentcolumn',
                    nullCanEdit: false,//在渲染时，如果valueEx值为null,是否返回null，还是一个编辑的按钮
                    canChangeValue: false,//是否可以通过编辑改变record的
                    readOnly: true,
                    text: i18n.getKey('itemQty'),
                },
            ]
        };
        me.callParent();
    }
})
