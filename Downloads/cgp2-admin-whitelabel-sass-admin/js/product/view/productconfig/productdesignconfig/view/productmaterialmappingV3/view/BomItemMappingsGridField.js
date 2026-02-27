/**
 * Created by nan on 2020/3/31.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.BomItemMappingsGridField', {
    extend: 'Ext.ux.form.GridFieldWithCRUD',
    name: 'obiMappings',
    itemId: 'bomItemMappingsGridField',
    alias: 'widget.bomitemmappingsgridfield',
    fieldLabel: i18n.getKey('可选件生成规则'),
    minHeight: 100,
    msgTarget: 'side',
    labelAlign: 'top',
    allowBlank: false,
    data: null,
    padding: '10 25 30 25',
    material: null,
    bomItem: null,
    itemMaterialMappingConfigs: null,
    switchUrl: path + 'ClientLibs/extjs/resources/themes/images/ux/switchType.png',
    saveHandler: function (btn) {
        var form = btn.ownerCt.ownerCt;
        var win = form.ownerCt;
        var gridField = win.gridField;
        if (form.isValid()) {
            var data = {};
            form.items.items.forEach(function (item) {
                if (item.disabled == false) {
                    if (item.xtype == 'bomitemqtyconfiggridfield' || item.xtype == 'bomitemmaterialpredicatesgridfield') {
                        data[item.getName()] = item.getSubmitValue();
                    } else if (item.getName() == 'itemMaterialMappingConfigs') {
                        gridField.itemMaterialMappingConfigs;
                        var itemMaterialMappingConfigs = [];
                        for (var i in gridField.itemMaterialMappingConfigs) {
                            itemMaterialMappingConfigs.push(gridField.itemMaterialMappingConfigs[i]);
                        }
                        data['itemMaterialMappingConfigs'] = itemMaterialMappingConfigs;
                    } else {
                        data[item.getName()] = item.getValue();
                    }
                }
            });
            data.clazz = 'com.qpp.cgp.domain.product.config.material.mapping2dto.UBIToOBIItemMappingDTOConfig';
            console.log(data);
            if (Ext.isEmpty(data.itemMaterialMappingConfigs)) {
                data.itemMaterialMappingConfigs = [];
            }
            if (win.createOrEdit == 'create') {
                win.outGrid.store.add(data);
            } else {
                for (var i in data) {
                    win.record.set(i, data[i]);
                }
            }
            //触发修改事件
            var centerContainer = Ext.getCmp('productMaterialMappingV3_CenterContainer');
            if (centerContainer) {
                centerContainer.fireEvent('dirty');
            }
            win.close();
        }
    },
    setValueHandler: function (data) {
        var win = this;
        var form = win.getComponent('form');
        Ext.suspendLayouts();//挂起布局
        form.items.items.forEach(function (item) {
            if (item.disabled == false) {
                if (item.xtype == 'bomitemqtyconfiggridfield' || item.xtype == 'bomitemmaterialpredicatesgridfield') {
                    item.setSubmitValue(data[item.getName()]);
                } else if (item.getName() == 'itemMaterialMappingConfigs') {//这个设置值在渲染后
                    var itemMaterialMappingConfigs = data['itemMaterialMappingConfigs'];
                    var store = item.getStore();
                    store.suspendEvents();
                    for (var i = 0; i < store.getCount(); i++) {
                        var record = store.getAt(i);
                        for (var j = 0; j < itemMaterialMappingConfigs.length; j++) {
                            var materialMappingConfigItem = itemMaterialMappingConfigs[j];
                            if (materialMappingConfigItem.materialId == record.get('material')._id) {
                                record.set('mappingDtoId', materialMappingConfigItem.materialMappingId);
                                record.set('materialMappingDomainId', materialMappingConfigItem.materialMappingDomainId);
                                continue;
                            }
                        }
                    }
                    store.resumeEvents();
                } else {
                    if (item.getName() == '_id') {//_id不能设置空值
                        if (data[item.getName()])
                            item.setValue(data[item.getName()]);
                    } else {
                        item.setValue(data[item.getName()]);
                    }
                }
            }
        });
        form.updateLayout()//更新布局
        Ext.resumeLayouts();//恢复布局
    },
    deleteHandler: function (view, rowIndex, colIndex) {
        var store = view.getStore();
        store.removeAt(rowIndex);
        //触发修改事件
        var centerContainer = Ext.getCmp('productMaterialMappingV3_CenterContainer');
        if (centerContainer) {
            centerContainer.fireEvent('dirty');
        }
    },
    resetHandler: function (btn) {
        var form = btn.ownerCt.ownerCt;
        var win = form.ownerCt;
        form.el.mask('loading..');
        setTimeout(function () {
            if (win.record) {
                win.setValueHandler(win.record.getData());
            } else {
                win.setValueHandler({
                    clazz: 'com.qpp.cgp.domain.product.config.material.mapping2dto.UBIToOBIItemMappingDTOConfig',
                    outputValue: {
                        clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                        value: null
                    },
                    itemMaterialMappingConfigs: [],
                    materialPredicates: []
                })
            }
            form.el.unmask('loading..');
        }, 100)
    },
    initComponent: function () {
        var me = this;
        var bomItem = me.bomItem;
        var optionalMaterials = me.bomItem.optionalMaterials || [];
        var optionalMaterialArr = [];
        me.itemMaterialMappingConfigs = {};
        optionalMaterials.forEach(function (item) {
            if (item.clazz == 'com.qpp.cgp.domain.bom.MaterialType') {
                optionalMaterialArr.push(item);
            }
        });
        if (me.bomItem.itemMaterial.clazz == 'com.qpp.cgp.domain.bom.MaterialType') {
            optionalMaterialArr.push(me.bomItem.itemMaterial);
        }
        var materialToMappingStore = Ext.create('Ext.data.Store', {//物料和映射之间对应关联
            autoSync: true,
            fields: [
                {name: 'material', type: 'object'},
                {name: 'mappings', type: 'object'},
                {
                    name: 'materialMappingDomainId', type: 'string'
                },
                {
                    name: 'mappingDtoId', type: 'string'
                }
            ],
            data: []
        });
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.Controller');
        var materialPath = Ext.getCmp('productMaterialMappingV3_CenterContainer').materialPath
        var bomItemPath = materialPath + ',' + bomItem._id;
        var configType = JSGetQueryString('configType');//配置类型，productConfigDesignId也被用来存mappingConfigId;
        var materialMappingDTOConfigStore = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.store.MaterialMappingDTOConfigStore', {
            storeId: 'MaterialMappingDTOConfigStore',
            autoLoad: true,
            params: {
                filter: Ext.JSON.encode([
                    {
                        name: 'materialPath',
                        type: 'string',
                        value: bomItemPath + '%'
                    },
                    {
                        name: configType == 'mappingConfig' ? "productConfigMappingId" : "productConfigDesignId",
                        value: JSGetQueryString('productConfigDesignId'),
                        type: 'number'
                    }
                ])
            },
            listeners: {
                load: function (store, records) {
                    var data = [];
                    for (var i = 0; i < optionalMaterialArr.length; i++) {
                        var optionMapping = [];
                        var path = bomItemPath + ',' + optionalMaterialArr[i]._id;
                        for (var j = 0; j < records.length; j++) {
                            if (path == records[j].raw.materialPath) {
                                var dto = records[j].getData();
                                optionMapping.push({
                                    materialId: dto.materialId,
                                    materialMappingId: dto._id,
                                    materialMappingConfigDomain: dto.materialMappingConfigDomain._id,
                                    display: dto.description + '(' + dto._id + ')',
                                    value: dto.materialId + '-' + dto.materialMappingConfigDomain._id + '-' + dto._id,
                                });
                            }
                        }
                        data.push({
                            material: optionalMaterialArr[i],
                            mappings: optionMapping,
                        })
                    }
                    console.log(data);
                    materialToMappingStore.loadData(data);
                }
            }
        });
        me.formItems = [
            {
                xtype: 'textfield',
                readOnly: true,
                fieldLabel: i18n.getKey('id'),
                name: '_id',
                itemId: '_id',
                width: 500,
                fieldStyle: 'background-color:silver',
                listeners: {
                    afterrender: function (field) {
                        var outGrid = field.ownerCt.ownerCt.outGrid;
                        if (outGrid.record) {
                        } else {//新建时的值
                            field.setValue(JSGetCommonKey(false));
                        }
                    }
                }
            },
            {
                name: 'description',
                itemId: 'description',
                xtype: 'textfield',
                allowBlank: false,
                width: 500,
                fieldLabel: i18n.getKey('description')
            },
            {
                xtype: 'gridfield',
                name: 'itemMaterialMappingConfigs',
                itemId: 'itemMaterialMappingConfigs',
                fieldLabel: i18n.getKey('选择物料对应的mapping'),
                width: 500,
                hidden: optionalMaterialArr.length == 0,//没有smt关联物料不需要选定mapping
                disabled: optionalMaterialArr.length == 0,//没有smt关联物料不需要选定mapping
                allowBlank: false,
                msgTarget: 'under',
                gridConfig: {
                    renderTo: JSGetUUID(),
                    maxHeight: 350,
                    store: materialToMappingStore,
                    columns: [
                        {
                            text: i18n.getKey('关联物料Id'),
                            dataIndex: 'material',
                            tdCls: 'vertical-middle',
                            width: 200,
                            xtype: "componentcolumn",
                            renderer: function (value, metadata, record) {
                                return value._id
                            }
                        },
                        {
                            text: i18n.getKey('物料映射'),
                            dataIndex: 'mappings',
                            tdCls: 'vertical-middle',
                            flex: 1,
                            xtype: "componentcolumn",
                            renderer: function (value, metadata, record, colIndex, rowIndex, index6, gridView) {
                                var recordData = null;
                                recordData = gridView.ownerCt.gridField.ownerCt.ownerCt.record;
                                return {
                                    xtype: 'combo',
                                    msgTarget: 'side',
                                    editable: false,
                                    displayField: 'display',
                                    valueField: 'value',
                                    queryMode: 'local',
                                    readOnly: value.length == 1,
                                    store: {
                                        xtype: 'store',
                                        fields: ['value', 'display'],
                                        data: value
                                    },
                                    listeners: {
                                        change: function (comp, newValue, oldValue) {
                                            var material = newValue.split('-')[0];
                                            var materialMappingDomainId = newValue.split('-')[1];
                                            var materialMappingId = newValue.split('-')[2];
                                            me.itemMaterialMappingConfigs[material] = {
                                                materialId: material,
                                                materialMappingId: materialMappingId,
                                                materialMappingDomainId: materialMappingDomainId
                                            }
                                            console.log(me.itemMaterialMappingConfigs)
                                        },
                                        afterrender: function (comp) {
                                            var materialMappingDomainId = record.get('materialMappingDomainId');
                                            var mappingDtoId = record.get('mappingDtoId');
                                            //编辑状态下的
                                            if (materialMappingDomainId && recordData) {
                                                var result = record.get('material')._id + '-' + materialMappingDomainId + '-' + mappingDtoId;
                                                comp.setValue(result);
                                            } else if (value.length == 1) {//新建时，自动填入只有一个mapping的配置
                                                comp.setValue(value[0].value);
                                            }
                                        }
                                    },
                                }
                            }
                        }
                    ]
                }
            },
            {
                xtype: 'bomitemqtyconfiggridfield',
                bomItem: bomItem,
                width: 800,
                fieldLabel: i18n.getKey('Bom比例配置'),
                tipInfo: '用于确定BomItem的数量'
            },
            {
                xtype: 'bomitemmaterialpredicatesgridfield',
                bomItem: bomItem,
                width: 800,
                allowBlank: true,
                fieldLabel: i18n.getKey('指定可选件物料筛选配置')
            }

        ];
        me.gridConfig = {
            renderTo: JSGetUUID(),
            autoScroll: true,
            maxHeight: 350,
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: '_id',
                        type: 'string'
                    },
                    {
                        name: 'qtyMappingRules',
                        type: 'array'
                    },
                    {
                        name: 'materialPredicates',
                        type: 'array'
                    },
                    {
                        name: 'itemMaterialMappingConfigs',
                        type: 'array'
                    },
                    {
                        name: 'description',
                        type: 'string'
                    },
                    {
                        name: 'clazz',
                        type: 'string',
                        value: 'com.qpp.cgp.domain.product.config.material.mapping2dto.UBIToOBIItemMappingDTOConfig'
                    }
                ],
                data: me.data || [],
            }),
            columns: [
                {
                    xtype: 'rownumberer',
                    tdCls: 'vertical-middle',
                    width: 60
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    tdCls: 'vertical-middle',
                    itemId: 'description',
                    width: 260
                },
                {
                    width: 100,
                    tdCls: 'vertical-middle',
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                },
                {
                    text: i18n.getKey('BomItem用量映射规则'),
                    dataIndex: 'qtyMappingRules',
                    tdCls: 'vertical-middle',
                    itemId: 'qtyMappingRules',
                    width: 200,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        var grid = gridView.ownerCt;
                        console.log(value)
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>查看BomItem用量映射规则</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        controller.checkBomItemQtyMappingRules(value);
                                    });
                                }
                            }
                        };

                    }
                },
                {
                    text: i18n.getKey('BomItem物料筛选规则'),
                    dataIndex: 'materialPredicates',
                    tdCls: 'vertical-middle',
                    itemId: 'materialPredicates',
                    width: 200,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        var grid = gridView.ownerCt;
                        console.log(value)
                        if (value && value.length > 0) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>查看BomItem物料筛选规则</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            controller.checkBomItemMaterialPredicates(value);
                                        });
                                    }
                                }
                            };
                        } else {
                            return null;
                        }
                    }
                },
                {
                    text: i18n.getKey('mappingConfigs'),
                    dataIndex: 'itemMaterialMappingConfigs',
                    tdCls: 'vertical-middle',
                    itemId: 'itemMaterialMappingConfigs',
                    width: 200,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        var grid = gridView.ownerCt;
                        console.log(value)
                        if (value && value.length > 0) {
                            return {
                                xtype: 'displayfield',
                                value: '<a href="#")>查看物料对应的mapping</a>',
                                listeners: {
                                    render: function (display) {
                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                        ela.on("click", function () {
                                            controller.checkItemMaterialMappingConfigs(value);
                                        });
                                    }
                                }
                            };
                        } else {
                            return null;
                        }
                    }
                }
            ]
        };
        me.callParent();
    },
})
