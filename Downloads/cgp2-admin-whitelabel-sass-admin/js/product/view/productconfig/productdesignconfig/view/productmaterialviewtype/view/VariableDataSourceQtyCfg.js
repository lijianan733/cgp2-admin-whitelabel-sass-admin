/**
 * Created by nan on 2019/12/23.
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.VariableDataSourceQtyCfg", {
    extend: 'Ext.panel.Panel',
    itemId: 'variableDataSourceQtyCfg',
    layout: {
        type: 'border'
    },
    requires: [
        'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.ModifyVariableDataSourceQtyCfgForm',
        'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.OriginalVariableDataSourceQtyCfgForm',
        'CGP.variabledatasource.model.VariableDataSourceModel'
    ],
    title: i18n.getKey('VariableDataSourceQtyCfg'),
    pageContentSchemaId: null,
    variableDataSourceQtyCfgs: null,
    pageContentItemPlaceholderStore: null,
    variableDataSourceStore: null,
    initComponent: function () {
        var me = this;
        me.variableDataSourceStore = Ext.create('Ext.data.Store', {
            model: 'CGP.variabledatasource.model.VariableDataSourceModel',
            data: [],
            proxy: {
                type: 'memory'
            }
        });
        me.pageContentItemPlaceholderStore = Ext.create('CGP.materialviewtype.store.PageContentItemPlaceholderStore', {
            pageContentSchemaId: me.pageContentSchemaId,
            listeners: {
                load: function (store, records) {
                    if (records) {
                        var variableDataSourceMap = {};
                        for (var i = 0; i < records.length; i++) {
                            var item = records[i].getData();
                            var dataSourceId = item.dataSource._id;
                            variableDataSourceMap[dataSourceId] = item.dataSource;
                        }
                        var variableDataSourceArr = [];
                        for (var i in variableDataSourceMap) {
                            variableDataSourceArr.push(variableDataSourceMap[i]);
                        }
                        me.allVariableDataSource = Ext.clone(variableDataSourceArr);
                        var excludeIds = [];
                        var grid = Ext.getCmp('variableDataSourceQtyCfgLeftConfig');
                        if (grid && grid.store.getCount() > 0) {
                            //过滤掉已经添加的
                            for (var i = 0; i < grid.store.getCount(); i++) {
                                var id = grid.store.getAt(i).get('variableDataSource')._id;
                                excludeIds.push(id);
                            }
                            variableDataSourceArr = variableDataSourceArr.filter(function (item) {
                                if (Ext.Array.contains(excludeIds, item._id)) {
                                    return false;
                                } else {
                                    return true;
                                }
                            });
                        }
                        me.variableDataSourceStore.proxy.data = variableDataSourceArr;
                        me.variableDataSourceStore.load();
                    }

                }
            }
        });
        var leftGrid = Ext.create('Ext.grid.Panel', {
            region: 'west',
            width: 420,
            itemId: 'leftPanel',
            id: 'variableDataSourceQtyCfgLeftConfig',
            viewConfig: {
                markDirty: false,
            },
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: 'clazz',
                        type: 'string',
                        defaultValue: 'com.qpp.cgp.domain.bom.qty.VariableDataSourceQtyCfg'
                    },
                    'variableDataSource',
                    'vdQtyCfg',
                    'qtyRange',
                    'description'
                ],
                proxy: {
                    type: 'memory'
                },
                data: me.variableDataSourceQtyCfgs
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
                    sortable: false,
                    text: i18n.getKey('description'),
                    renderer: function (value, mateData, record) {
                        return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value + '</div>'
                    }
                },
                {
                    dataIndex: 'variableDataSource',
                    menuDisabled: true,
                    flex: 1,
                    sortable: false,
                    text: i18n.getKey('原variableDataSourceId'),
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
                        grid.ownerCt.pageContentItemPlaceholderStore.load();
                        var win = Ext.create('Ext.window.Window', {
                            title: i18n.getKey('select') + i18n.getKey('要替换的variableDataSource'),
                            modal: true,
                            constrain: true,
                            layout: 'vbox',
                            items: [{
                                name: 'variableDataSource',
                                xtype: 'gridcombo',
                                margin: '10 20 10 20',
                                width: 500,
                                itemId: 'variableDataSource',
                                fieldLabel: i18n.getKey('variableDataSource'),
                                multiSelect: false,
                                displayField: '_id',
                                valueField: '_id',
                                allowBlank: false,
                                isComboQuery: true,
                                store: me.variableDataSourceStore,
                                editable: false,
                                labelWidth: 150,
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
                                            text: i18n.getKey('selector'),
                                            dataIndex: 'selector',
                                            flex: 1
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
                                        var variableDataSourceField = win.getComponent('variableDataSource');
                                        if (variableDataSourceField.isValid()) {
                                            var variableDataSource = variableDataSourceField.getValue()[variableDataSourceField.getSubmitValue()[0]];
                                            grid.store.proxy.data.push({
                                                variableDataSource: variableDataSource,
                                                vdQtyCfg: null,
                                                description: '新建VariableDataSourceQtyCfg',
                                                qtyRange: {
                                                    clazz: 'com.qpp.cgp.domain.bom.QuantityRange',
                                                    rangeType: "FIX"
                                                }
                                            });
                                            grid.store.load(function () {
                                                //选中最后一条
                                                grid.getSelectionModel().selectRange(grid.store.getCount() - 1, grid.store.getCount() - 1);
                                            });


                                            /*      centerForm.setValue({
                                                      variableDataSource: variableDataSource,
                                                      vdQtyCfg: null,
                                                      description: null,
                                                      qtyRange: {
                                                          clazz: 'com.qpp.cgp.domain.bom.QuantityRange',
                                                          rangeType: "RANGE"
                                                      }

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
                    centerPanel.setValue(record.getData());
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
                },
            }
        });
        var centerPanel = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.ModifyVariableDataSourceQtyCfgForm', {
            itemId: 'centerPanel'
        });
        me.items = [
            leftGrid,
            centerPanel
        ];
        me.callParent();
    },
    getValue: function () {
        var me = this;
        var leftPanel = me.getComponent('leftPanel');
        var centerPanel = leftPanel.ownerCt.getComponent('centerPanel');
        var saveBtn = centerPanel.getDockedItems('toolbar[dock="top"]')[0].getComponent('saveBtn');
        if (centerPanel.isValid()) {
            saveBtn.handler(saveBtn);
        }
        for (var i = 0; i < leftPanel.store.proxy.data.length; i++) {
            leftPanel.store.proxy.data[i].clazz = 'com.qpp.cgp.domain.bom.qty.VariableDataSourceQtyCfg';
        }
        var result = leftPanel.store.proxy.data;
        return {variableDataSourceQtyCfgs: result};
    },
    isValid: function () {
        return true;
    },
    setValue: function (data) {
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
        leftPanel.store.proxy.data = data.variableDataSourceQtyCfgs;
        leftPanel.store.load();
    },
    refreshData: function (data) {
        var me = this;
        me.data = data;
    }
})

