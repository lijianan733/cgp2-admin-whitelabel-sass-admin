/**
 * Created by nan on 2019/1/22.
 */
Ext.define('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.ItemsGrid', {
    extend: "Ext.grid.Panel",
    header: false,
    collapsible: false,
    autoScroll: true,
    itemId: 'itemsGrid',
    viewConfig: {
        enableTextSelection: true
    },
    outTab: null,
    recordId: null,
    title: null,
    record: null,
    name: null,//新建时记录配置名
    selType: 'checkboxmodel',
    skuAttributes: new Ext.util.MixedCollection(),//记录所有使用过的skuAttribute
    initComponent: function () {
        var me = this;
        var mask = new Ext.LoadMask(me, {
            msg: "加载中..."
        });
        var controller = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.controller.Controller');
        me.store = localItemsStore = Ext.create('Ext.data.Store', {
            fields: [
                {
                    'name': 'id',
                    type: 'int'
                },
                {
                    name: 'left',
                    type: 'object'
                },
                {
                    name: 'right',
                    type: 'object'
                },
                {
                    name: 'condition',
                    type: 'object'
                },
                {
                    name: 'leftSkuAttributes',//记录该条记录中使用到的skuAttribute
                    type: 'array',
                    defaultValue: []
                },
                {
                    name: 'rightSkuAttributes',//记录该条记录中使用到的skuAttribute
                    type: 'array',
                    defaultValue: []
                },
                {
                    name: 'skuAttributeIds',//记录该条记录中使用到的全部skuAttribute
                    type: 'array'

                }
            ],
            data: [],
            autoSync: true,
            pageSize: 25,
            proxy: {
                type: 'pagingmemory'
            }
        });
        me.bbar = Ext.create('Ext.PagingToolbar', {
            store: me.store,
            displayInfo: true,
            displayMsg: '',
            emptyMsg: i18n.getKey('noData')
        });
        me.tbar = Ext.create('Ext.ux.toolbar.Standard', {
            disabledButtons: ['config', 'import', 'export'],
            hiddenButtons: ['clear', 'read'],
            btnCreate: {
                handler: function () {
                    var editItemTabPanel = me.outTab.getComponent('editItemTabPanel');
                    me.outTab.remove(editItemTabPanel);
                    editItemTabPanel = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.EditItemTabPanel', {
                        title: i18n.getKey('create') + i18n.getKey('mappingRelation'),
                        record: null,
                        itemsGridStore: me.store,
                        skuAttributes: me.skuAttributes
                    });
                    me.outTab.add([editItemTabPanel]);
                    me.outTab.setActiveTab(editItemTabPanel);
                }
            },
            btnDelete: {
                handler: function (btn) {
                    var grid = me;
                    var selectedRecords = grid.getSelectionModel().getSelection();
                    if (selectedRecords.length > 0) {
                        Ext.MessageBox.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (select) {
                            if (select == 'yes') {
                                for (var i = 0; i < selectedRecords.length; i++) {
                                    var record = selectedRecords[i];
                                    for (var j = 0; j < grid.store.proxy.data.length; j++) {
                                        if (grid.store.proxy.data[j].id == record.getId()) {
                                            grid.store.proxy.data.splice(j, 1);
                                            break;
                                        }
                                    }
                                }
                                grid.store.load();
                                controller.saveChangeData(me);
                            }
                        });
                    }
                }
            },
            btnConfig: {
                handler: function () {
                    JSOpenConfig(me.block);
                }
            },
            btnHelp: {
                handler: function () {
                    Ext.Msg.alert(i18n.getKey('prompt'), '在表格中按住Ctrl键即可实现多选');
                }
            }
        });
        me.columns = [
            {
                xtype: 'rownumberer',
                tdCls: 'vertical-middle'
            },
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                tdCls: 'vertical-middle',
                width: 40,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                        tooltip: 'Edit',
                        handler: function (grid, rowIndex, colIndex, a, b, record) {
                            var editItemTabPanel = me.outTab.getComponent('editItemTabPanel');
                            me.outTab.remove(editItemTabPanel);
                            editItemTabPanel = Ext.create('CGP.product.view.bothwayattributepropertyrelevanceconfig.view.EditItemTabPanel', {
                                title: i18n.getKey('edit') + i18n.getKey('mappingRelation'),
                                record: record,
                                itemsGridStore: record.store,
                                skuAttributes: me.skuAttributes
                            });
                            me.outTab.add([editItemTabPanel]);
                            me.outTab.setActiveTab(editItemTabPanel);
                            editItemTabPanel.LoadItemData(record);
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actiondelete',
                        tooltip: i18n.getKey('destroy'),
                        handler: function (view, rowIndex, colIndex) {
                            var grid = view.ownerCt;
                            var record = arguments[5];
                            Ext.MessageBox.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (select) {
                                if (select == 'yes') {
                                    for (var i = 0; i < grid.store.proxy.data.length; i++) {
                                        if (grid.store.proxy.data[i].id == record.getId()) {
                                            grid.store.proxy.data.splice(i, 1);
                                            break;
                                        }
                                    }
                                    grid.store.load();
                                    controller.saveChangeData(grid);
                                }
                            });
                        }
                    }

                ]
            },
            {
                dataIndex: 'leftSkuAttributes',
                itemId: 'leftSkuAttributes',
                tdCls: 'vertical-middle',
                xtype: 'uxarraycolumnv2',
                valueField: 'gridColumnsDisplayName',
                lineNumber: 2,
                maxLineCount: 3,
                flex: 1,
                text: i18n.getKey('leftSkuAttribute'),
                showContext: function (id, title) {//自定义展示多数据时的方式
                    var store = window.store;
                    var record = store.findRecord('id', id);
                    var data = [];
                    for (var i = 0; i < record.get('leftSkuAttributes').length; i++) {
                        var item = [];
                        item.push(record.get('leftSkuAttributes')[i].gridColumnsDisplayName);
                        data.push(item);
                    }
                    var win = Ext.create('Ext.window.Window', {
                        title: i18n.getKey('check') + i18n.getKey('skuAttribute'),
                        height: 250,
                        width: 350,
                        layout: 'fit',
                        items: {
                            xtype: 'grid',
                            border: false,
                            autoScroll: true,
                            columns: [
                                {
                                    width: 50,
                                    sortable: false,
                                    xtype: 'rownumberer'
                                },
                                {
                                    flex: 1,
                                    text: i18n.getKey('skuAttribute'),
                                    dataIndex: 'type',
                                    sortable: false,
                                    menuDisabled: true
                                }

                            ],
                            store: Ext.create('Ext.data.ArrayStore', {
                                fields: [
                                    {name: 'type', type: 'string'}
                                ],
                                data: data
                            })
                        }
                    }).show();
                }
            },
            {
                text: i18n.getKey('rightSkuAttribute'),
                dataIndex: 'rightSkuAttributes',
                itemId: 'right',
                tdCls: 'vertical-middle',
                xtype: 'uxarraycolumnv2',
                valueField: 'gridColumnsDisplayName',
                lineNumber: 2,
                maxLineCount: 3,
                flex: 1,
                showContext: function (id, title) {//自定义展示多数据时的方式
                    var store = window.store;
                    var record = store.findRecord('id', id);
                    var data = [];
                    for (var i = 0; i < record.get('rightSkuAttributes').length; i++) {
                        var item = [];
                        item.push(record.get('rightSkuAttributes')[i].gridColumnsDisplayName);
                        data.push(item);
                    }
                    var win = Ext.create('Ext.window.Window', {
                        title: i18n.getKey('check') + i18n.getKey('skuAttribute'),
                        height: 250,
                        width: 350,
                        modal: true,
                        layout: 'fit',
                        items: {
                            xtype: 'grid',
                            border: false,
                            autoScroll: true,
                            columns: [
                                {
                                    width: 50,
                                    sortable: false,
                                    xtype: 'rownumberer'
                                },
                                {
                                    flex: 1,
                                    text: i18n.getKey('skuAttribute'),
                                    dataIndex: 'type',
                                    sortable: false,
                                    menuDisabled: true
                                }

                            ],
                            store: Ext.create('Ext.data.ArrayStore', {
                                fields: [
                                    {name: 'type', type: 'string'}
                                ],
                                data: data
                            })
                        }
                    }).show();
                }
            },
            {
                text: i18n.getKey('condition'),
                dataIndex: 'condition',
                tdCls: 'vertical-middle',
                flex: 2,
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record) {
                    if (!Ext.isEmpty(value)) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>' + i18n.getKey('check') + i18n.getKey('condition') + '</a>',
                            listeners: {
                                render: function (display) {
                                    display.getEl().on("click", function () {
                                        var valueString = JSON.stringify(value, null, "\t");
                                        var win = Ext.create("Ext.window.Window", {
                                            modal: true,
                                            layout: 'fit',
                                            title: i18n.getKey('check') + i18n.getKey('condition'),
                                            items: [
                                                {
                                                    xtype: 'textarea',
                                                    fieldLabel: false,
                                                    width: 600,
                                                    height: 400,
                                                    value: valueString
                                                }
                                            ]
                                        });
                                        win.show();
                                    });
                                }
                            }}
                    } else {
                        return null;
                    }
                }

            }
        ];
        me.callParent(arguments);

    }
})