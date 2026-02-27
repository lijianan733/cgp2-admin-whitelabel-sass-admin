/**
 * @Description:简单条件的grid组件
 * 该组件用的是store.data里面的数据，不可以使用store.load加载proxy里面的数据
 * @author nan
 * @date 2022/10/14
 */
Ext.Loader.syncRequire([
    'CGP.common.conditionv2.view.CompareOperatorV2'
])
Ext.define("CGP.common.conditionv2.view.ConditionGrid", {
    extend: 'Ext.grid.Panel',
    alias: 'widget.conditiongrid_v2',
    autoScroll: true,
    border: '50',
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
    operationType: 'simple',//自定义条件类型,仅作为分类标识,无实际意义
    operator: 'AND',//'AND /OR
    valueAllowBlank: false,//值字段是否允許為空值
    componentUUId: null,//一个独一无二的编号，用于加在grid中componentcolumn中渲染出的组件Id的后缀上，使创建多个该组件时不会发生组件id重复
    viewConfig: {
        markDirty: false//标识修改的字段
    },
    contextStore: null,//上下文store
    leftValue: null,
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
                    defaultValue: me.operationType
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
                width: 35,
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
                width: 240,
                dataIndex: 'contentAttribute',
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record, row, col, store, gridView) {
                    var grid = gridView.ownerCt;
                    var store = me.contextStore;
                    var internalId = record.internalId;
                    var itemId = internalId + '_col(' + col + ')_' + grid.componentUUId;
                    var item = grid.query('[itemId=' + itemId + ']')[0];
                    if (item) {
                        return item;
                    } else {
                        return {
                            xtype: 'attribute_grid_combo',
                            itemId: itemId,
                            name: 'contentAttribute',
                            store: store,
                            value: value,
                            queryMode: 'local',
                            listeners: {
                                change: function (gridCombo, newValue, oldValue) {
                                    try {
                                        var operatorId = internalId + '_col(' + (col + 1) + ')_' + grid.componentUUId;
                                        var operator = grid.query('[itemId=' + operatorId + ']')[0];
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
                                            var contentAttributeData = skuAttributeGridCombo.getValue()[skuAttributeGridCombo.getSubmitValue()[0]];
                                            if (contentAttributeData?.attrOptions.length > 0) {
                                                //选项类型
                                                operator.store.proxy.data = grid.optionTypeOperator;
                                            } else {
                                                //输入类型
                                                if (propertyName == 'Value' && contentAttributeData.valueType == 'Number') {//且输入值为number类型
                                                    operator.store.proxy.data = grid.inputTypeOperator;
                                                } else if (propertyName == 'Value' && contentAttributeData.valueType == 'String') {//输入类型为string类型
                                                    operator.store.proxy.data = [{
                                                        value: '==',
                                                        display: '='
                                                    }, {
                                                        value: '!=',
                                                        display: '!='
                                                    }];
                                                } else {//boolean类型的值
                                                    operator.store.proxy.data = [{
                                                        value: '==',
                                                        display: '='
                                                    }];
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
                                    if (value) {
                                        var data = {};
                                        data[value.id] = value;
                                        gridcombo.setValue(value);
                                        gridcombo.fireEvent('change', gridcombo, data, data);
                                    }
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
                renderer: function (value, metadata, record, row, col, store, gridView) {
                    var grid = gridView.ownerCt;
                    var internalId = record.internalId;
                    var itemId = internalId + '_col(' + col + ')_' + grid.componentUUId;
                    var item = grid.query('[itemId=' + itemId + ']')[0];
                    if (item) {
                        return item;
                    } else {
                        return {
                            xtype: 'compare_operator_v2',
                            name: 'operator',
                            itemId: itemId,
                            fieldLabel: null,
                            fieldStyle: value ? 'background-color: white' : 'background-color: silver',
                            disabled: value ? false : true,
                            value: value,
                            valueField: 'value',
                            editable: false,
                            displayField: 'display',
                            allowBlank: false,
                            listeners: {
                                change: function (combo, newValue, oldValue) {
                                    var skuAttributeGridComboId = internalId + '_col(' + (col - 1) + ')_' + grid.componentUUId;
                                    var skuAttributeGridCombo = grid.query('[itemId=' + skuAttributeGridComboId + ']')[0];
                                    var ValueId = internalId + '_col(' + (col + 1) + ')_' + grid.componentUUId;
                                    var value = grid.query('[itemId=' + ValueId + ']')[0];

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
                                        var contentAttributeData = skuAttributeGridCombo.getValue()[skuAttributeGridCombo.getSubmitValue()[0]];
                                        if (contentAttributeData.attrOptions?.length > 0) {//选项类型
                                            if (propertyName == 'Value') {
                                                var optionsCombo = value.getComponent('options');
                                                optionsCombo.store.proxy.data = contentAttributeData.attrOptions;
                                                optionsCombo.store.load();
                                                optionsCombo.setDisabled(false);
                                                optionsCombo.show();
                                                /*
                                                                                                optionsCombo.allowBlank = !contentAttributeData.required;
                                                */
                                                optionsCombo.isValid();
                                                optionsCombo.setFieldStyle('background-color: white');
                                                if (contentAttributeData.selectType == 'MULTI' || newValue == 'In' || newValue == 'NotIn') {
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
                                            if (contentAttributeData.valueType == 'String') {
                                                var stringField = value.getComponent('string');
                                                stringField.setDisabled(false);
                                                stringField.show();
                                                /*
                                                                                                stringField.allowBlank = !contentAttributeData.required;
                                                */
                                                stringField.setFieldStyle('background-color: white');
                                                stringField.isValid();
                                            } else if (contentAttributeData.valueType == 'Number') {
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
                                                    /*
                                                                                                        numberField.allowBlank = !contentAttributeData.required;
                                                    */
                                                    numberField.setDisabled(false);
                                                    numberField.show();
                                                    numberField.isValid();
                                                    numberField.setFieldStyle('background-color: white');
                                                }
                                            } else if (contentAttributeData.valueType == 'Boolean') {
                                                var booleanField = value.getComponent('boolean');
                                                booleanField.setDisabled(false);
                                                /*
                                                                                                booleanField.allowBlank = !contentAttributeData.required;
                                                */
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
                                allowBlank: grid.valueAllowBlank,
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
                                            item.setValue(value.input);
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
                                            'name', 'value'],
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
                            name: me.componentUUId + '_type',
                            readOnly: me.checkOnly,
                            inputValue: 'AND',
                            checked: true
                        },
                        {
                            boxLabel: '满足以下任一条件',
                            name: me.componentUUId + '_type',
                            readOnly: me.checkOnly,
                            inputValue: 'OR'
                        }
                    ],
                    listeners: {
                        change: function (field, newValue, oldValue) {
                            var panel = field.ownerCt.ownerCt;
                            panel.operator = newValue[panel.componentUUId + '_type'];
                        }
                    }
                }
            ]
        };
        me.callParent();
    },
    /**
     *轉換獲取到的數據
     * @returns {null}
     */
    diyGetValue: function () {
        var me = this;
        if (me.store.getCount() == 0) {
            //没有写条件
            return null;
        } else {
            //有判断条件
            var count = me.getStore().getCount();//行数
            var columns = me.getView().getHeaderCt().columnManager.columns;//列数
            var conditions = [];
            for (var i = 0; i < count; i++) {
                var data = {};
                var internalId = me.store.getAt(i).internalId;
                for (var j = 1; j < columns.length; j++) {
                    var item = me.query('[itemId*=' + internalId + '_col(' + j + ')_' + me.componentUUId + ']')[0];
                    if (item.xtype == 'fieldcontainer') {
                        data['value'] = item.getValue();
                    } else {
                        data[item.getName()] = item.getValue();
                    }
                }
                var attrInfo = data.contentAttribute[Object.keys(data.contentAttribute)[0]];
                if (Ext.Array.contains(['[min,max]', '[min,max)', '(min,max)', '(min,max]'], data.operator)) {//区间类型
                    conditions.push({
                        clazz: 'IntervalOperation',
                        source: {
                            clazz: 'ProductAttributeValue',
                            attributeId: attrInfo.key
                        },
                        operator: data.operator,
                        min: {
                            clazz: 'ConstantValue',
                            valueType: attrInfo?.valueType || 'String',
                            value: data.value.min
                        },
                        max: {
                            clazz: 'ConstantValue',
                            valueType: attrInfo?.valueType || 'String',
                            value: data.value.max
                        }
                    });
                } else if (Ext.Array.contains(['In', 'NotIn'], data.operator)) {
                    conditions.push({
                        clazz: 'RangeOperation',
                        source: {
                            clazz: 'ProductAttributeValue',
                            attributeId: attrInfo.key
                        },
                        value: {
                            clazz: 'ConstantValue',
                            valueType: 'Array',
                            value: data.value.options
                        },
                        operator: data.operator
                    });
                } else if (Ext.Array.contains(['==', '!=', '<=', '<', '>=', '>'], data.operator)) {
                    //如果是多选类型的数据，其值类型必定位array
                    conditions.push({
                        clazz: 'CompareOperation',
                        source: {
                            clazz: 'ProductAttributeValue',
                            attributeId: attrInfo.key
                        },
                        value: {
                            clazz: 'ConstantValue',
                            valueType: attrInfo.selectType == 'MULTI' ? 'Array' : (attrInfo?.valueType || 'String'),
                            value: attrInfo.selectType != 'NON' ? data.value.options : data.value.input,
                        },
                        operator: data.operator
                    });
                }
            }
            var result = {
                clazz: 'LogicalOperation',
                operator: me.operator,
                expressions: conditions
            };
            return result;
        }
    },
    diySetValue: function (data) {
        var me = this;
        var skuAttributeStore = me.contextStore;
        me.store.removeAll();
        if (Ext.Object.isEmpty(data)) {
            return;
        } else {
            //只能适配AND/OR的条件
            if (data.clazz == 'LogicalOperation') {
                var toolBar = me.getDockedItems('toolbar[dock="top"]')[0];
                var typeRadioGroup = toolBar.getComponent('typeRadioGroup');
                typeRadioGroup.setValue({[me.componentUUId + '_type']: data.operator});//设置是AND 或OR
                var createContainer = function (expressions, productAttributeStore, grid) {
                    var storeData = [];
                    for (var i = 0; i < expressions.length; i++) {
                        var item = expressions[i];
                        var contextAttribute = null;
                        var source = item.source;
                        var key = '';
                        if (source.clazz == 'ProductAttributeValue') {
                            key = source.attributeId
                        } else {
                            //todo 其他类型暂时不可能用到
                        }
                        var contentAttributeRecord = null;
                        var operator = item.operator;
                        for (var j = 0; j < productAttributeStore.data.length; j++) {
                            //找出对应的属性
                            if (key == productAttributeStore.data.items[j].get('key')) {
                                contentAttributeRecord = productAttributeStore.data.items[j];
                            }
                        }
                        if (Ext.isEmpty(contentAttributeRecord)) {
                            console.error('缺失属性——' + key);
                            continue;
                        }
                        var value = {
                            contentAttribute: contentAttributeRecord.getData(),
                            operator: operator,
                            value: {}
                        };
                        if (item.clazz == 'IntervalOperation') {
                            value.value.min = item.min.value;
                            value.value.max = item.max.value;
                        } else if (item.clazz == 'RangeOperation') {
                            value.value.input = item.value.value;
                        } else if (item.clazz == 'CompareOperation') {
                            value.value.input = item.value.value;
                        }
                        storeData.push(value);
                    }
                    grid.store.add(storeData);
                };
                if (skuAttributeStore.data.items.length == 0) {//store未加载
                    skuAttributeStore.on('load',
                        function () {
                            createContainer(data.expressions, skuAttributeStore, me);
                        },
                        this, {
                            single: true
                        })
                } else {
                    createContainer(data.expressions, skuAttributeStore, me);
                }
                if (data.expressions.length > 1 && me.hideConditionModel == false) {
                    typeRadioGroup.show();
                    typeRadioGroup.setDisabled(false);
                }
            }
        }
    },
})
