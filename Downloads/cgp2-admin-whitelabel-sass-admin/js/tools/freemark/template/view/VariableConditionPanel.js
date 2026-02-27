Ext.define('CGP.tools.freemark.template.view.VariableConditionPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.variablecondition',
    layout: 'vbox',
    productId: null,
    maxHeight: 350,
    requires: [
        'CGP.common.model.ProductAttributeModel'
    ],
    autoScroll: true,
    conditionType: 'simple',//simple,complex
    operator: 'AND',//
    productProfileStore: null,
    checkOnly: false,//是否只能查看
    productAttributeStore: null,
    hideConditionModel: false,//隐藏条件执行模式
    componentUUId: null,//一个独一无二的编号，用于加在grid中componentcolumn中渲染出的组件Id的后缀上，使创建多个该组件时不会发生组件id重复

    viewConfig: {
        markDirty: false//标识修改的字段
    },
    inputTypeOperator: [
        {
            value: '==',
            display: '='
        },
        {
            value: '!=',
            display: '!='
        }
    ],
    initComponent: function () {
        var me = this;
        me.componentUUId = JSGetUUID();
        var templateModuleStore = Ext.data.StoreManager.get('templateModuleStore');
        //var varData=[];
        var variableStore=Ext.data.StoreManager.get('defaultVariateStore');
        templateModuleStore.each(function (rec){
            var item=rec.data;
            if(!variableStore.proxy.data.includes(item.varKeys[0])){ //store没有对应变量，添加到store中
                variableStore.proxy.data=variableStore.proxy.data.concat(item.varKeys);
                // if(item.groups&&item.groups.length==1&&(Ext.isEmpty(item.groups[0].condition)||item.groups[0].condition=={})){
                //     variableStore.proxy.data=variableStore.proxy.data.concat(item.varKeys);
                // }
            }
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
                        if(variableStore.getCount()<1){
                            Ext.Msg.alert(i18n.getKey('info'),i18n.getKey('没有可用自定变量'));
                        }
                        var grid = btn.ownerCt.ownerCt;
                        grid.store.add({});
                    }
                }
            ]
        };
        me.store = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'name',
                    type: 'string'
                },
                {
                    name:'variable',
                    type: 'object'
                },
                'operator',
                {
                    name: 'value',
                    type: 'object'
                }
            ]
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
                text: i18n.getKey('name'),
                sortable: false,
                menuDisabled: true,
                width: 120,
                dataIndex: 'name',
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record, col, row, store, gridView) {
                    var grid = gridView.ownerCt;
                    var variabledata={
                        name:value,
                        valueType:record.get('valueType')
                    }
                    return {
                        xtype: 'gridcombo',
                        id: col + '_' + row + '_' + grid.componentUUId,
                        editable: false,
                        //fieldStyle: value ? 'background-color: white' : 'background-color: silver',
                        //disabled: value ? false : true,
                        displayField: 'name',
                        valueField: 'name',
                        allowBlank: false,
                        value: variabledata,
                        name: 'variable',
                        store: variableStore,
                        pickerAlign: 'bl',
                        matchFieldWidth: false,
                        gridCfg: {
                            store: variableStore,
                            height: 200,
                            width: 200,
                            columns: [
                                {
                                    dataIndex: 'name',
                                    flex: 1,
                                    tdCls: 'vertical-middle',
                                    text: i18n.getKey('attributeName')
                                }
                            ]
                        },
                        listeners: {
                            change: function (gridCombo, newValue, oldValue) {
                                if (!Ext.isEmpty(newValue) && !Ext.isEmpty(oldValue) && newValue != oldValue) {//区分初始化和选中同一个
                                    if (Object.keys(newValue)[0] == Object.keys(oldValue)[0]) {
                                        return;
                                    }
                                }
                                var operator = Ext.getCmp(col + '_' + (row + 1) + '_' + grid.componentUUId);
                                if (!Ext.Object.isEmpty(newValue)) {
                                    operator.setDisabled(false);
                                    operator.setFieldStyle('background-color: white');
                                    operator.addCls(operator.invalidCls)
                                } else {
                                    operator.setDisabled(true);
                                    operator.setFieldStyle('background-color: silver');
                                }
                                if (!Ext.Object.isEmpty(newValue)) {
                                    operator.store.proxy.data = grid.inputTypeOperator;
                                    operator.store.load();
                                }
                                if (newValue == oldValue) {//说明是设置初始值触发的
                                    operator.setValue(record.get('operator'));
                                } else {
                                    operator.setValue();
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
                            data: []
                        }),
                        valueField: 'value',
                        editable: false,
                        displayField: 'display',
                        value:value,
                        allowBlank: false,
                        mapping: {
                            booleanValueProperty: ['Enable', 'Hidden', 'Required', 'OriginEnable', 'OriginHidden', 'OriginRequire', 'ReadOnly'],
                            optionValueProperty: ['Value', 'EnableOption', 'HiddenOption', 'OriginValue', 'OriginEnableOption', 'OriginHiddenOption'],
                        },
                        listeners: {
                            change: function (combo, newValue, oldValue) {
                                var value = Ext.getCmp(col + '_' + (row + 1) + '_' + grid.componentUUId);
                                var skuAttributeGridCombo = Ext.getCmp(col + '_' + (row - 1) + '_' + grid.componentUUId);
                                var propertyName ='Value';
                                for (var i = 0; i < value.items.items.length; i++) {
                                    //先把所有子组件隐藏，再根据选择确定显示哪个组件
                                    var item = value.items.items[i];
                                    if (item.hidden == false) {
                                        item.hide();
                                        item.reset();
                                        item.setDisabled(true);
                                        item.setFieldStyle('background-color: silver');
                                    }
                                }
                                if (newValue) {//修改
                                    //boolean类型的属性
                                    if (Ext.Array.contains(combo.mapping['booleanValueProperty'], propertyName)) {
                                        var booleanField = value.getComponent('boolean');
                                        booleanField.setDisabled(false);
                                        booleanField.show();
                                        booleanField.setFieldStyle('background-color: white');
                                    } else {
                                        var stringField = value.getComponent('string');
                                        stringField.setDisabled(false);
                                        stringField.show();
                                        stringField.allowBlank = false;
                                        stringField.setFieldStyle('background-color: white');
                                        stringField.isValid();
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
                                haveReset: true,
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
        var valid = true;
        var columns = grid.getView().getHeaderCt().columnManager.columns;
        if(Ext.isEmpty(columns)){
            return valid;
        }
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
            conditionType: 'varible'
        };//conditionType用于标识条件类型
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
                            value: record.value.min.toString()
                        },
                        {
                            clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                            value: record.value.max.toString()
                        }
                    ];
                    operation.midValue = {
                        clazz: 'com.qpp.cgp.domain.executecondition.operation.value.PropertyPathValue',
                        propertyName: record.propertyName,
                        attributeProfile: {
                            clazz: 'com.qpp.cgp.domain.attributeconfig.AttributeProfile',
                            _id: record.profile
                        },
                        skuAttributeId: Object.keys(record.skuAttribute)[0],
                        skuAttribute: record.skuAttribute[Object.keys(record.skuAttribute)[0]]
                    };
                }
                else {//比较类型
                    operation.clazz = 'com.qpp.cgp.domain.executecondition.operation.CompareOperation';
                    var valueData = Ext.isEmpty(record.value.input) ? record.value.options : record.value.input;
                    if (Ext.isEmpty(valueData)) {
                        valueData = '';
                    }
                    operation.operations = [
                        {
                            clazz: 'com.qpp.cgp.domain.executecondition.operation.value.VariableValue',
                            name: Object.keys(record.variable)[0],
                            valueType:record.variable[Object.keys(record.variable)[0]].valueType
                        },
                        {
                            clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                            value: valueData.toString()
                        }
                    ];
                }
                operation.operator = record.operator;
                operation['operationType'] = 'varible';
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
                JSGetCommonKey()
                // var toolBar = me.getDockedItems('toolbar[dock="top"]')[0];
                // var typeRadioGroup = toolBar.getComponent('typeRadioGroup');
                // typeRadioGroup.setValue({type: data.operation.operator});//设置是AND 或OR
                var createContainer = function (operations, grid) {
                    for (var i = 0; i < operations.length; i++) {
                        var item = operations[i];
                        if (item.operationType == 'varible') {

                            var operator = item.operator;
                            var value = {
                                name: item.operations[0].name,
                                variable:item.operations[0].variable,
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
                createContainer(data.operation.operations, me);
                if (data.operation.operations.length > 1 && me.hideConditionModel == false) {
                    typeRadioGroup.show();
                    typeRadioGroup.setDisabled(false);
                }
            }
        }
    }
})

