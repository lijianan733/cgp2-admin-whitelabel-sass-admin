/**
 * Created by admin on 2020/3/11.
 */
Ext.define('CGP.product.view.pricingStrategyv2.view.ConditionGrid', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.conditiongrid',
    layout: 'vbox',
    productId: null,
    maxHeight: 350,
    requires: [
        'CGP.product.view.productattributeprofile.store.ProfileStore',
        'CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.model.ProductAttributeModel'
    ],
    autoScroll: true,
    conditionType: 'simple',//simple,complex
    operator: 'AND',//
    productProfileStore: null,
    checkOnly: false,//是否只能查看
    contextAttributeStore: null,
    componentUUId: null,//一个独一无二的编号，用于加在grid中componentcolumn中渲染出的组件Id的后缀上，使创建多个该组件时不会发生组件id重复
    inputTypeProperty: [//选项类型的可用操作符
        {
            value: 'Value',
            display: 'Value'
        },
        {
            value: 'Enable',
            display: 'Enable'
        },
        {
            value: 'Hidden',
            display: 'Hidden'
        },
        {
            value: 'ReadOnly',
            display: 'ReadOnly'
        },
        {
            value: 'Required',
            display: 'Required'
        },
        {
            value: 'OriginalValue',
            display: 'OriginalValue'
        },
        {
            value: 'OriginalEnable',
            display: 'OriginalEnable'
        },
        {
            value: 'OriginalHidden',
            display: 'OriginalHidden'
        },
        {
            value: 'OriginalRequire',
            display: 'OriginalRequire'
        }
    ],
    optionTypeProperty: [//离散输入型的可用操作符
        {
            value: 'EnableOption',
            display: 'EnableOption'
        },
        {
            value: 'HiddenOption',
            display: 'EnableOption'
        },
        {
            value: 'OriginalEnableOption',
            display: 'OriginalEnableOption'
        },
        {
            value: 'OriginalHiddenOption',
            display: 'OriginalHiddenOption'
        }
    ],
    inputTypeOperator: [
        {
            value: '==',
            display: '='
        },
        {
            value: '!=',
            display: '!='
        },
        {
            value: '<',
            display: '<'
        },
        {
            value: '<=',
            display: '<='
        },
        {
            value: '>',
            display: '>'
        },
        {
            value: '>=',
            display: '>='
        },
        {
            display: '[min,max]',
            value: '[min,max]'
        },
        {
            display: '[min,max)',
            value: '[min,max)'
        },
        {
            display: '(min,max)',
            value: '(min,max)'
        },
        {
            display: '(min,max]',
            value: '(min,max]'
        }

    ],
    optionTypeOperator: [
        {
            value: '==',
            display: '='
        },
        {
            value: '!=',
            display: '!='
        }, {
            display: 'In',
            value: 'In'
        }, {
            display: 'NotIn',
            value: 'NotIn'
        }],
    viewConfig: {
        markDirty: false//标识修改的字段
    },
    initComponent: function () {
        var me = this;
        me.componentUUId = JSGetUUID();

        Ext.apply(Ext.form.field.VTypes, {
            minAndMax: function (val, field) {
                if (field.itemId == 'min') {
                    var max = field.ownerCt.getComponent('max');
                    if (Ext.isEmpty(max.getValue())) {
                        return true;
                    }
                    if (val < max.getValue()) {
                        max.clearInvalid()
                        return true;
                    } else {
                        return false
                    }

                } else {
                    var min = field.ownerCt.getComponent('min');
                    if (Ext.isEmpty(min.getValue())) {
                        return true;
                    }
                    if (val > min.getValue()) {
                        min.clearInvalid()
                        return true;
                    } else {
                        return false
                    }
                }
            },
            minAndMaxText: '请输入正确数值'
        });
        me.tbar = {
            border: false,
            items: [
                {
                    xtype: 'button',
                    iconCls: 'icon_add',
                    itemId: 'addBtn',
                    disabled: me.checkOnly,
                    text: i18n.getKey('添加条件'),
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt;
                        grid.store.add({});
                    }
                },
                {
                    xtype: 'radiogroup',
                    width: 500,
                    itemId: 'typeRadioGroup',
                    hidden: true,
                    items: [
                        {boxLabel: '满足以下所有条件', name: 'type', readOnly: me.checkOnly, inputValue: 'AND', checked: true},
                        {boxLabel: '满足以下任一条件', name: 'type', readOnly: me.checkOnly, inputValue: 'OR'}
                    ],
                    listeners: {
                        change: function (field, newValue, oldValue) {
                            var panel = field.ownerCt.ownerCt;
                            panel.operator = newValue.type;
                        }
                    }
                }
            ]
        };
        me.contextAttributeStore = me.contextAttributeStore || Ext.data.StoreManager.get('contextAttributeStore');
        me.productProfileStore = Ext.data.StoreManager.get('profileStore');

        me.store = Ext.create('Ext.data.Store', {
            model: 'Condition',
            fields: [
                {
                    name: 'skuAttribute',
                    type: 'object'
                },
                'propertyName',
                'operator',
                {
                    name: 'value',
                    type: 'object'
                },
                {'name': 'Qty'}
            ],
            proxy: {
                type: 'memory'
            }
        });
        me.columns = [
            {
                xtype: 'actioncolumn',
                width: 50,
                sortable: false,
                hidden: me.checkOnly,
                tdCls: 'vertical-middle',
                menuDisabled: true,
                items: [
                    {
                        iconCls: 'icon_remove icon_margin',
                        tooltip: 'Delete',
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var store = view.getStore();
                            var constraintId = record.getId();
                            Ext.Msg.confirm('提示', '确定删除？', callback);

                            function callback(id) {
                                if (id === 'yes') {
                                    store.remove(record);
                                }
                            }
                        }
                    }
                ]
            },
            {
                text: i18n.getKey('attribute'),
                sortable: false,
                menuDisabled: true,
                width: 120,
                dataIndex: 'skuAttribute',
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record, col, row, store, gridView) {

                    var grid = gridView.ownerCt;
                    return {
                        xtype: 'gridcombo',
                        id: col + '_' + row + '_' + grid.componentUUId,
                        editable: false,
                        displayField: 'attributeName',
                        valueField: 'id',
                        allowBlank: false,
                        value: value,
                        name: 'skuAttribute',
                        store: me.contextAttributeStore,
                        pickerAlign: 'bl',
                        matchFieldWidth: false,
                        gridCfg: {
                            store: store,
                            height: 200,
                            width: 200,
                            columns: [
                                {
                                    dataIndex: 'attributeName',
                                    flex: 1,
                                    tdCls: 'vertical-middle',
                                    text: i18n.getKey('attributeName')
                                }
                            ]
                        },
                        listeners: {
                            change: function (gridCombo, newValue, oldValue) {
                                if (Ext.isEmpty(value)) {
                                    var operator = Ext.getCmp(col + '_' + (row + 1) + '_' + grid.componentUUId);
                                    me.setNextComp(operator, newValue);
                                    if (!Ext.Object.isEmpty(newValue)) {
                                        var skuAttribute = newValue[gridCombo.getSubmitValue()[0]];
                                        operator.store.proxy.data = grid.optionTypeOperator;
                                        operator.store.load();
                                    }
                                }
                            },
                            afterrender: function (gridcombo) {
                                if (value) {
                                    var data = {};
                                    data[value.id] = value;
                                    gridcombo.fireEvent('change', gridcombo, data, data);
                                }
                            }
                        }
                    }
                }
            },
            {
                text: i18n.getKey('operator'),
                sortable: false,
                menuDisabled: true,
                width: 120,
                dataIndex: 'operator',
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record, col, row, store, gridView) {
                    var grid = gridView.ownerCt;
                    return {
                        xtype: 'combo',
                        id: col + '_' + row + '_' + grid.componentUUId,
                        name: 'operator',
                        fieldStyle: value ? 'background-color: white' : 'background-color: silver',
                        disabled: value ? false : true,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['display', 'value'],
                            data: grid.optionTypeOperator
                        }),
                        valueField: 'value',
                        editable: false,
                        displayField: 'display',
                        value: value,
                        allowBlank: false,
                        listeners: {
                            change: function (combo, newValue, oldValue) {
                                var value = Ext.getCmp(col + '_' + (row + 1) + '_' + grid.componentUUId);
                                //var propertyCombo = Ext.getCmp(col + '_' + (row - 1) + '_' + grid.componentUUId);
                                var skuAttributeGridCombo = Ext.getCmp(col + '_' + (row - 1) + '_' + grid.componentUUId);
                                var propertyName = 'Value';
                                for (var i = 0; i < value.items.items.length; i++) {//先把所有子组件隐藏，再根据选择确定显示哪个组件
                                    var item = value.items.items[i];
                                    if (item.hidden == false) {
                                        item.hide();
                                        item.reset();
                                        item.setDisabled(true);
                                        item.setFieldStyle('background-color: silver');
                                    }
                                }
                                if (newValue) {//修改
                                    if (propertyName == 'Enable' || propertyName == 'Hidden' || propertyName == 'Required' || propertyName == 'OriginalEnable' || propertyName == 'OriginalHidden' || propertyName == 'OriginalRequire' || propertyName == 'ReadOnly') {
                                        var booleanField = value.getComponent('boolean');
                                        booleanField.setDisabled(false);
                                        booleanField.show();
                                        booleanField.setFieldStyle('background-color: white');
                                    } else {
                                        var skuAttribute = skuAttributeGridCombo.getValue()[skuAttributeGridCombo.getSubmitValue()[0]];
                                        if (skuAttribute.attribute.options.length > 0) {//选项类型
                                            if (propertyName == 'Value' || propertyName == 'EnableOption' || propertyName == 'HiddenOption' || propertyName == 'OriginalValue' || propertyName == 'OriginalEnableOption' || propertyName == 'OriginalHiddenOption') {
                                                var optionsCombo = value.getComponent('options');
                                                optionsCombo.store.proxy.data = skuAttribute.attribute.options;
                                                optionsCombo.store.load();
                                                optionsCombo.setDisabled(false);
                                                optionsCombo.show();
                                                optionsCombo.isValid();
                                                optionsCombo.setFieldStyle('background-color: white');
                                                if (propertyName == 'EnableOption' || propertyName == 'HiddenOption' || propertyName == 'OriginalEnableOption' || propertyName == 'OriginalHiddenOption' || skuAttribute.attribute.selectType == 'MULTI' || newValue == 'In' || newValue == 'NotIn') {
                                                    optionsCombo.multiSelect = true;
                                                    optionsCombo.getPicker().getSelectionModel().allowDeselect = true;
                                                    optionsCombo.getPicker().getSelectionModel().setSelectionMode('SIMPLE');
                                                } else {
                                                    optionsCombo.multiSelect = false;
                                                    optionsCombo.getPicker().getSelectionModel().allowDeselect = false;
                                                    optionsCombo.getPicker().getSelectionModel().setSelectionMode('SINGLE');
                                                }
                                                if (optionsCombo.getPicker()) {//已经渲染
                                                    optionsCombo.getPicker().refresh();
                                                }
                                            }
                                        } else {//离散型数据
                                            if (skuAttribute.attribute.valueType == 'String') {
                                                var stringField = value.getComponent('string');
                                                stringField.setDisabled(false);
                                                stringField.show();
                                                stringField.setFieldStyle('background-color: white');
                                                stringField.isValid();
                                            } else if (skuAttribute.attribute.valueType == 'Number') {
                                                if (Ext.Array.contains(['(min,max)', '(min,max]', '[min,max)', '[min,max]'], newValue)) {
                                                    var minField = value.getComponent('min');
                                                    var maxField = value.getComponent('max');
                                                    minField.setDisabled(false);
                                                    minField.show();
                                                    minField.isValid();
                                                    minField.setFieldStyle('background-color: white');
                                                    maxField.setDisabled(false);
                                                    maxField.show();
                                                    maxField.isValid();
                                                    maxField.setFieldStyle('background-color: white');
                                                } else {
                                                    var numberField = value.getComponent('number');
                                                    numberField.setDisabled(false);
                                                    numberField.show();
                                                    numberField.isValid();
                                                    numberField.setFieldStyle('background-color: white');
                                                }
                                            } else if (skuAttribute.attribute.valueType == 'Boolean') {
                                                var booleanField = value.getComponent('boolean');
                                                booleanField.setDisabled(false);
                                                booleanField.show();
                                                booleanField.isValid();
                                                booleanField.setFieldStyle('background-color: white');
                                            }
                                        }
                                    }
                                } else {
                                    var stringField = value.getComponent('string');
                                    stringField.setDisabled(true);
                                    stringField.setFieldStyle('background-color: silver');
                                    stringField.show();
                                }
                                if (newValue == oldValue) {//说明是设置初始值触发的
                                    value.setValue(record.get('value'));
                                }
                            },
                            afterrender: function (combo) {
                                if (value) {
                                    combo.fireEvent('change', combo, value, value);
                                }
                            }
                        }
                    }
                }
            },
            {
                text: i18n.getKey('value'),
                sortable: false,
                flex: 1,
                menuDisabled: true,
                dataIndex: 'value',
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record, col, row, store, gridView) {
                    var grid = gridView.ownerCt;
                    return {
                        xtype: 'fieldcontainer',
                        id: col + '_' + row + '_' + grid.componentUUId,
                        layout: 'hbox',
                        defaults: {
                            allowBlank: false,
                            flex: 1
                        },
                        isValid: function () {
                            var container = this;
                            var valid = true;
                            for (var i = 0; i < container.items.items.length; i++) {
                                var item = container.items.items[i];
                                if (item.isValid() == false) {
                                    valid = false;
                                }
                            }
                            return valid;
                        },
                        getValue: function () {
                            var container = this;
                            var result = [];//如果长度大于1证明是区间操作符
                            for (var i = 0; i < container.items.items.length; i++) {
                                var item = container.items.items[i];
                                if (item.hidden == false) {
                                    result[item.getName()] = item.getValue();
                                }
                            }
                            return result;
                        },
                        setValue: function (value) {
                            var container = this;
                            if (Object.keys(value).length > 1) {
                                //区间操作符\
                                var min = container.getComponent('min');
                                var max = container.getComponent('max');
                                min.setValue(value.min);
                                max.setValue(value.max);
                            } else {
                                for (var i = 0; i < container.items.items.length; i++) {
                                    var item = container.items.items[i];
                                    if (item.hidden == false) {
                                        if (item.xtype == 'multicombobox') {//选项值
                                            item.setValue(value.input.split(','))
                                        } else {
                                            item.setValue(value.input)
                                        }
                                    }
                                }
                            }
                        },
                        items: [
                            {
                                xtype: 'numberfield',
                                itemId: 'number',
                                name: 'input',
                                disabled: true,
                                minValue: 0,
                                hidden: true
                            },
                            {
                                xtype: 'textfield',
                                fieldStyle: 'background-color: silver',
                                disabled: true,
                                itemId: 'string',
                                name: 'input',
                                hidden: false
                            },
                            {
                                xtype: 'combo',
                                displayField: 'display',
                                valueField: 'value',
                                disabled: true,
                                hidden: true,
                                editable: false,
                                name: 'input',
                                itemId: 'boolean',
                                store: Ext.create('Ext.data.Store', {
                                    fields: ['display', 'value'],
                                    data: [
                                        {
                                            display: 'true',
                                            value: 'true'
                                        }, {
                                            display: 'false',
                                            value: 'false'
                                        }
                                    ]
                                })
                            },
                            {
                                xtype: 'multicombobox',
                                displayField: 'name',
                                valueField: 'id',
                                disabled: true,
                                hidden: true,
                                editable: false,
                                name: 'options',
                                itemId: 'options',
                                multiSelect: true,
                                store: Ext.create('Ext.data.Store', {
                                    fields: [{
                                        name: 'id',
                                        type: 'string'
                                    },
                                        'name'],
                                    data: []
                                })
                            },
                            {
                                xtype: 'numberfield',
                                disabled: true,
                                hidden: true,
                                editable: true,
                                width: 100,
                                vtype: 'minAndMax',
                                labelWidth: 40,
                                minValue: 0,
                                name: 'min',
                                margin: '0 10 0 0',
                                fieldLabel: i18n.getKey('min'),
                                itemId: 'min'
                            },
                            {
                                xtype: 'numberfield',
                                disabled: true,
                                hidden: true,
                                editable: true,
                                width: 100,
                                vtype: 'minAndMax',
                                name: 'max',
                                minValue: 0,
                                labelWidth: 40,
                                fieldLabel: i18n.getKey('max'),
                                itemId: 'max'
                            }
                        ]
                    }
                }
            }
        ];
        me.callParent();
    },
    isValid: function () {
        var grid = this;
        var columns = grid.getView().getHeaderCt().columnManager.columns;
        var valid = true;
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            if (column.compIds) {//这是componentcolumn才会有的属性
                for (var j = 0; j < column.compIds.length; j++) {
                    var item = Ext.getCmp(column.compIds[j]);
                    if (item.isValid() == false) {
                        valid = false;
                    }
                }
            } else {
                continue;
            }
        }
        return valid;
    },
    getValue: function () {
        var me = this;
        var result = {
            clazz: 'com.qpp.cgp.domain.executecondition.InputCondition',
            type: 'nomal'
        };
        var logicalOperation = {
            operations: [],
            clazz: 'com.qpp.cgp.domain.executecondition.operation.LogicalOperation',
            operator: me.operator
        };
        if (me.store.getCount() == 0) {
            //没有写条件
            return null;
        } else {
            //有判断条件
            var columns = me.getView().getHeaderCt().columnManager.columns;
            var columnIndex = columns[1].compIds;//获取到profile列的compIds
            for (var i = 0; i < columnIndex.length; i++) {
                var record = {};
                for (var j = 1; j < 4; j++) {
                    var rowIndex = columnIndex[i].split('_')[0];//获取到组件的行号
                    var item = Ext.getCmp(rowIndex + '_' + j + '_' + me.componentUUId);
                    if (item.xtype == 'fieldcontainer') {
                        record['value'] = item.getValue();
                    } else {
                        record[item.getName()] = item.getValue();
                    }
                }
                var operation = {};
                operation.operationType = 'simple';
                if (Ext.Array.contains(['[min,max]', '[min,max)', '(min,max)', '(min,max]'], record.operator)) {//区间类型
                    operation.clazz = 'com.qpp.cgp.domain.executecondition.operation.BetweenOperation';
                    operation.operations = [
                        {
                            clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                            value: record.value.min.toString()
                        },
                        {
                            clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                            value: record.value.max.toString()
                        }
                    ];
                    operation.midValue = {
                        clazz: 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue',
                        skuAttributeId: Object.keys(record.skuAttribute)[0],
                        attributeId: record.skuAttribute[Object.keys(record.skuAttribute)[0]].attribute.id,
                        skuAttribute: record.skuAttribute[Object.keys(record.skuAttribute)[0]]
                    };
                } else {//比较类型
                    operation.clazz = 'com.qpp.cgp.domain.executecondition.operation.CompareOperation';
                    operation.operations = [
                        {
                            clazz: 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue',
                            skuAttributeId: Object.keys(record.skuAttribute)[0],
                            attributeId: record.skuAttribute[Object.keys(record.skuAttribute)[0]].attribute.id,
                            skuAttribute: record.skuAttribute[Object.keys(record.skuAttribute)[0]]
                        },
                        {
                            clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                            value: (record.value.input || record.value.options).toString()
                        }
                    ];
                }
                operation.operator = record.operator;
                logicalOperation.operations.push(operation);
            }
            result.operation = logicalOperation;
            return result;
        }
    },
    setValue: function (data) {
        var me = this;
        me.store.removeAll();
        if (Ext.Object.isEmpty(data)) {
            return;
        } else {
            //最外层为确定AND或者Or
            if (data.operation) {
                var toolBar = me.getDockedItems('toolbar[dock="top"]')[0];
                var typeRadioGroup = toolBar.getComponent('typeRadioGroup');
                typeRadioGroup.setValue({type: data.operation.operator});//设置是AND 或OR
                var createContainer = function (operations, contextAttributeStore, grid) {
                    for (var i = 0; i < operations.length; i++) {
                        var item = operations[i];
                        if (item.operationType == 'simple') {
                            var PropertyPathValue = null;
                            if (item.clazz == "com.qpp.cgp.domain.executecondition.operation.BetweenOperation") {
                                PropertyPathValue = item.midValue;
                            } else {
                                PropertyPathValue = item.operations[0];
                            }
                            var attributeId = Ext.Number.from(PropertyPathValue.attributeId, 0);
                            var skuAttributeRecord = null;
                            var operator = item.operator;
                            if (contextAttributeStore.findRecord('attributeId', attributeId)) {
                                skuAttributeRecord = contextAttributeStore.findRecord('attributeId', attributeId).getData();
                            }
                            var value = {
                                skuAttribute: skuAttributeRecord,
                                operator: operator,
                                value: {}
                            };
                            if (Ext.Array.contains(['[min,max]', '[min,max)', '(min,max)', '(min,max]'], operator)) {
                                value.value.min = item.operations[0].value;
                                value.value.max = item.operations[1].value;
                            } else {
                                value.value.input = item.operations[1].value;
                            }
                            grid.store.add(value);
                        }
                    }
                };
                createContainer(data.operation.operations, me.contextAttributeStore, me);
                // if (me.contextAttributeStore.data.items.length == 0) {//store未加载
                //     me.contextAttributeStore.on('load',
                //         function () {
                //             createContainer(data.operation.operations, me.contextAttributeStore, me);
                //         },
                //         this, {
                //             single: true
                //         });
                // } else {
                //     createContainer(data.operation.operations, me.contextAttributeStore, me);
                // }
                if (data.operation.operations.length > 1) {
                    //typeRadioGroup.show();
                    typeRadioGroup.setDisabled(false);
                }
            }
        }
    },
    setNextComp: function (comp, newValue) {
        if (comp && !Ext.Object.isEmpty(newValue)) {
            comp.setDisabled(false);
            comp.setFieldStyle('background-color: white');
            comp.addCls(comp.invalidCls)
        } else if (comp) {
            comp.setDisabled(true);
            comp.setFieldStyle('background-color: silver');
        }
    }
})

