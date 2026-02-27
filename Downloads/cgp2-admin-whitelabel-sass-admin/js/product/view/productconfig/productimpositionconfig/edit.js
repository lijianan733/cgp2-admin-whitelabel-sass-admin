Ext.Loader.syncRequire(['CGP.product.view.productconfig.productimpositionconfig.model.ProductImpositionCfgModel', 'Ext.ux.form.field.MultiGridCombo']);
Ext.onReady(function () {


    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
    var builderBomConfigStore = Ext.create('CGP.product.view.productconfig.productbomconfig.store.ProductBomConfigStore', {
        params: {
            filter: '[{"name":"productConfigId","value":' + builderConfigTab.productConfigId + ',"type":"number"}]'
        }
    });
    var store = Ext.create('CGP.product.view.productconfig.productimpositionconfig.store.ProductImpositionCfgStore', {
        pageSize: 1000,
        params: {
            filter: '[{"name":"productConfigId","value":' + builderConfigTab.productConfigId + ',"type":"number"}]'
        }
    });
    var status = {'0': '删除', '1': '草稿', '2': '测试', '3': '上线'};


    var page = Ext.widget({
        block: 'product',
        xtype: 'uxeditpage',
        gridPage: 'BuilderBomConfig.html',
        tbarCfg: {
            btnCreate: {
                hidden: true
            },
            btnCopy: {
                handler: function () {
                    var basicForm = this.ownerCt.ownerCt.form;
                    var me = basicForm;
                    me.changeMode(me.mode.creating);
                    me._rawModels.each(function (m) {
                        var rec = m.copy();
                        rec.setId(null);
                        var configVersion = rec.get('configVersion');
                        rec.set('configVersion', parseInt(configVersion) + 1);//记录的值增加1
                        Ext.data.Model.id(rec);//自动生成id
                        me.loadModel(rec);
                    });
                }
            }
        },
        formCfg: {
            model: 'CGP.product.view.productconfig.productimpositionconfig.model.ProductImpositionCfgModel',
            remoteCfg: false,
            columnCount: 1,
            isRefreshField: false,
            items: [

                {
                    name: 'productConfigId',
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('productConfigId'),
                    itemId: 'builderConfigId',
                    hidden: true,
                    value: builderConfigTab.productConfigId,
                    allowBlank: false
                },
                {
                    name: 'status',
                    xtype: 'combo',
                    editable: false,
                    allowBlank: false,
                    fieldLabel: i18n.getKey('status'),
                    itemId: 'status',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['type', "value"],
                        data: [
                            {
                                type: '草稿', value: 1
                            },
                            {
                                type: '测试', value: 2
                            }, {
                                type: '上线', value: 3
                            }
                        ]
                    }),
                    displayField: 'type',
                    valueField: 'value',
                    queryMode: 'local',
                    value: 1

                },
                {
                    name: 'isManual',
                    xtype: 'combo',
                    editable: false,
                    allowBlank: false,
                    fieldLabel: i18n.getKey('isManual'),
                    itemId: 'isManual',
                    store: Ext.create('Ext.data.Store', {
                        fields: ['name', "value"],
                        data: [
                            {
                                name: '是', value: true
                            },
                            {
                                name: '否', value: false
                            }
                        ]
                    }),
                    displayField: 'name',
                    valueField: 'value',
                    queryMode: 'local',
                    value: false

                }, {
                    name: "configVersion",
                    xtype: "textfield",
                    id: 'configVersion',
                    readOnly: true,
                    fieldStyle: 'background-color:silver',
                    fieldLabel: i18n.getKey('configVersion'),
                    itemId: 'configVersion'
                }, {
                    name: 'bomType',
                    xtype: 'combo',
                    id: 'bomType',
                    itemId: 'bomType',
                    editable: false,
                    fieldLabel: i18n.getKey('bomType'),
                    allowBlank: false,
                    store: Ext.create('CGP.product.view.productconfig.productbomconfig.store.BomTypeStore'),
                    listeners: {
                        change: function (combo) {
                            builderBomConfigStore.getProxy().setExtraParam(
                                'filter', '[{"name":"type","value":"' + '%' + combo.getValue() + '%' + '","type":"string"},{"name":"productConfigId","value":' + builderConfigTab.productConfigId + ',"type":"number"}]'
                            );
                            builderBomConfigStore.load();
                        }
                    },
                    displayField: 'code',
                    valueField: 'code',
                    value: 'UF2'
                }, {
                    xtype: 'gridcombo',
                    matchFieldWidth: false,
                    itemId: 'bomCompatibilities',
                    editable: false,
                    fieldLabel: i18n.getKey('bomVersions'),
                    name: 'bomCompatibilities',
                    multiSelect: true,
                    //msgTarget: 'qtip',
                    displayField: 'configVersion',
                    valueField: 'configVersion',
                    width: 380,
                    listeners: {
                        expand: function (comp) {
                            var toolbar = comp.picker.grid.getDockedItems('toolbar[dock="bottom"]')[0];
                            if (toolbar) {
                                toolbar.updateInfo();
                            }
                        }
                    },
                    allowBlank: false,
                    labelWidth: 100,
                    store: builderBomConfigStore,
                    queryMode: 'remote',
                    gridCfg: {
                        store: builderBomConfigStore,
                        height: 300,
                        width: 650,
                        listeners: {
                            select: function (model, record) {
                                var me = this;
                                var selectModel = me.getSelectionModel();
                                var records = selectModel.getSelection();
                                var toolbar = me.getDockedItems('toolbar[dock="bottom"]')[0];
                                var displayItem = toolbar.child('#displayItem');
                                for (var i = 0; i < records.length; i++) {
                                    if (records[i].get('schemaVersion') != record.get('schemaVersion')) {
                                        var bomComp = page.form.getComponent('bomCompatibilities');
                                        //bomComp.setActiveError('和已选bom版本结构冲突');
                                        selectModel.deselect(record);
                                        //toolbar.emptyMsg = '和已选bom版本结构冲突';
                                        //toolbar.setActiveError('和已选bom版本结构冲突');
                                        displayItem.setText('<text style="color: red;font-weight: bold">' + '与已选bom结构版本冲突，请重选!' + '</text>');
                                        var selected = selectModel.getSelection();
                                        var selectedArr = [];
                                        Ext.Array.each(selected, function (item) {
                                            selectedArr.push(item.data)
                                        });
                                        bomComp.setValue(selectedArr, false);
                                        break;
                                    } else {
                                        toolbar.updateInfo();
                                    }
                                }
                            }
                        },
                        selType: 'checkboxmodel',
                        columns: [{
                            text: i18n.getKey('configVersion'),
                            width: 120,
                            dataIndex: 'configVersion'
                        }, {
                            text: i18n.getKey('schemaVersion'),
                            width: 80,
                            dataIndex: 'schemaVersion'
                        }, {
                            text: i18n.getKey('status'),
                            width: 120,
                            dataIndex: 'status',
                            renderer: function (value, metaData, record) {
                                return status[value];
                            }
                        }, {
                            text: i18n.getKey('builderContext'),
                            width: 120,
                            dataIndex: 'context'
                        }, {
                            text: i18n.getKey('id'),
                            width: 80,
                            dataIndex: 'id'
                        }],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: builderBomConfigStore,
                            displayInfo: true,
                            emptyMsg: i18n.getKey('noData')
                        })
                    }
                }, {
                    name: "configValue",
                    xtype: "textarea",
                    height: 250,
                    width: 650,
                    regex: /^\S+.*\S+$/,
                    regexText: '值的首尾不能存在空格或空换行符！',
                    colspan: 2,
                    fieldLabel: i18n.getKey('configValue'),
                    itemId: 'configValue'
                }
            ]
        },
        listeners: {
            "render": function (page) {
                if (page.form.getCurrentMode() == 'creating') {
                    store.on('load', function () {
                        var lastRecord = store.getAt(store.getCount() - 1);
                        if (Ext.isEmpty(lastRecord)) {
                            Ext.getCmp('configVersion').setValue('1');
                        } else {
                            var configVersion = parseInt(lastRecord.get('configVersion')) + 1 + '';
                            Ext.getCmp('configVersion').setValue(configVersion);
                        }

                    })
                }
            },
            afterrender: function () {
                var page = this;
                var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
                var productId = builderConfigTab.productId;
                var isLock = JSCheckProductIsLock(productId);
                if (isLock) {
                    JSLockConfig(page);
                }
            }
        },
    });
});
