Ext.Loader.syncRequire([
    'CGP.common.condition.view.ConditionFieldContainer',
    'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.model.GenerateJobConfigModel',
    'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.configgroup.component.diyGridField'
])
Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.configgroup.component.ConfigGroupItem', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.configgroup',
    margin: '10 50 50 50',
    width: '100%',
    height: 500,
    layout: {
        type: 'vbox',
    },
    style: {
        padding: '10 25 10 25',
        borderRadius: '8px'
    },
    defaults: {
        margin: '5 25 5 25',
        labelWidth: 120,
    },
    autoScroll: true,
    collapsed: false,//初始时收缩状态
    collapsible: true,
    saveBtnIsShow: true,
    deleteBtnIsShow: true,
    data: null,//配置数据
    name: null,
    title: null,
    filter: null,
    preview: null,
    productId: null,
    saveBtnFun: null,
    contentData: null,
    deleteBtnFun: null,
    impositionId: null,
    configGroupData: null,
    jobGenerateConfigsSaveHandler: null,
    jobGenerateConfigsDeleteHandler: null,
    initComponent: function () {
        var me = this;
        var generateJobConfigMemoryStore = Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.store.GenerateJobConfigStore', {});
        var memoryStore = Ext.create('Ext.data.Store', {
            model: 'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.model.GenerateJobConfigModel',
            proxy: {
                type: 'memory',
            },
            data: [],
            autoLoad: true
        });
        memoryStore.on({
            beforeload: function (store) {
                var p = store.getProxy();
                if (Ext.isEmpty(p.filter)) {
                    p.filter = me.filter;
                }
            }
        });
        memoryStore.on({
            load: function (store, records) {
                var compositeJobConfig = {};
                var result = [];
                var count = 0;
                for (var i = 0; i < records.length; i++) {
                    var record = records[i];
                    var singleJobConfigsData = [];
                    var recordData = record.getData();
                    var productConfigImpositionId = recordData.compositeJobConfigId;
                    if (!Ext.isEmpty(productConfigImpositionId)) {
                        if (compositeJobConfig[productConfigImpositionId]) {

                        } else {
                            compositeJobConfig[productConfigImpositionId] = [];
                        }
                        compositeJobConfig[productConfigImpositionId].push(records[i]);
                    } else {
                        result.push(recordData);
                    }
                }
                for (var i in compositeJobConfig) {
                    var data = [];
                    for (var j = 0; j < compositeJobConfig[i].length; j++) {
                        data.push(compositeJobConfig[i][j].getData());
                    }
                    // 判断传入的是  已合并的数据(添加关系分组) 还是 未合并的数据(setValue)
                    if (data[count].singleJobConfigs.length > 0) {
                        singleJobConfigsData = data[count].singleJobConfigs;
                        count++;
                    } else {
                        singleJobConfigsData = data;
                    }
                    result.push({
                        clazz: 'com.qpp.cgp.composing.config.ConfigImpositionJobGenerateConfig',
                        singleJobConfigs: singleJobConfigsData,
                        compositeJobConfigId: i,
                        compositeJobConfig: compositeJobConfig[i][0].get('compositeJobConfig'),
                        id: JSGetUUID(),
                        name: '混合Job生成配置',
                        productConfigImpositionId: productConfigImpositionId,
                        condition: compositeJobConfig[i][0].get('condition'),
                        conditionDTO: compositeJobConfig[i][0].get('conditionDTO')
                    })
                }
                memoryStore.loadData(result);
                var memoryData = store.data.items;
                var itemsId = [];
                memoryData.forEach(item => {
                    generateJobConfigMemoryStore.filter({
                        filterFn: function (item2) {
                            return item2.get('_id') != item.data._id;
                        }
                    })
                });
            },
            remove: function (store, records) {
                var memoryData = store.data.items;
                generateJobConfigMemoryStore.clearFilter(true);
                memoryData.forEach(item => {
                    generateJobConfigMemoryStore.filter({
                        filterFn: function (item2) {
                            return item2.get('_id') != item.data._id;
                        }
                    })
                });
            }
        });
        generateJobConfigMemoryStore.on({
            beforeload: function (store) {
                var p = store.getProxy();
                if (Ext.isEmpty(p.filter)) {
                    p.filter = me.filter;
                }
            }
        });
        generateJobConfigMemoryStore.on({
            load: function (store, records) {
                var compositeJobConfig = {};
                var result = [];
                if (store.data.items.length > 0) {
                    for (var i = 0; i < records.length; i++) {
                        var record = records[i];
                        var recordData = record.getData();
                        var productConfigImpositionId = recordData.compositeJobConfigId;
                        if (!Ext.isEmpty(productConfigImpositionId)) {
                            if (compositeJobConfig[productConfigImpositionId]) {

                            } else {
                                compositeJobConfig[productConfigImpositionId] = [];
                            }
                            compositeJobConfig[productConfigImpositionId].push(records[i]);
                        } else {
                            result.push(recordData);
                        }
                    }
                    for (var i in compositeJobConfig) {
                        var data = [];
                        for (var j = 0; j < compositeJobConfig[i].length; j++) {
                            data.push(compositeJobConfig[i][j].getData());
                        }
                        result.push({
                            clazz: 'com.qpp.cgp.composing.config.ConfigImpositionJobGenerateConfig',
                            singleJobConfigs: data,
                            compositeJobConfigId: i,
                            compositeJobConfig: compositeJobConfig[i][0].get('compositeJobConfig'),
                            id: JSGetUUID(),
                            name: '混合Job生成配置',
                            productConfigImpositionId: productConfigImpositionId,
                            condition: compositeJobConfig[i][0].get('condition'),
                            conditionDTO: compositeJobConfig[i][0].get('conditionDTO')
                        })
                    }
                    generateJobConfigMemoryStore.loadData(result);
                }
            }
        });
        me.extraButtons = {
            extraBtn1: {
                xtype: 'button',
                ui: 'default-toolbar-small',
                iconCls: 'icon_save',
                text: i18n.getKey('save'),
                hidden: me.saveBtnIsShow,
                handler: me.saveBtnFun
            },
        };
        me.legendItemConfig = {
            disabledBtn: {
                hidden: true,
                disabled: false,
                isUsable: true,//初始化时，是否是禁用
            },
            deleteBtn: {
                hidden: me.deleteBtnIsShow,
                disabled: false,
                handler: me.deleteBtnFun
            }
        };
        me.items = [
            {
                xtype: 'numberfield',
                name: '_id',
                itemId: '_id',
                fieldLabel: i18n.getKey('id'),
                hideTrigger: true,
                hidden: true
            },
            {
                xtype: 'textfield',
                name: 'clazz',
                itemId: 'clazz',
                fieldLabel: i18n.getKey('clazz'),
                value: 'com.qpp.cgp.composing.config.group.JobGenerateConfigGroup',
                hidden: true
            },
            {
                xtype: 'numberfield',
                name: 'productConfigImpositionId',
                itemId: 'productConfigImpositionId',
                fieldLabel: i18n.getKey('productConfigImpositionId'),
                value: me.impositionId,
                hideTrigger: true,
                hidden: true
            },
            {
                xtype: 'textfield',
                name: 'name',
                itemId: 'name',
                fieldLabel: i18n.getKey('name'),
                width: 450,
                allowBlank: false
            },
            {
                xtype: 'multicombobox',
                name: 'manufactureTypes',
                itemId: 'manufactureTypes',
                width: 450,
                multiSelect: true,
                editable: false,
                allowBlank: false,
                fieldLabel: i18n.getKey('Bom') + i18n.getKey('type'),
                displayField: 'value',
                displayValue: 'key',
                store: {
                    xtype: 'store',
                    fields: ['value', 'key'],
                    data: [
                        {
                            value: 'PS',
                            key: 'PS',
                        },
                        {
                            value: 'EMO',
                            key: 'EMO',
                        },
                    ]
                }
            },
            {
                xtype: 'conditionfieldcontainer',
                width: '100%',
                maxHeight: 350,
                colspan: 2,
                allowBlank: false,
                itemId: 'conditionDTO',
                name: 'conditionDTO',
                minHeight: 150,
                fieldLabel: i18n.getKey('select') + i18n.getKey('condition'),
                contentData: me.contentData,
            },
            {
                xtype: 'textarea',
                autoScroll: true,
                name: 'condition',
                itemId: 'condition',
                width: '100%',
                hidden: true,
                fieldLabel: i18n.getKey('condition'),
                diyGetValue: function () {
                    var me = this;
                    var data = me.getValue();
                    var result = JSON.parse(data);
                    return result;
                },
                diySetValue: function (data) {
                    var me = this;
                    var conditionData = null;
                    if (data) {
                        conditionData = JSON.stringify(data);
                    }
                    me.setValue(conditionData);
                }
            },
            {
                xtype: 'diygridfield',
                itemId: 'jobGenerateConfigs',
                name: 'jobGenerateConfigs',
                model: 'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.model.GenerateJobConfigModel',
                width: '100%',
                style: {
                    marginBottom: '15px',

                },
                isFormField: true,
                autoScroll: true,
                searchGridCfg: {
                    width: 900,
                    gridCfg: {
                        editAction: false,
                        deleteAction: false,
                        plugins: [{
                            ptype: 'rowexpander',
                            rowBodyTpl: new Ext.XTemplate(
                                '<div id="gridExpander-{id}"></div>'
                            ),
                            isHadGridRowExpander: function (record) {
                                if (record.get('clazz') != 'com.qpp.cgp.composing.config.JobGenerateConfig') {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }],
                        viewConfig: {
                            enableTextSelection: true,
                            loadMask: true,
                            listeners: {
                                expandBody: function (rowNode, record, expandRow) {
                                    var me = this;
                                    var orderLineItemDom = document.getElementById('gridExpander-' + record.get('id'));
                                    if (record.get('clazz') == 'com.qpp.cgp.composing.config.ConfigImpositionJobGenerateConfig') {
                                        if (!orderLineItemDom.innerHTML) {
                                            var grid = Ext.widget('subjobconfiggrid', {
                                                store: Ext.create('Ext.data.Store', {
                                                    model: 'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.model.GenerateJobConfigModel',
                                                    data: record.raw.singleJobConfigs,
                                                    proxy: {
                                                        type: 'memory'
                                                    }
                                                }),
                                                renderTo: orderLineItemDom
                                            })
                                        }
                                    }
                                }
                            }
                        },
                        storeCfg: {
                            store: generateJobConfigMemoryStore
                        },
                    },
                    filterCfg: {
                        header: {
                            hidden: true
                        },
                        items: [
                            {
                                xtype: 'numberfield',
                                name: 'id',
                                itemId: 'id',
                                hideTrigger: true,
                                fieldLabel: i18n.getKey('id'),
                            },
                            {
                                xtype: 'textfield',
                                name: 'name',
                                itemId: 'name',
                                fieldLabel: i18n.getKey('name'),
                            },
                            {
                                xtype: 'numberfield',
                                name: 'productConfigImpositionId',
                                itemId: 'productConfigImpositionId',
                                hideTrigger: true,
                                hidden: true,
                                fieldLabel: i18n.getKey('productConfigImpositionId'),
                                value: me.impositionId
                            },
                            {
                                xtype: 'combo',
                                name: 'preview',
                                itemId: 'preview',
                                fieldLabel: i18n.getKey('preview'),
                                displayField: 'value',
                                valueField: 'key',
                                value: false,
                                hidden: true,
                                store: {
                                    xtype: 'store',
                                    fields: ['key', 'value'],
                                    data: []
                                }

                            }
                        ]
                    },
                },
                gridConfig: {
                    autoScroll: true,
                    plugins: [
                        {
                            ptype: 'rowexpander',
                            rowBodyTpl: new Ext.XTemplate(
                                '<div id="gridExpander-{id}"></div>'
                            ),
                            isHadGridRowExpander: function (record) {
                                if (record.get('clazz') != 'com.qpp.cgp.composing.config.JobGenerateConfig') {
                                    return true;
                                } else {
                                    return false;
                                }
                            }
                        }
                    ],
                    viewConfig: {
                        enableTextSelection: true,
                        loadMask: true,
                        listeners: {
                            expandBody: function (rowNode, record, expandRow) {
                                var me = this;
                                var orderLineItemDom = document.getElementById('gridExpander-' + record.get('id'));
                                if (record.get('clazz') == 'com.qpp.cgp.composing.config.ConfigImpositionJobGenerateConfig') {
                                    if (!orderLineItemDom.innerHTML) {
                                        var grid = Ext.widget('subjobconfiggrid', {
                                            store: Ext.create('Ext.data.Store', {
                                                model: 'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.model.GenerateJobConfigModel',
                                                data: record.raw.singleJobConfigs,
                                                proxy: {
                                                    type: 'memory'
                                                }
                                            }),
                                            renderTo: orderLineItemDom
                                        })
                                    }
                                }
                            }
                        }
                    },
                    store: memoryStore,
                },
                displayfieldValue: i18n.getKey('job生成配置列表'),
                saveHandler: me.jobGenerateConfigsSaveHandler,
                deleteHandler: me.jobGenerateConfigsDeleteHandler,
                diyGetValue: function () {
                    var p = this;
                    var dataArray = [];
                    var memoryStoreData = p.gridConfig.store.data.items;
                    memoryStoreData.forEach(item => {
                        if (!item.data._id) {
                            item.data.singleJobConfigs.forEach(item => {
                                dataArray.push(item);
                            })
                        } else {
                            dataArray.push(item.data);
                        }
                    })
                    return dataArray;
                },
                diySetValue: function (data) {
                    var p = this;
                    var memoryStore = p.gridConfig.store;
                    if (data) {
                        data.forEach(item => {
                            memoryStore.proxy.data.push(item);
                            memoryStore.load();
                        })
                    }
                }
            },
        ];
        me.callParent(arguments);
        me.on('afterrender', function () {
            var page = this;
            var productId = me.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        me.items.items.forEach(function (item) {
            if (item.rendered) {
                if (item.isValid && item.isValid() == false) {
                    isValid = false;
                }
            }
        });
        isValid ? null : me.expand();
        return isValid;
    },
    getName: function () {
        var me = this;
        return me.name;
    },
    getValue: function () {
        var me = this;
        var result = {};
        // 将选择条件的Value转换并set进condition中再get全局的数据就能拿到转换好的condition
        var conditionDTOData = me.getComponent('conditionDTO').getExpression();
        var condition = me.getComponent('condition');
        if (conditionDTOData.expression) {
            condition.diySetValue(conditionDTOData.expression);
        }
        me.items.items.forEach(function (item) {
            if ((item.diyGetValue || item.getValue) && item.disabled != true) {
                if (item.diyGetValue) {
                    result[item.getName()] = item.diyGetValue();
                } else {
                    result[item.getName()] = item.getValue();
                }
            }
        });
        return result;
    },
    setValue: function (data) {
        var me = this;
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.diySetValue) {
                item.diySetValue(data[item.getName()]);
            } else {
                item.setValue(data[item.getName()]);
            }
        }
    },
    getErrors: function () {
        return '该配置必须完备';
    },
    getFieldLabel: function () {
        return this.areaType;
    },

})