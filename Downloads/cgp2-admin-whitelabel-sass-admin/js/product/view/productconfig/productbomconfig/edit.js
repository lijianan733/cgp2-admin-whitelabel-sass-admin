Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productbomconfig.model.ProductBomConfigModel',
    'CGP.common.store.MaterialStore',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.store.MaterialStore'
]);
Ext.onReady(function () {


    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
    var configurableProductId = builderConfigTab.configurableProductId;
    var productType = builderConfigTab.productType;
    var isSpecialSku = (productType == 'SKU' && Ext.isEmpty(configurableProductId));//是sku且没有父可配置产品
    var materialStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.store.MaterialStore', {
        autoLoad: false,
    });
    var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
    var store = Ext.create('CGP.product.view.productconfig.productbomconfig.store.ProductBomConfigStore', {
        pageSize: 1000,
        params: {
            filter: '[{"name":"productConfigId","value":' + builderConfigTab.productConfigId + ',"type":"number"}]'
        }
    });
    var productId = builderConfigTab.productId;
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
                        rec.set('configVersion', parseInt(configVersion) + 1);
                        Ext.data.Model.id(rec);
                        me.loadModel(rec);
                    });
                }
            }
        },
        formCfg: {
            model: 'CGP.product.view.productconfig.productbomconfig.model.ProductBomConfigModel',
            remoteCfg: false,
            columnCount: 1,
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
                    name: 'type',
                    xtype: 'combo',
                    itemId: 'bomType',
                    editable: false,
                    fieldLabel: i18n.getKey('type'),
                    allowBlank: false,
                    store: Ext.create('CGP.product.view.productconfig.productbomconfig.store.BomTypeStore'),
                    displayField: 'code',
                    valueField: 'code',
                    value: 'UF2',
                    listeners: {
                        'change': function (comp, newValue) {
                            var configValue = Ext.getCmp('configValue');
                            var schemaVersion = Ext.getCmp('schemaVersion');
                            var productMaterialId = Ext.getCmp('productMaterialId');
                            /*if(newValue === 'UF2'){
                             configValue.setVisible(false);
                             configValue.setDisabled(true);
                             configValue.setValue(null);

                             schemaVersion.setVisible(true);
                             schemaVersion.setDisabled(false);

                             productMaterialId.setVisible(true);
                             productMaterialId.setDisabled(false);
                             }*/
                            /*else{
                             configValue.setVisible(true);
                             configValue.setDisabled(false);

                             schemaVersion.setVisible(false);
                             schemaVersion.setDisabled(true);
                             schemaVersion.setValue(null);

                             productMaterialId.setVisible(false);
                             productMaterialId.setDisabled(true);
                             productMaterialId.setValue(null);
                             }*/
                        }
                    }
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
                            },
                            {
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
                    name: "context",
                    xtype: "combo",
                    editable: false,
                    allowBlank: false,
                    fieldLabel: i18n.getKey('builderContext'),
                    itemId: 'context',
                    store: Ext.create('CGP.product.view.productconfig.store.ProductContexts'),
                    displayField: 'code',
                    valueField: 'code',
                    value: 'PC'
                },
                {
                    name: "configVersion",
                    xtype: "textfield",
                    id: 'configVersion',
                    readOnly: true,
                    fieldStyle: 'background-color:silver',
                    fieldLabel: i18n.getKey('configVersion'),
                    itemId: 'configVersion',
                    value: 5
                },
                {
                    name: "schemaVersion",
                    xtype: "combo",
                    editable: false,
                    id: 'schemaVersion',
                    fieldLabel: i18n.getKey('schemaVersion'),
                    itemId: 'schemaVersion',
                    value: '5',
                    store: Ext.create('Ext.data.Store', {
                        fields: [
                            {
                                name: 'name', type: 'string'
                            },
                            {
                                name: 'value', type: 'string'
                            }
                        ],
                        data: [
                            {name: '1', value: '1'},
                            {name: '2', value: '2'},
                            {name: '3', value: '3'},
                            {name: '4', value: '4'},
                            {name: '5', value: '5'}
                        ]
                    }),
                    queryMode: 'local',
                    displayField: 'name',
                    valueField: 'value'
                },
                {
                    name: "productMaterialId",
                    id: 'productMaterialId',
                    fieldLabel: i18n.getKey('productMaterialId'),
                    itemId: 'productMaterialId',
                    allowBlank: false,
                    xtype: 'singlegridcombo',
                    displayField: 'name',
                    valueField: '_id',
                    editable: false,
                    width: 380,
                    store: materialStore,
                    matchFieldWidth: false,
                    multiSelect: false,
                    autoScroll: true,
                    filterCfg: {
                        height: 80,
                        layout: {
                            type: 'column',
                            columns: 2
                        },
                        defaults: {
                            labelAlign: 'right',
                            layout: 'anchor',
                            style: 'margin-right:20px; margin-top : 5px;',
                            labelWidth: 50,
                            width: 250
                        },
                        items: [
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('id'),
                                name: '_id',
                                isLike: false,
                            },
                            {
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('name'),
                                name: 'name',
                            },
                            {
                                xtype: 'combo',
                                fieldLabel: i18n.getKey('type'),
                                name: 'clazz',
                                itemId: 'clazz',
                                valueField: 'value',
                                displayField: 'name',
                                readOnly: isSpecialSku,
                                value: isSpecialSku == true ? 'com.qpp.cgp.domain.bom.MaterialSpu' : null,
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['name', 'value'],
                                    data: [
                                        {
                                            name: 'MaterialSpu',
                                            value: 'com.qpp.cgp.domain.bom.MaterialSpu'
                                        },
                                        {
                                            name: 'MaterialType',
                                            value: 'com.qpp.cgp.domain.bom.MaterialType'
                                        }
                                    ]
                                }),
                            },
                        ]
                    },
                    gridCfg: {
                        store: materialStore,
                        height: 300,
                        width: 600,
                        autoScroll: true,
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 80,
                                dataIndex: '_id',
                                renderer: function (value, metaData) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('name'),
                                width: 200,
                                dataIndex: 'name',
                                renderer: function (value, metaData, record, rowIndex) {
                                    metaData.tdAttr = 'data-qtip="' + "<div>" + value + "</div>" + '"';
                                    return value
                                }
                            },
                            {
                                text: i18n.getKey('type'),
                                flex: 1,
                                dataIndex: 'type'
                            }
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: materialStore,
                            displayInfo: true, // 是否 ? 示， 分 ? 信息
                            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                            emptyMsg: i18n.getKey('noData')
                        })
                    },
                    diySetValue: function (value) {
                        var me = this;
                        me.setInitialValue([value]);
                    },
                    gotoConfigHandler: function () {
                        var me = this;
                        var modelId = this.getSubmitValue()[0];
                        JSOpen({
                            id: 'material' + '_edit',
                            url: path + "partials/material/edit.html?materialId=" + modelId + '&isLeaf=true&parentId= &isOnly=true',
                            title: i18n.getKey('materialInfo') + '(' + i18n.getKey('id') + ':' + modelId + ')',
                            refresh: true
                        });
                    }
                },
                {
                    name: "configValue",
                    xtype: "textarea",
                    width: 650,
                    height: 250,
                    id: 'configValue',
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
                var isLock = JSCheckProductIsLock(productId);
                if (isLock) {
                    JSLockConfig(page);
                }
            }
        }
    });
});
