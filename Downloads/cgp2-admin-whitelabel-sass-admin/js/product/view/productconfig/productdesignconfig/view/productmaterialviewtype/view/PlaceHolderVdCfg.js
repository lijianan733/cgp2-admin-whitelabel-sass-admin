/**
 * Created by nan on 2019/12/23.
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.PlaceHolderVdCfg", {
    extend: 'Ext.panel.Panel',
    itemId: 'PlaceHolderVdCfg',
    layout: {
        type: 'border'
    },
    requires: [
        'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.OriginalPageContentItemPlaceholderFrom',
        'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.ModifyPageContentItemPlaceholderForm',
        'CGP.materialviewtype.model.PageContentItemPlaceholderModel'
    ],
    title: i18n.getKey('PlaceHolderVdCfg'),
    pageContentSchemaId: null,
    placeHolderVdCfgs: null,
    pageContentItemPlaceholderStore: null,//根据pageContentSchameId获取到该结构下单pageContentItemPlaceholders
    localPageContentItemPlaceholderStore: null,
    initComponent: function () {
        var me = this;
        me.localPageContentItemPlaceholderStore = Ext.create('Ext.data.Store', {//部分的placeHolder
            model: 'CGP.materialviewtype.model.PageContentItemPlaceholderModel',
            data: [],
            proxy: {
                type: 'memory'
            }
        });
        me.pageContentItemPlaceholderStore = Ext.create('CGP.materialviewtype.store.PageContentItemPlaceholderStore', {
            pageContentSchemaId: me.pageContentSchemaId,
            listeners: {
                load: function (store, records) {
                    var data = [];
                    me.localPageContentItemPlaceholderStore.proxy.data = [];
                    for (var i = 0; i < records.length; i++) {
                        data.push(records[i].getData());
                    }
                    var excludeIds = [];
                    var grid = Ext.getCmp('placeHolderVdCfgLeftPanel');
                    if (grid && grid.store.getCount() > 0) {
                        //过滤掉已经添加的
                        for (var i = 0; i < grid.store.getCount(); i++) {
                            var id = grid.store.getAt(i).get('pageContentItemPlaceholder')._id;
                            excludeIds.push(id);
                        }
                        data = data.filter(function (item) {
                            if (Ext.Array.contains(excludeIds, item._id)) {
                                return false;
                            } else {
                                return true;
                            }
                        });
                    }
                    me.localPageContentItemPlaceholderStore.proxy.data = data;
                    me.localPageContentItemPlaceholderStore.load();
                }
            }
        });
        var leftGrid = Ext.create('Ext.grid.Panel', {
            region: 'west',
            width: 400,
            id: 'placeHolderVdCfgLeftPanel',
            itemId: 'leftPanel',
            viewConfig: {
                markDirty: false,
            },
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: 'clazz',
                        type: 'string',
                        defaultValue: 'com.qpp.cgp.domain.bom.qty.PlaceHolderVdCfg'
                    },
                    {
                        name: 'variableDataSource',
                        type: 'object'
                    },
                    'expression',
                    'description',
                    'itemSelector',
                    'itemAttributes',
                    'variableDataIndexExpression',
                    {
                        name: 'pageContentItemPlaceholder',
                        type: 'object'
                    }
                ],
                proxy: {
                    type: 'memory'
                },
                data: me.placeHolderVdCfgs
            }),
            columns: [
                {
                    xtype: 'actioncolumn',
                    width: 30,
                    items: [
                        {
                            iconCls: 'icon_remove icon_margin',
                            tooltip: 'Delete',
                            handler: function (view, rowIndex, colIndex, a, b, record) {
                                var grid = view.ownerCt;
                                var centerPanel = grid.ownerCt.getComponent('centerPanel');
                                Ext.Msg.confirm('提示', '确定删除？', callback);

                                function callback(id) {
                                    if (id === 'yes') {
                                        grid.store.proxy.data.splice(rowIndex, 1);
                                        grid.store.load();
                                        centerPanel.el.mask();
                                        centerPanel.reset();
                                    }
                                }
                            }
                        }
                    ]
                },
                {
                    dataIndex: 'description',
                    width: 220,
                    text: i18n.getKey('description'),
                    renderer: function (value, mateData, record) {
                        return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value + '</div>'
                    }
                },
                {
                    dataIndex: 'pageContentItemPlaceholder',
                    menuDisabled: true,
                    flex: 1,
                    text: i18n.getKey('原placeHolderId'),
                    renderer: function (value, mateData, record) {
                       
                        return value._id;
                    }
                }
            ],
            tbar: [
                {
                    xtype: 'button',
                    text: i18n.getKey('add'),
                    iconCls: 'icon_add',
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt;
                        grid.getSelectionModel().deselectAll();
                        me.pageContentItemPlaceholderStore.load();
                        var win = Ext.create('Ext.window.Window', {
                            title: i18n.getKey('select') + i18n.getKey('要替换的PageContentItemPlaceholder'),
                            modal: true,
                            constrain: true,
                            layout: 'vbox',
                            items: [{
                                name: 'pageContentItemPlaceholder',
                                xtype: 'gridcombo',
                                margin: '10 20 10 20',
                                width: 400,
                                itemId: 'pageContentItemPlaceholder',
                                fieldLabel: i18n.getKey('pageContentItem Placeholder'),
                                multiSelect: false,
                                displayField: '_id',
                                valueField: '_id',
                                allowBlank: false,
                                isComboQuery: true,
                                store: me.localPageContentItemPlaceholderStore,
                                editable: false,
                                matchFieldWidth: false,
                                gridCfg: {
                                    height: 280,
                                    width: 600,
                                    columns: [
                                        {
                                            text: i18n.getKey('id'),
                                            width: 100,
                                            dataIndex: '_id'
                                        },
                                        {
                                            text: i18n.getKey('itemAttributes'),
                                            width: 150,
                                            dataIndex: 'itemAttributes'
                                        },
                                        {
                                            text: i18n.getKey('itemSelector'),
                                            flex: 1,
                                            dataIndex: 'itemSelector'
                                        }
                                    ]
                                }
                            }],
                            bbar: [
                                '->',
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('confirm'),
                                    iconCls: 'icon_agree',
                                    handler: function (btn) {
                                        var win = btn.ownerCt.ownerCt;
                                        var centerForm = grid.ownerCt.getComponent('centerPanel');
                                        centerForm.createOrEdit = 'create';
                                        var pageContentItemPlaceholder = win.getComponent('pageContentItemPlaceholder');
                                        if (pageContentItemPlaceholder.isValid()) {
                                            var pageContentItemPlaceholderValue = pageContentItemPlaceholder.getValue()[pageContentItemPlaceholder.getSubmitValue()[0]];
                                            var newRecord = grid.store.proxy.data.push({
                                                pageContentItemPlaceholder: pageContentItemPlaceholderValue,
                                                expression: null,
                                                description: '新建placeHolderVdCfg',
                                                itemSelector: pageContentItemPlaceholderValue.itemSelector,
                                                itemAttributes: pageContentItemPlaceholderValue.itemAttributes,
                                                variableDataIndexExpression: null,
                                                variableDataSource: null,
                                            });
                                            grid.store.load(function () {
                                                //选中最后一条
                                                grid.getSelectionModel().selectRange(grid.store.getCount() - 1, grid.store.getCount() - 1);
                                            });
                                            /* centerForm.setValue({
                                                 pageContentItemPlaceholder: pageContentItemPlaceholderValue,
                                                 variableDataSource: null,
                                                 expression: null,
                                                 itemSelector: pageContentItemPlaceholderValue.itemSelector,
                                                 itemAttributes: pageContentItemPlaceholderValue.itemAttributes,
                                                 variableDataIndexExpression: null
                                             });*/
                                            btn.ownerCt.ownerCt.close();
                                        }
                                    }
                                },
                                {
                                    xtype: 'button',
                                    text: i18n.getKey('cancel'),
                                    iconCls: 'icon_cancel',
                                    handler: function (btn) {
                                        btn.ownerCt.ownerCt.close();
                                    }
                                }
                            ]
                        });
                        win.show();
                    }
                }
            ],
            listeners: {
                select: function (rowModel, record, index, eOpts) {
                    var leftPanel = this;
                    var centerPanel = leftPanel.ownerCt.getComponent('centerPanel');
                    centerPanel.createOrEdit = 'edit';
                    centerPanel.record = record;
                    var pageContentItemPlaceholderData = record.getData();
                    var pageContentItemPlaceholderId = pageContentItemPlaceholderData.pageContentItemPlaceholder._id;
                    var rawData = me.pageContentItemPlaceholderStore.findRecord('_id', pageContentItemPlaceholderId).getData()
                    pageContentItemPlaceholderData['itemSelector'] = rawData.itemSelector;
                    pageContentItemPlaceholderData['itemAttributes'] = rawData.itemAttributes;
                    centerPanel.setValue(pageContentItemPlaceholderData);
                },
                beforedeselect: function (rowModel, record, index) {
                    var leftPanel = this;
                    var centerPanel = leftPanel.ownerCt.getComponent('centerPanel');
                    var saveBtn = centerPanel.getDockedItems('toolbar[dock="top"]')[0].getComponent('saveBtn');
                    if (centerPanel.isValid()) {
                        var data = centerPanel.getValue();
                        var index = centerPanel.record.index;
                        leftPanel.store.proxy.data[index] = data;
                        for (var i in data) {
                            centerPanel.record.set(i, data[i]);
                        }
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        });
        var centerPanel = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.ModifyPageContentItemPlaceholderForm', {
            itemId: 'centerPanel'
        });
        me.items = [
            leftGrid,
            centerPanel
        ];
        me.callParent();
    },
    isValid: function () {
        return true;
    },
    getValue: function () {
        var me = this;
        var leftPanel = me.getComponent('leftPanel');
        if(leftPanel.getSelectionModel().getSelection().length>0){
            var centerPanel = leftPanel.ownerCt.getComponent('centerPanel');
            var data = centerPanel.getValue();
            var index = centerPanel.record.index;
            leftPanel.store.proxy.data[index] = data;
            for (var i in data) {
                centerPanel.record.set(i, data[i]);
            }
        }
        for (var i = 0; i < leftPanel.store.proxy.data.length; i++) {
            leftPanel.store.proxy.data[i].clazz = 'com.qpp.cgp.domain.bom.qty.PlaceHolderVdCfg';
        }
        var result = leftPanel.store.proxy.data;
        return {placeHolderVdCfgs: result};
    },
    refreshData: function (data) {
        var me = this;
        me.data = data;
    }
})
