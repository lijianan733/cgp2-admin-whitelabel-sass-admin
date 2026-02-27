/**
 * @Description:发布普通页
 * @author nan
 * @date 2022/8/29
 * */
Ext.Loader.syncRequire([
    'CGP.cmslog.view.FeatureBlock',
    'CGP.cmsconfig.store.CmsConfigStore',
    'CGP.common.field.ProductGridCombo'
])
Ext.define('CGP.cmslog.view.PublishNormalPagePanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.publishnormalpagepanel',
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
        var cmsPageStore = Ext.create('CGP.cmspages.store.CMSPageStore');
        me.items = [
            {
                xtype: 'searchcontainer',
                itemId: 'optionalRecordGrid',
                region: 'west',
                width: 600,
                split: true,
                gridCfg: {
                    store: Ext.create('CGP.cmsconfig.store.CmsConfigStore', {}),
                    deleteAction: false,
                    editAction: false,
                    selModel: Ext.create("Ext.selection.CheckboxModel", {
                        injectCheckbox: 0,//checkbox位于哪一列，默认值为0
                        mode: "simple",//multi,simple,single；默认为多选multi
                        checkOnly: false,//如果值为true，则只用点击checkbox列才能选中此条记录
                        allowDeselect: true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
                        enableKeyNav: true,//开启/关闭在网格内的键盘导航。
                        showHeaderCheckbox: true//如果此项为false在复选框列头将不显示.
                    }),
                    columns: [
                        {
                            text: i18n.getKey('CMS发布配置信息'),
                            dataIndex: '_id',
                            flex: 1,
                            minWidth: 250,
                            xtype: 'atagcolumn',
                            clickHandler: function (value, metaData, record) {
                                JSOpen({
                                    id: 'cmsconfigpage',
                                    url: path + "partials/cmsconfig/main.html?_id=" + value + '&type=ProductDetail',
                                    title: i18n.getKey('productPublishConfig'),
                                    refresh: true
                                })
                            },
                            getDisplayName: function (value, metaData, record) {
                                var data = [
                                    {
                                        title: '编号',
                                        value: '<a href="">' + record.get('_id') + '</a>'
                                    },
                                    {
                                        title: 'cmsPageId',
                                        value: record.get('cmsPageId')
                                    },
                                    {
                                        title: 'pageName',
                                        value: record.get('pageName')
                                    },
                                    {
                                        title: 'pageTitle',
                                        value: record.get('pageTitle')
                                    }
                                ];
                                return JSCreateHTMLTable(data);
                            }
                        },
                        {
                            dataIndex: 'fileUrl',
                            text: i18n.getKey('发布预览'),
                            minWidth: 100,
                            flex: 1,
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata, record) {
                                metadata.tdAttr = 'data-qtip="查看"';
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#">查看</a>',
                                    listeners: {
                                        render: function (display) {
                                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                                            ela.on("click", function () {
                                                var controller = Ext.create('CGP.cmslog.controller.Controller');
                                                controller.publishPreview();
                                            });
                                        }
                                    }
                                };
                            }
                        }
                    ],
                    listeners: {
                        selectionchange: function (selModel) {
                            var uxGrid = this;
                            var panel = uxGrid.ownerCt.ownerCt;
                            var selectedRecordGrid = panel.getComponent('selectedRecordGrid');
                            var data = uxGrid.selectedRecords.items;
                            data = data.map(function (record) {
                                return record.getData();
                            });
                            selectedRecordGrid.store.proxy.data = data;
                            selectedRecordGrid.store.load();

                        }
                    }
                },
                filterCfg: {
                    minHeight: 80,
                    header: {
                        title: '可发布的普通页列表'
                    },
                    bodyStyle: {
                        borderColor: 'silver',
                    },
                    layout: {
                        type: 'table',
                        columns: 2
                    },
                    items: [
                        {
                            name: 'cmsPageId',
                            itemId: 'cmsPageId',
                            xtype: 'gridcombo',
                            fieldLabel: i18n.getKey('CMSPages'),
                            editable: false,
                            matchFieldWidth: false,
                            displayField: 'name',
                            valueField: '_id',
                            store: cmsPageStore,
                            filterCfg: {
                                minHeight: 90,
                                defaults: {
                                    isLike: false,
                                    width: 200,
                                    labelWidth: 60
                                },
                                items: [
                                    {
                                        name: '_id',
                                        itemId: '_id',
                                        xtype: 'textfield',
                                        fieldLabel: i18n.getKey('id')
                                    },
                                    {
                                        name: 'name',
                                        itemId: 'name',
                                        xtype: 'textfield',
                                        fieldLabel: i18n.getKey('name')
                                    },
                                    {
                                        name: 'cmsType',
                                        itemId: 'cmsType',
                                        xtype: 'textfield',
                                        editable: false,
                                        hidden: true,
                                        displayField: 'key',
                                        valueField: 'value',
                                        fieldLabel: i18n.getKey('type'),
                                        value: 'Normal',
                                    },
                                    {
                                        name: 'status',
                                        xtype: 'combo',
                                        editable: false,
                                        fieldLabel: i18n.getKey('status'),
                                        itemId: 'status',
                                        displayField: 'key',
                                        isNumber: true,
                                        valueField: 'value',
                                        store: {
                                            xtype: 'store',
                                            fields: ['key', 'value'],
                                            data: [
                                                {
                                                    key: '正式', value: '3'
                                                },
                                                {
                                                    key: '草稿', value: '1'
                                                }
                                            ]
                                        },
                                    }
                                ]
                            },
                            gridCfg: {
                                store: cmsPageStore,
                                height: 400,
                                width: 720,
                                columns: [
                                    {
                                        text: i18n.getKey('id'),
                                        width: 90,
                                        dataIndex: '_id'
                                    },
                                    {
                                        text: i18n.getKey('name'),
                                        width: 350,
                                        dataIndex: 'name'
                                    },
                                    {
                                        text: i18n.getKey('type'),
                                        flex: 1,
                                        dataIndex: 'cmsType',
                                        renderer: function (value, matadata, record) {
                                            if (value == 'ProductDetail') {
                                                return '产品详情'
                                            } else if (value == 'ProductCategory') {
                                                return '产品类目'
                                            }
                                        }
                                    },
                                    {
                                        text: i18n.getKey('status'),
                                        flex: 1,
                                        dataIndex: 'status',
                                        renderer: function (value) {
                                            if (value == 1) {
                                                return '正式';
                                            } else if (value == 3) {
                                                return '草稿';
                                            }
                                        }
                                    }
                                ],
                                bbar: {
                                    xtype: 'pagingtoolbar',
                                    store: cmsPageStore,
                                    displayInfo: true, // 是否 ? 示， 分 ? 信息
                                    displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                                    emptyText: i18n.getKey('noDat')
                                }
                            },
                        },
                        {
                            name: 'pageName',
                            xtype: 'textfield',
                            fieldLabel: i18n.getKey('pageName'),
                            itemId: 'pageName'
                        },
                        {
                            name: 'status',
                            xtype: 'combo',
                            isLike: false,
                            fieldLabel: i18n.getKey('status'),
                            itemId: 'status',
                            editable: false,
                            isNumber: true,
                            displayField: 'key',
                            valueField: 'value',
                            store: {
                                xtype: 'store',
                                fields: ['key', 'value'],
                                data: [
                                    {'key': '正式', 'value': 3},
                                    {'key': '草稿', 'value': 1}
                                ]
                            }
                        },
                        {
                            name: '_id',
                            xtype: 'textfield',
                            isLike: false,
                            fieldLabel: i18n.getKey('CMS发布配置编号'),
                            itemId: '_id'
                        },
                        {
                            name: 'clazz',
                            xtype: 'textfield',
                            isLike: false,
                            hidden: true,
                            allowReset: false,
                            itemId: 'clazz',
                            value: 'com.qpp.cgp.domain.cms.NormalPageCMSConfig'
                        }
                    ]
                },
            },
            {
                xtype: 'componentgrid',
                region: 'center',
                itemId: 'selectedRecordGrid',
                bodyStyle: {
                    borderColor: 'silver',
                },
                flex: 1,
                height: '100%',
                title: '已选配置列表',
                store: Ext.create('Ext.data.Store', {
                    xtype: 'store',
                    fields: [
                        'name',
                        {
                            name: 'relationOptions',
                            type: 'array'
                        }
                    ],
                    proxy: {
                        type: 'pagingmemory'
                    },
                    data: []
                }),
                autoScroll: true,
                componentViewCfg: {
                    columns: 4,
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
                                value: record.raw._id
                            },
                            {
                                title: i18n.getKey('html') + i18n.getKey('pageName'),
                                value: record.raw.pageName
                            },
                            {
                                title: i18n.getKey('pageTitle'),
                                value: record.raw.pageTitle
                            },
                        ];
                        rowIndex = rowIndex + 1;
                        return {
                            xtype: "panel",
                            width: 200,
                            height: 100,
                            border: 1,
                            margin: 5,
                            itemId: 'container_' + rowIndex,
                            record: record,
                            view: view,
                            index: rowIndex,
                            borderColor: 'red',
                            fieldLabel: i18n.getKey('name'),
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
                            var optionalRecordGrid = panel.ownerCt.ownerCt.getComponent('optionalRecordGrid');
                            var selectedRecords = optionalRecordGrid.grid.selectedRecords;
                            var selectedData = [];
                            if (selectedRecords.getCount() > 0) {
                                selectedRecords.each(function (item) {
                                    selectedData.push(item.getData());
                                });
                                var win = Ext.create('CGP.cmslog.view.PublishNormalPageConfirmWin', {
                                    selectedData: selectedData
                                });
                                win.show();
                            } else {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请选择要发布的产品配置'));
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
                            var optionalRecordGrid = panel.ownerCt.ownerCt.getComponent('optionalRecordGrid');
                            var selectedRecords = optionalRecordGrid.grid.selectedRecords;
                            Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否清空所有记录?'), function (selector) {
                                if (selector == 'yes') {
                                    selectedRecords.clear();
                                    optionalRecordGrid.grid.getSelectionModel().deselectAll()
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