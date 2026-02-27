/**
 * Created by nan on 2020/3/27.
 * 简单的表达式生成组件,使用该组件时,上文中必须有qty属性，不然会报错
 */
Ext.define("CGP.common.condition.view.ConditionQtyGrid", {
    extend: 'Ext.grid.Panel',
    alias: 'widget.conditionqtygrid',
    autoScroll: true,
    border: '50',
    maxHeight: 350,
    checkOnly: false,//只查看
    hideConditionModel: false,//隐藏执行模式
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
    conditionType: 'simple',//simple,complex
    operator: 'AND',//
    componentUUId: null,//一个独一无二的编号,用于加在grid中componentcolumn中渲染出的组件Id的后缀上，使创建多个该组件时不会发生组件id重复
    viewConfig: {
        markDirty: false//标识修改的字段
    },
    contentAttributeStore: null,//上下文store
    isValid: function () {
        var grid = this;
        var valid = true;
        //模糊查找出指定itemId的组件列表
        var components = grid.query('[itemId*=' + grid.componentUUId + ']');
        for (var i = 0; i < components.length; i++) {
            var component = components[i];
            if (component.isValid() == false) {
                valid = false;
            }
        }
        return valid;
    },
    initComponent: function () {
        var me = this;
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
        me.componentUUId = JSGetUUID();
        me.store = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'contentAttribute',
                    type: 'object'
                },
                {
                    name: 'operationType',
                    type: 'string',
                    defaultValue: 'qty'
                },
                {
                    name: 'operator',
                    type: 'string'
                }, {
                    name: 'value',
                    type: 'object'
                }
            ],
            data: []
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
                text: i18n.getKey('属性'),
                sortable: false,
                menuDisabled: true,
                width: 100,
                dataIndex: 'contentAttribute',
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record, row, col, store, gridView) {
                    return 'QTY'
                }
            },
            {
                text: i18n.getKey('operator'),
                sortable: false,
                menuDisabled: true,
                width: 150,
                dataIndex: 'operator',
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record, row, col, store, gridView) {
                    var grid = gridView.ownerCt;
                    var internalId = record.internalId;
                    var itemId = internalId + '_col(' + col + ')_' + grid.componentUUId;
                    var item = grid.query('[itemId=' + itemId + ']')[0];
                    if (item) {
                        return item;
                    } else {
                        return {
                            xtype: 'combo',
                            name: 'operator',
                            itemId: itemId,
                            store: {
                                xtype: 'store',
                                fields: ['display', 'value'],
                                data: grid.inputTypeOperator
                            },
                            value: value,
                            valueField: 'value',
                            editable: false,
                            displayField: 'display',
                            allowBlank: false,
                            listeners: {
                                change: function (combo, newValue, oldValue) {
                                    var ValueId = internalId + '_col(' + (col + 1) + ')_' + grid.componentUUId;
                                    var value = grid.query('[itemId=' + ValueId + ']')[0];
                                    //先把所有子组件隐藏，再根据选择确定显示哪个组件
                                    for (var i = 0; i < value.items.items.length; i++) {
                                        var item = value.items.items[i];
                                        if (item.hidden == false) {
                                            item.hide();
                                            item.reset();
                                            item.setDisabled(true);
                                            item.setFieldStyle('background-color: silver');
                                        }
                                    }
                                    if (newValue) {//修改
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
                                            numberField.allowBlank = false;
                                            numberField.setDisabled(false);
                                            numberField.show();
                                            numberField.isValid();
                                            numberField.setFieldStyle('background-color: white');
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
                }
            },
            {
                text: i18n.getKey('value'),
                sortable: false,
                flex: 1,
                menuDisabled: true,
                dataIndex: 'value',
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record, row, col, store, gridView) {
                    var grid = gridView.ownerCt;
                    var internalId = record.internalId;
                    var itemId = internalId + '_col(' + col + ')_' + grid.componentUUId;
                    var item = grid.query('[itemId=' + itemId + ']')[0];
                    if (item) {
                        return item;
                    } else {
                        return {
                            xtype: 'fieldcontainer',
                            itemId: itemId,
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
                                    haveReset: true,
                                    store: {
                                        xtype: 'store',
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
                                    }
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
                                    haveReset: true,
                                    store: {
                                        xtype: 'store',
                                        fields: [
                                            {
                                                name: 'id',
                                                type: 'string'
                                            },
                                            'name'],
                                        data: []
                                    }
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
            },
        ];
        me.tbar = {
            layout: {
                type: 'table',
                columns: 3,
            },
            border: 1,
            items: [
                {
                    xtype: 'button',
                    iconCls: 'icon_add',
                    colspan: 1,
                    width: 100,
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
                    width: 400,
                    colspan: 2,
                    hidden: me.hideConditionModel,//隐藏条件执行模式
                    itemId: 'typeRadioGroup',
                    items: [
                        {
                            boxLabel: '满足以下所有条件',
                            name: 'type',
                            readOnly: me.checkOnly,
                            inputValue: 'AND',
                            checked: true
                        },
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
        me.callParent();
    },
    getValue: function () {
        var me = this;
        var result = {
            clazz: 'com.qpp.cgp.domain.executecondition.InputCondition',
            type: 'qty'
        };
        var logicalOperation = {
            operations: [],
            clazz: 'com.qpp.cgp.domain.executecondition.operation.LogicalOperation',
            operator: me.operator,
            conditionType: 'qty'
        };
        if (me.store.getCount() == 0) {
            //没有写条件
            return null;
        } else {
            //有判断条件
            var count = me.getStore().getCount();//行数
            var columns = me.getView().getHeaderCt().columnManager.columns;//列数
            for (var i = 0; i < count; i++) {
                var record = {};
                var internalId = me.store.getAt(i).internalId;
                for (var j = 1; j < columns.length; j++) {
                    var item = me.query('[itemId*=' + internalId + '_col(' + j + ')_' + me.componentUUId + ']')[0];
                    if (item) {
                        if (item.xtype == 'fieldcontainer') {
                            record['value'] = item.getValue();
                        } else {
                            record[item.getName()] = item.getValue();
                        }
                    }
                }
                var qtyInfo = me.contentAttributeStore.findRecord('key', 'qty').getData();
                record.contentAttribute = {}
                record.contentAttribute[qtyInfo.key] = qtyInfo
                var operation = {};
                var attrInfo = qtyInfo;
                if (Ext.Array.contains(['[min,max]', '[min,max)', '(min,max)', '(min,max]'], record.operator)) {//区间类型
                    operation.clazz = 'com.qpp.cgp.domain.executecondition.operation.BetweenOperation';
                    operation.operations = [
                        {
                            clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                            valueType: 'Number',
                            value: record.value.min.toString()
                        },
                        {
                            clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                            valueType: 'Number',
                            value: record.value.max.toString()
                        }
                    ];
                    operation.midValue = {
                        clazz: 'com.qpp.cgp.domain.executecondition.operation.value.VariableValue',
                        name: attrInfo.key,
                        valueType: attrInfo.valueType.toUpperCase(),
                    };
                } else {//比较类型
                    operation.clazz = 'com.qpp.cgp.domain.executecondition.operation.CompareOperation';
                    var fixValueData = (Ext.isEmpty(record.value.input) ? record.value.options : record.value.input);
                    if (!Ext.isEmpty(fixValueData)) {
                        fixValueData = fixValueData.toString();
                    } else {
                        fixValueData = '';
                    }
                    var valueType = attrInfo.valueType;//当比较操作符为in和notIn时，值类型必须为Array
                    if (record.operator == 'In' || record.operator == 'NotIn') {
                        valueType = 'Array';
                    } else if (attrInfo.selectType == 'MULTI') {
                        valueType = 'Array';
                    } else if (valueType == 'Number') {
                        valueType = 'Number';
                    } else {
                        //其他的boolean,date,YearMonth,string
                        valueType = 'String'
                    }
                    operation.operations = [
                        {
                            clazz: 'com.qpp.cgp.domain.executecondition.operation.value.VariableValue',
                            name: attrInfo.key,
                            valueType: (attrInfo.valueType).toUpperCase(),
                        },
                        {
                            clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                            valueType: valueType,
                            value: fixValueData
                        }
                    ];
                }
                operation.operator = record.operator;
                operation.operationType = 'qty';
                logicalOperation.operations.push(operation);
            }
            result.operation = logicalOperation;
            return result;
        }
    },
    setValue: function (data) {
        var me = this;
        var skuAttributeStore = me.contentAttributeStore;
        me.store.removeAll();
        if (Ext.Object.isEmpty(data)) {
            return;
        } else {
            //最外层为确定AND或者Or
            if (data.operation) {
                var toolBar = me.getDockedItems('toolbar[dock="top"]')[0];
                var typeRadioGroup = toolBar.getComponent('typeRadioGroup');
                typeRadioGroup.setValue({type: data.operation.operator});//设置是AND 或OR
                var createContainer = function (operations, productAttributeStore, grid) {
                    var storeData = [];
                    for (var i = 0; i < operations.length; i++) {
                        var item = operations[i];
                        //只把simple类型的条件加入到简单条件组件里面
                        if (item.operationType == 'qty') {
                            var productAttributeValue = null;
                            if (item.clazz == "com.qpp.cgp.domain.executecondition.operation.BetweenOperation") {
                                productAttributeValue = item.midValue;
                            } else {
                                productAttributeValue = item.operations[0];
                            }
                            var key = productAttributeValue.name;
                            var contentAttributeRecord = null;
                            var operator = item.operator;
                            for (var j = 0; j < productAttributeStore.data.length; j++) {
                                //找出对应的属性
                                if (key == productAttributeStore.data.items[j].get('key')) {
                                    contentAttributeRecord = productAttributeStore.data.items[j];
                                }
                            }
                            if (Ext.isEmpty(contentAttributeRecord)) {
                                continue;
                            }
                            var value = {
                                contentAttribute: contentAttributeRecord.getData(),
                                operator: operator,
                                value: {}
                            };
                            if (Ext.Array.contains(['[min,max]', '[min,max)', '(min,max)', '(min,max]'], operator)) {
                                value.value.min = item.operations[0].value;
                                value.value.max = item.operations[1].value;
                            } else {
                                value.value.input = item.operations[1].value;
                            }
                            storeData.push(value);
                        }
                    }
                    grid.store.add(storeData);
                };
                if (skuAttributeStore.data.items.length == 0) {//store未加载
                    skuAttributeStore.on('load',
                        function () {
                            createContainer(data.operation.operations, skuAttributeStore, me);
                        },
                        this, {
                            single: true
                        })
                } else {
                    createContainer(data.operation.operations, skuAttributeStore, me);
                }
                if (data.operation.operations.length > 1 && me.hideConditionModel == false) {
                    typeRadioGroup.show();
                    typeRadioGroup.setDisabled(false);
                }
            }
        }
    },
})


