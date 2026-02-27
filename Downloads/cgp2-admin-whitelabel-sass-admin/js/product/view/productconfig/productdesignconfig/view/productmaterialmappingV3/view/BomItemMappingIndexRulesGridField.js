/**
 * Created by nan on 2020/3/31.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.BomItemMappingIndexRulesGridField', {
    extend: 'Ext.ux.form.GridFieldWithCRUD',
    name: 'obiMappingIndexRules',
    itemId: 'bomItemMappingIndexRulesGridField',
    alias: 'widget.bomitemmappingindexrulesgrid',
    fieldLabel: i18n.getKey('BomItem位置定义'),
    minHeight: 100,
    msgTarget: 'side',
    labelAlign: 'top',
    allowBlank: false,
    bomItem: null,
    padding: '10 25 15 25',
    data: null,
    beforeOpenEditWindowHandler: function () {
        var me = this;
        me.formItems[1].gridConfig.store = Ext.create('Ext.data.Store', {
            autoSync: true,
            fields: [
                {
                    name: 'condition',
                    type: 'object'
                },
                {
                    name: 'outputValue',
                    type: 'object'
                },
                {
                    name: 'description',
                    type: 'string'
                },
                {
                    name: 'clazz',
                    type: 'string',
                    defaultValue: 'com.qpp.cgp.domain.product.config.material.mapping2dto.ObiMappingIndexRule'
                }
            ],
            data: []
        });
    },
    saveHandler: function (btn) {
        var form = btn.ownerCt.ownerCt;
        var win = form.ownerCt;
        if (form.isValid()) {
            var data = {};
            form.items.items.forEach(function (item) {
                if (item.disabled == false) {
                    if (item.xtype == 'gridfieldwithcrud') {
                        data[item.getName()] = item.getSubmitValue();
                    } else {
                        data[item.getName()] = item.getValue();
                    }
                }
            });
            console.log(data);
            data.clazz = 'com.qpp.cgp.domain.product.config.material.mapping2dto.ObiMappingIndexRule';
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
    resetHandler: function (btn) {
        var form = btn.ownerCt.ownerCt;
        var win = form.ownerCt;
        form.el.mask('loading..');
        setTimeout(function () {
            if (win.record) {
                win.setValueHandler(win.record.getData());
            } else {
                win.setValueHandler({
                    clazz: 'com.qpp.cgp.domain.product.config.material.mapping2dto.MappingRule',
                    outputValue: {
                        clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                        value: null
                    },
                    condition: {
                        conditionType: "simple",
                        clazz: "com.qpp.cgp.domain.executecondition.InputCondition",
                        operation: {
                            operator: "AND",
                            operations: [],
                            clazz: "com.qpp.cgp.domain.executecondition.operation.LogicalOperation"
                        }
                    }
                })
            }
            form.el.unmask('loading..');
        }, 100)
    },
    setValueHandler: function (data) {
        var win = this;
        var form = win.getComponent('form');
        form.items.items.forEach(function (item) {
            if (item.disabled == false) {
                if (item.xtype == 'gridfieldwithcrud') {
                    item.setSubmitValue(data[item.getName()]);
                } else {
                    if (item.getName() == 'index') {//index不能设置空值
                        if (!Ext.isEmpty(data[item.getName()]))
                            item.setValue(data[item.getName()]);
                    } else {
                        item.setValue(data[item.getName()]);
                    }
                }
            }
        })
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
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.Controller');
        me.formItems = [
            {
                xtype: 'numberfield',
                name: 'index',
                itemId: 'index',
                fieldLabel: i18n.getKey('位置'),
                readOnly: true,
                fieldStyle: 'background-color:silver',
                listeners: {
                    afterrender: function (field) {
                        var outGrid = field.ownerCt.ownerCt.outGrid;
                        if (outGrid.record) {

                        } else {//新建时的值
                            field.setValue(outGrid.store.getCount());
                        }
                    }
                }
            },
            {
                xtype: 'gridfieldwithcrud',
                name: 'bomItemIndexRules',
                itemId: 'bomItemIndexRules',
                fieldLabel: i18n.getKey('映射规则'),
                width: 800,
                minHeight: 100,
                msgTarget: 'side',
                allowBlank: false,
                saveHandler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    var win = form.ownerCt;
                    var isValid = true;
                    form.items.items.forEach(function (item) {
                        if (item.disabled == false) {
                            if (item.isValid() == false) {
                                isValid = false;
                            }
                        }
                    });
                    if (isValid == true) {
                        var data = {};
                        form.items.items.forEach(function (item) {
                            if (item.disabled == false) {
                                data[item.getName()] = item.getValue();
                            }
                        });
                        if (!Ext.isObject(data.outputValue)) {
                            data.outputValue = {
                                clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                                value: data.outputValue
                            }
                        }
                        data.clazz = 'com.qpp.cgp.domain.product.config.material.mapping2dto.MappingRule';

                        var gridSpecialRecord = {};
                        var outGrid = win.outGrid;
                        for (var i = 0; i < outGrid.store.getCount(); i++) {
                            var record = outGrid.store.getAt(i);
                            var condition = record.get('condition');
                            if (condition && condition.conditionType == 'else') {
                                gridSpecialRecord.else = record;
                            } else if (Ext.isEmpty(condition)) {
                                gridSpecialRecord.empty = record;
                            }
                        }
                        if (win.createOrEdit == 'create') {
                            if (data.condition && data.condition.conditionType == 'else') {
                                if (gridSpecialRecord.else) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('其他条件都不成立时执行的配置已经存在!'));
                                    return;
                                }
                            } else if (Ext.isEmpty(data.condition)) {
                                if (gridSpecialRecord.empty) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('无条件执行的配置已经存在!'));
                                    return;
                                }
                            }
                            win.outGrid.store.add(data);
                        } else {
                            if (data.condition && data.condition.conditionType == 'else') {
                                if (gridSpecialRecord.else && win.record != gridSpecialRecord.else) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('其他条件都不成立时执行的配置已经存在!'));
                                    return;
                                }
                            } else if (Ext.isEmpty(data.condition)) {
                                if (gridSpecialRecord.empty && win.record != gridSpecialRecord.empty) {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('无条件执行的配置已经存在!'));
                                    return;
                                }
                            }
                            for (var i in data) {
                                win.record.set(i, data[i]);
                            }
                        }
                        win.close();
                    }
                },
                setValueHandler: function (data) {
                    var win = this;
                    var form = win.getComponent('form');
                    form.items.items.forEach(function (item) {
                        if (item.disabled == false) {
                            if (item.getName() == 'outputValue') {
                                item.setValue(data['outputValue'].value);
                            } else {
                                item.setValue(data[item.getName()]);

                            }
                        }
                    })
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
                                clazz: 'com.qpp.cgp.domain.product.config.material.mapping2dto.MappingRule',
                                outputValue: {
                                    clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                                    value: null
                                },
                                condition: {
                                    conditionType: "simple",
                                    clazz: "com.qpp.cgp.domain.executecondition.InputCondition",
                                    operation: {
                                        operator: "AND",
                                        operations: [],
                                        clazz: "com.qpp.cgp.domain.executecondition.operation.LogicalOperation"
                                    }
                                }
                            })
                        }
                        form.el.unmask('loading..');
                    }, 100)
                },
                gridConfig: {
                    autoScroll: true,
                    minHeight: 100,
                    maxHeight: 200,
                    store: null,
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
                            flex: 1
                        },
                        {
                            text: i18n.getKey('condition'),
                            dataIndex: 'condition',
                            tdCls: 'vertical-middle',
                            itemId: 'condition',
                            width: 150,
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                                if (value && value.conditionType == 'else') {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<font color="red">其他条件都不成立时执行</font>'
                                    };
                                } else if (value && (value.operation.operations.length > 0 || value.conditionType == 'custom')) {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#")>查看执行条件</a>',
                                        listeners: {
                                            render: function (display) {
                                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                ela.on("click", function () {
                                                    controller.checkCondition(value);
                                                });
                                            }
                                        }
                                    };
                                } else {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<font color="green">无条件执行</font>'
                                    };
                                }
                            }
                        },
                        {
                            text: i18n.getKey('可选件生成规则'),
                            dataIndex: 'outputValue',
                            tdCls: 'vertical-middle',
                            itemId: 'outputValue',
                            flex: 1,
                            renderer: function (value) {
                                return value.value;
                            }
                        }]
                },
                formItems: [
                    {
                        name: 'clazz',
                        itemId: 'clazz',
                        xtype: 'textfield',
                        allowBlank: false,
                        hidden: true,
                        value: 'com.qpp.cgp.domain.product.config.material.mapping2dto.MappingRule',
                        fieldLabel: i18n.getKey('clazz')
                    },
                    {
                        name: 'description',
                        itemId: 'description',
                        xtype: 'textfield',
                        allowBlank: false,
                        fieldLabel: i18n.getKey('description')
                    },
                    {
                        name: 'outputValue',
                        itemId: 'outputValue',
                        xtype: 'combo',
                        allowBlank: false,
                        valueField: '_id',
                        displayField: 'display',
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                '_id', 'description', {
                                    name: 'display',
                                    type: 'string',
                                    convert: function (value, record) {
                                        return record.get('description') + '(' + record.get('_id') + ')';
                                    }
                                }
                            ],
                            data: [],
                            proxy: {
                                type: 'memory'
                            }
                        }),
                        editable: false,
                        fieldLabel: i18n.getKey('可选件生成规则'),
                        listeners: {
                            'afterrender': function (combo) {
                                var form = combo.ownerCt;
                                var win = form.ownerCt;
                                var gridField = win.gridField;
                                var bomItemMappingGridFieldValue = gridField.ownerCt.ownerCt.gridField.ownerCt.getComponent('bomItemMappingsGridField').getSubmitValue();
                                combo.store.proxy.data = Ext.clone(bomItemMappingGridFieldValue);
                                combo.store.load();
                            }
                        }

                    },
                    {
                        xtype: 'conditionfieldcontainer',
                        name: 'condition',
                        itemId: 'condition',
                        maxHeight: 350,
                        width: 800,
                        minHeight: 80,
                        extraParams: [
                            {
                                id: 'generateObiQuantity',
                                value: 'generateObiQuantity',
                                name: 'generateObiQuantity'
                            }
                        ],
                        fieldLabel: i18n.getKey('condition'),
                    }
                ]
            }

        ];
        me.gridConfig = {
            renderTo: JSGetUUID(),
            autoScroll: true,
            maxHeight: 350,
            store: Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: 'index',
                        type: 'number'
                    },
                    {
                        name: 'bomItemIndexRules',
                        type: 'array'
                    },
                    {
                        name: 'clazz',
                        type: 'string',
                        defaultValue: 'com.qpp.cgp.domain.product.config.material.mapping2dto.ObiMappingIndexRule'
                    }
                ],
                data: me.data || []
            }),
            columns: [
                {
                    xtype: 'rownumberer',
                    tdCls: 'vertical-middle',
                    width: 60
                },
                {
                    text: i18n.getKey('位置索引'),
                    dataIndex: 'index',
                    tdCls: 'vertical-middle',
                    itemId: 'index',
                    width: 150,
                },
                {
                    text: i18n.getKey('映射规则'),
                    dataIndex: 'bomItemIndexRules',
                    tdCls: 'vertical-middle',
                    itemId: 'bomItemIndexRules',
                    flex: 1,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                        var grid = gridView.ownerCt;
                        console.log(value)
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>查看映射规则</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        controller.checkBomItemIndexMapping(value);
                                    });
                                }
                            }
                        };
                    }
                }]
        };
        me.callParent();
    },
})
