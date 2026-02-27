/**
 * Created by nan on 2020/3/27.
 * 对空值的处理，现在上下文中可以有的空值为null和[],只有如此两种
 * 保存fixValue时.value使用字符串保存，
 * 然后在和skuAttribute的上下文进行比较时，转成对应的格式，
 * 还要在转换程序中兼容就的数据，有了ValueType后的处理,
 * 仅== 和!=中可以允许填空值
 * 获取的数据的valueType以attribute中的ValueType为准
 * skuAttribute的值只有三种类型，array，string,boolean
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.condition.ConditionGrid", {
        extend: 'Ext.grid.Panel',
        alias: 'widget.conditiongrid',
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
        componentUUId: null,//一个独一无二的编号，用于加在grid中componentcolumn中渲染出的组件Id的后缀上，使创建多个该组件时不会发生组件id重复
        viewConfig: {
            markDirty: false//标识修改的字段
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
                        name: 'skuAttribute',
                        type: 'object'
                    },
                    {
                        name: 'operationType',
                        type: 'string',
                        defaultValue: 'simple'
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
                    text: i18n.getKey('product') + i18n.getKey('attribute'),
                    sortable: false,
                    menuDisabled: true,
                    width: 240,
                    dataIndex: 'skuAttribute',
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, col, row, store, gridView) {
                        var grid = gridView.ownerCt;
                        var store = Ext.data.StoreManager.get('skuAttributeStore');
                        console.log(col + '_' + row + '_' + grid.componentUUId)
                        return {
                            xtype: 'gridcombo',
                            id: col + '_' + row + '_' + grid.componentUUId,
                            editable: false,
                            displayField: 'displayName',
                            valueField: 'id',
                            allowBlank: false,
                            name: 'skuAttribute',
                            store: store,
                            value: value,
                            pickerAlign: 'bl',
                            queryMode: 'local',
                            matchFieldWidth: true,
                            gridCfg: {
                                store: store,
                                height: 200,
                                columns: [
                                    {
                                        dataIndex: 'displayName',
                                        flex: 1,
                                        tdCls: 'vertical-middle',
                                        text: i18n.getKey('attributeName'),
                                        renderer: function (value, mateData, record) {
                                            return value + '(' + record.getId() + ')';
                                        }
                                    }
                                ]
                            },
                            getDisplayValue: function () {
                                var me = this,
                                    dv = [];
                                Ext.Object.each(me.value, function (k, v) {
                                    var displayField = v[me.displayField];
                                    var id = v['id'];
                                    if (!Ext.isEmpty(displayField)) {
                                        var str = displayField + '(' + id + ')';
                                        dv.push(str);
                                    }
                                });
                                return dv.join(',');
                            },
                            listeners: {
                                change: function (gridCombo, newValue, oldValue) {
                                    try {
                                        var operator = Ext.getCmp(col + '_' + (row + 1) + '_' + grid.componentUUId);
                                        var propertyName = 'Value';
                                        var skuAttributeGridCombo = gridCombo;
                                        if (!Ext.Object.isEmpty(propertyName)) {
                                            operator.setDisabled(false);
                                            operator.setFieldStyle('background-color: white');
                                        } else {
                                            operator.setDisabled(true);
                                            operator.setFieldStyle('background-color: silver');
                                        }
                                        if (propertyName) {
                                            var skuAttribute = skuAttributeGridCombo.getValue()[skuAttributeGridCombo.getSubmitValue()[0]];
                                            if (skuAttribute.attribute.options.length > 0) {
                                                //选项类型
                                                operator.store.proxy.data = grid.optionTypeOperator;
                                            } else {
                                                //输入类型
                                                if (propertyName == 'Value' && skuAttribute.attribute.valueType == 'Number') {//且输入值为number类型
                                                    operator.store.proxy.data = grid.inputTypeOperator;
                                                } else if (propertyName == 'Value' && skuAttribute.attribute.valueType == 'String') {//输入类型为string类型
                                                    operator.store.proxy.data = [
                                                        {
                                                            value: '==',
                                                            display: '='
                                                        },
                                                        {
                                                            value: '!=',
                                                            display: '!='
                                                        }
                                                    ];
                                                } else {//boolean类型的值
                                                    operator.store.proxy.data = [
                                                        {
                                                            value: '==',
                                                            display: '='
                                                        }
                                                    ];
                                                }
                                            }
                                            operator.store.load();
                                        }
                                        if (newValue == oldValue) {//说明是设置初始值触发的
                                            operator.setValue(record.get('operator'));
                                        } else {
                                            operator.setValue();
                                        }
                                    } catch (e) {
                                        console.log(e)
                                    }
                                },
                                afterrender: function (gridcombo) {
                                    if (!Ext.isEmpty(value)) {
                                        var data = {};
                                        data[value.id] = value;
                                        gridcombo.setValue(value);
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
                        console.log(col + '_' + row + '_' + grid.componentUUId)
                        return {
                            xtype: 'combo',
                            id: col + '_' + row + '_' + grid.componentUUId,
                            name: 'operator',
                            fieldStyle: value ? 'background-color: white' : 'background-color: silver',
                            disabled: value ? false : true,
                            store: Ext.create('Ext.data.Store', {
                                fields: ['display', 'value'],
                                data: []
                            }),
                            value: value,
                            valueField: 'value',
                            editable: false,
                            displayField: 'display',
                            allowBlank: false,
                            listeners: {
                                change: function (combo, newValue, oldValue) {
                                    var value = Ext.getCmp(col + '_' + (row + 1) + '_' + grid.componentUUId);
                                    var skuAttributeGridCombo = Ext.getCmp(col + '_' + (row - 1) + '_' + grid.componentUUId);
                                    var propertyName = 'Value';
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
                                        var skuAttribute = skuAttributeGridCombo.getValue()[skuAttributeGridCombo.getSubmitValue()[0]];
                                        if (skuAttribute.attribute.options.length > 0) {//选项类型
                                            if (propertyName == 'Value') {
                                                var optionsCombo = value.getComponent('options');
                                                optionsCombo.store.proxy.data = skuAttribute.attribute.options;
                                                optionsCombo.store.load();
                                                optionsCombo.setDisabled(false);
                                                optionsCombo.show();
                                                optionsCombo.allowBlank = !skuAttribute.required;
                                                optionsCombo.isValid();
                                                optionsCombo.setFieldStyle('background-color: white');
                                                if (skuAttribute.attribute.selectType == 'MULTI' || newValue == 'In' || newValue == 'NotIn') {
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
                                                stringField.allowBlank = !skuAttribute.required;
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
                                                    numberField.allowBlank = !skuAttribute.required;
                                                    numberField.setDisabled(false);
                                                    numberField.show();
                                                    numberField.isValid();
                                                    numberField.setFieldStyle('background-color: white');
                                                }
                                            } else if (skuAttribute.attribute.valueType == 'Boolean') {
                                                var booleanField = value.getComponent('boolean');
                                                booleanField.setDisabled(false);
                                                booleanField.allowBlank = !skuAttribute.required;
                                                booleanField.show();
                                                booleanField.isValid();
                                                booleanField.setFieldStyle('background-color: white');
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
                                    if (!Ext.isEmpty(value)) {
                                        combo.fireEvent('change', combo, value, value);
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    text: i18n.getKey('product') + i18n.getKey('attribute') + i18n.getKey('value'),
                    sortable: false,
                    flex: 1,
                    menuDisabled: true,
                    dataIndex: 'value',
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, col, row, store, gridView) {
                        var grid = gridView.ownerCt;
                        console.log(col + '_' + row + '_' + grid.componentUUId);
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
                                    haveReset: true,
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
                                    haveReset: true,
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
                conditionType: 'simple'
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
                    for (var j = 1; j < columns.length; j++) {
                        var rowIndex = columnIndex[i].split('_')[0];//获取到组件的行号
                        var item = Ext.getCmp(rowIndex + '_' + j + '_' + me.componentUUId);
                        if (item.xtype == 'fieldcontainer') {
                            record['value'] = item.getValue();
                        } else {
                            record[item.getName()] = item.getValue();
                        }
                    }
                    var operation = {};
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
                            clazz: 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue',
                            skuAttributeId: Object.keys(record.skuAttribute)[0],
                            skuAttribute: record.skuAttribute[Object.keys(record.skuAttribute)[0]],
                            attributeId: record.skuAttribute[Object.keys(record.skuAttribute)[0]].attribute.id
                        };
                    } else {//比较类型
                        operation.clazz = 'com.qpp.cgp.domain.executecondition.operation.CompareOperation';
                        var fixValueData = (Ext.isEmpty(record.value.input) ? record.value.options : record.value.input);
                        if (!Ext.isEmpty(fixValueData)) {
                            fixValueData = fixValueData.toString();
                        } else {
                            fixValueData = '';
                        }
                        var valueType = record.skuAttribute[Object.keys(record.skuAttribute)[0]].attribute.valueType;
                        //当比较操作符为in和notIn时，值类型必须为Array
                        if (record.operator == 'In' || record.operator == 'NotIn') {
                            valueType = 'Array';
                        } else if (record.skuAttribute[Object.keys(record.skuAttribute)[0]].attribute.selectType == 'MULTI') {
                            valueType = 'Array';
                        } else if (valueType == 'Number') {
                            valueType = 'Number';
                        } else {
                            //其他的boolean,date,YearMonth,string
                            valueType = 'String'
                        }
                        operation.operations = [
                            {
                                clazz: 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue',
                                skuAttributeId: Object.keys(record.skuAttribute)[0],
                                skuAttribute: record.skuAttribute[Object.keys(record.skuAttribute)[0]],
                                attributeId: record.skuAttribute[Object.keys(record.skuAttribute)[0]].attribute.id
                            },
                            {
                                clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                                valueType: valueType,
                                value: fixValueData
                            }
                        ];
                    }
                    operation.operator = record.operator;
                    operation.operationType = 'simple';
                    logicalOperation.operations.push(operation);
                }
                result.operation = logicalOperation;
                return result;
            }
        },
        setValue: function (data) {
            var me = this;
            var skuAttributeStore = Ext.data.StoreManager.get('skuAttributeStore');
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
                        for (var i = 0; i < operations.length; i++) {
                            var item = operations[i];
                            if (item.operationType == 'simple') {
                                var productAttributeValue = null;
                                if (item.clazz == "com.qpp.cgp.domain.executecondition.operation.BetweenOperation") {
                                    productAttributeValue = item.midValue;
                                } else {
                                    productAttributeValue = item.operations[0];
                                }
                                var skuAttributeId = productAttributeValue.skuAttributeId;
                                var skuAttributeRecord = null;
                                var operator = item.operator;
                                for (var j = 0; j < productAttributeStore.data.length; j++) {
                                    //找出对应的属性
                                    if (skuAttributeId == productAttributeStore.data.items[j].getId()) {
                                        skuAttributeRecord = productAttributeStore.data.items[j];
                                    }
                                }
                                if (Ext.isEmpty(skuAttributeRecord)) {
                                    throw '有sku属性被删了';
                                }
                                var value = {
                                    skuAttribute: skuAttributeRecord.getData(),
                                    operator: operator,
                                    value: {}
                                };
                                if (Ext.Array.contains(['[min,max]', '[min,max)', '(min,max)', '(min,max]'], operator)) {
                                    value.value.min = item.operations[0].value;
                                    value.value.max = item.operations[1].value;
                                } else {
                                    value.value.input = item.operations[1].value;
                                }
                                console.log(value);
                                grid.store.add(value);
                            }
                        }
                    };
                    if (skuAttributeStore?.data?.items?.length == 0) {//store未加载
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
        }
    }
)


