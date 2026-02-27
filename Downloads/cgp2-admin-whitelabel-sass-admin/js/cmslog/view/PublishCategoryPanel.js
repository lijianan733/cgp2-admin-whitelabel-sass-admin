/**
 * @Description:
 * @author nan
 * @date 2022/5/11
 */
Ext.Loader.syncRequire([
    'CGP.cmslog.view.CategoryTree',
    'CGP.cmsconfig.store.CmsConfigStore',
    'CGP.cmslog.view.PublishCategoryConfirmWin'
])
Ext.define('CGP.cmslog.view.PublishCategoryPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.publishcategorypanel',
    modal: true,
    constrain: true,
    maximizable: true,
    usedOptionIds: null,//已经被使用了的选项id,
    outGird: null,
    record: null,
    layout: {
        type: 'border'
    },
    defaults: {
        width: '100%'
    },
    initComponent: function () {
        var me = this;
        me.items = [
            /*      {
                      xtype: 'toolbar',
                      height: 35,
                      color: 'black',
                      bodyStyle: 'border-color:white;',
                      border: '0 0 1 0',
                      margin: '0 0 5 0',
                      items: [
                          {
                              xtype: 'displayfield',
                              fieldLabel: false,
                              itemId: 'title',
                              value: "<font style= ' color:green;font-weight: bold'>" + '可发布类目列表' + '</font>'
                          },
                      ]
                  },*/
            {
                xtype: 'categorytree',
                loadMask: true,
                region: 'west',
                width: 630,
                split: true,
                itemId: 'categoryTree',
                header: {
                    title: '可发布类目列表'
                },
                listeners: {
                    selectionchange: function (selModel) {
                        var treePanel = this;
                        var panel = treePanel.ownerCt;
                        var selectedRecordGrid = panel.getComponent('selectedRecordGrid');
                        var data = treePanel.selectedRecords.items;
                        data = data.map(function (record) {
                            return record.raw;
                        });
                        selectedRecordGrid.store.proxy.data = data;
                        selectedRecordGrid.store.load();
                    }
                }
            },
            /*
                        {
                            xtype: 'toolbar',
                            color: 'black',
                            bodyStyle: 'border-color:white;',
                            border: '0 0 1 0',
                            margin: '0 0 5 0',
                            items: [
                                {
                                    xtype: 'displayfield',
                                    fieldLabel: false,
                                    itemId: 'title',
                                    value: "<font style= ' color:green;font-weight: bold'>" + '待发布配置列表' + '</font>'
                                },
                            ]
                        },
            */
            {
                xtype: 'componentgrid',
                itemId: 'selectedRecordGrid',
                bodyStyle: {
                    borderColor: 'silver',
                },
                flex: 1,
                region: 'center',
                store: Ext.create('Ext.data.Store', {
                    xtype: 'store',
                    fields: [
                        'name',
                        {
                            name: 'relationOptions',
                            type: 'array'
                        },
                        {
                            name: 'showAsProductCatalog',
                            type: 'boolean'
                        }
                    ],
                    proxy: {
                        type: 'pagingmemory'
                    },
                    data: []
                }),
                autoScroll: true,
                title: '待发布配置列表',
                componentViewCfg: {
                    multiSelect: false,
                    tableAlign: 'center',
                    actionBarCfg: {
                        hidden: true,
                    },//编辑和删除的区域配置
                    editHandler: function (btn) {
                    },
                    deleteHandler: function (btn) {
                    },
                    renderer: function (record, view) {
                        var me = this;
                        var rowIndex = record.index;
                        var store = record.store;
                        var page = store.currentPage;
                        if (page > 1) {
                            rowIndex += (page - 1) * store.pageSize;
                        }
                        var displayData = [
                            {
                                title: i18n.getKey('id'),
                                value: record.raw.id
                            },
                            {
                                title: i18n.getKey('name'),
                                value: record.raw.name
                            },
                            {
                                title: i18n.getKey('type'),
                                value: record.raw.showAsProductCatalog ? '<font color="orange">产品类目</font>' : '<font color="green">营销类目</font>'
                            },
                        ];
                        rowIndex = rowIndex + 1;
                        return {
                            xtype: "panel",
                            width: 200,
                            height: 120,
                            border: 1,
                            margin: 5,
                            autoScroll: true,
                            itemId: 'container_' + rowIndex,
                            record: record,
                            view: view,
                            index: rowIndex,
                            borderColor: 'red',
                            fieldLabel: i18n.getKey('name'),
                            tbar: [
                                {
                                    text: i18n.getKey('发布预览'),
                                    cls: 'a-btn',
                                    border: false,
                                },
                                '->',
                                {
                                    iconCls: 'x-tool-img',
                                    componentCls: 'btnOnlyIcon',
                                    handler: function (btn) {
                                        var panel = btn.ownerCt.ownerCt;
                                        var record = panel.record;
                                        if (view.store.proxy.data) {//处理本地数据
                                            view.store.proxy.data.splice(rowIndex - 1, 1);
                                        }
                                        view.store.load();
                                        var categoryTree = panel.view.ownerCt.ownerCt.ownerCt.getComponent('categoryTree');
                                        var recordId = record.raw.id;
                                        var deselectRecord = categoryTree.selectedRecords.getByKey(recordId);
                                        categoryTree.getSelectionModel().deselect(deselectRecord);
                                        categoryTree.selectedRecords.removeAtKey(recordId);
                                    }
                                }
                            ],
                            layout: {
                                type: 'vbox',
                                pack: 'center',
                                align: 'center'
                            },
                            bodyStyle: {
                                borderColor: 'silver',
                            },
                            items: [
                                {
                                    xtype: 'displayfield',
                                    value: JSCreateHTMLTable(displayData),
                                    fieldStyle: {
                                        textAlign: 'center'
                                    }
                                }
                            ]
                        };
                    }
                },
                tbarCfg: {
                    btnCreate: {
                        iconCls: 'server_go',
                        text: i18n.getKey('publish'),
                        hidden: false,
                        handler: function (btn) {
                            var panel = btn.ownerCt.ownerCt;
                            var selectedRecords = panel.items.items[0].store.data;
                            var selectedData = [];
                            if (selectedRecords.getCount() > 0) {
                                selectedRecords.each(function (item) {
                                    selectedData.push(item.getData());
                                });
                                var win = Ext.create('CGP.cmslog.view.PublishCategoryConfirmWin', {
                                    selectedData: selectedData
                                });
                                win.show();
                            } else {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请选择要发布的类目配置'));
                            }
                        }
                    },
                    btnDelete: {
                        iconCls: 'icon_clear',
                        text: i18n.getKey('clear'),
                        hidden: false,
                        disabled: false,
                        handler: function (btn) {
                            var panel = btn.ownerCt.ownerCt;
                            var categoryTree = panel.ownerCt.ownerCt.getComponent('categoryTree');
                            var selectedRecords = categoryTree.selectedRecords;
                            Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否清空所有记录?'), function (selector) {
                                if (selector == 'yes') {
                                    selectedRecords.clear();
                                    categoryTree.getSelectionModel().deselectAll()
                                }
                            })
                        }
                    }
                },
                filterCfg: {
                    hidden: true,
                },
            }
        ];
        me.callParent();
    }
})