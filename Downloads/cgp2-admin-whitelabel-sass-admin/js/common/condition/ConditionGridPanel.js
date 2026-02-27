/**
 * Created by miao on 2021/01/18.
 * 现在允许skuAttribute的值为空
 */
Ext.define('CGP.common.condition.ConditionGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.conditiongridpanel',
    require: ['Ext.form.field.GridComboBox'],
    layout: 'vbox',
    productId: null,
    maxHeight: 350,
    requires: [
        'CGP.product.view.managerskuattribute.model.SkuAttribute'
    ],
    autoScroll: true,
    conditionType: 'simple',//simple,complex
    operator: 'AND',//
    productProfileStore: null,
    checkOnly: false,//是否只能查看
    productAttributeStore: null,
    hideConditionModel: false,//隐藏条件执行模式
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
            value: 'OriginValue',
            display: 'OriginValue'
        },
        {
            value: 'OriginEnable',
            display: 'OriginEnable'
        },
        {
            value: 'OriginHidden',
            display: 'OriginHidden'
        },
        {
            value: 'OriginRequire',
            display: 'OriginRequire'
        }
    ],
    optionTypeProperty: [//离散输入型的可用操作符
        {
            value: 'EnableOption',
            display: 'EnableOption'
        },
        {
            value: 'HiddenOption',
            display: 'HiddenOption'
        },
        {
            value: 'OriginEnableOption',
            display: 'OriginEnableOption'
        },
        {
            value: 'OriginHiddenOption',
            display: 'OriginHiddenOption'
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
        // {
        //     display: '[min,max]',
        //     value: '[min,max]'
        // },
        // {
        //     display: '[min,max)',
        //     value: '[min,max)'
        // },
        // {
        //     display: '(min,max)',
        //     value: '(min,max)'
        // },
        // {
        //     display: '(min,max]',
        //     value: '(min,max]'
        // }

    ],
    optionTypeOperator: [
        {
            value: '==',
            display: '='
        },
        {
            value: '!=',
            display: '!='
        },
        // {
        //     display: 'In',
        //     value: 'In'
        // },
        // {
        //     display: 'NotIn',
        //     value: 'NotIn'
        // }
    ],
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
                    hidden: me.hideConditionModel,
                    itemId: 'typeRadioGroup',
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
        me.productAttributeStore = Ext.data.StoreManager.get('skuAttribute') || Ext.create('CGP.common.store.ProductAttributeStore', {
            storeId: 'skuAttribute',
            productId: me.productId
        });
        // me.productProfileStore = Ext.data.StoreManager.get('profileStore');
        me.store = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'attributeProfile',
                    type: 'string'
                },
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
                    name: 'propertyName',
                    type: 'string',
                    defaultValue: 'Value'
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
            // {
            //     text: i18n.getKey('profile'),
            //     sortable: false,
            //     menuDisabled: true,
            //     dataIndex: 'attributeProfile',
            //     width: 120,
            //     xtype: 'componentcolumn',
            //     renderer: function (value, metadata, record, col, row, store, gridView) {
            //         var grid = gridView.ownerCt;
            //         return {
            //             xtype: 'combo',
            //             store: me.productProfileStore,
            //             valueField: '_id',
            //             id: col + '_' + row + '_' + grid.componentUUId,
            //             editable: false,
            //             name: 'profile',
            //             value: value,
            //             queryMode: 'local',
            //             displayField: 'name',
            //             allowBlank: false,
            //             listeners: {
            //                 change: function (combo, newValue, oldValue) {
            //                     var skuAttributeCombo = Ext.getCmp(col + '_' + (row + 1) + '_' + grid.componentUUId);
            //                     var skuAttributes = [];
            //                     var profileData = this.store.findRecord('_id', this.getValue()) ? this.store.findRecord('_id', this.getValue()).getData() : null;
            //                     for (var i = 0; i < profileData.groups.length; i++) {
            //                         skuAttributes = skuAttributes.concat(profileData.groups[i].attributes);
            //                     }
            //                     skuAttributeCombo.setDisabled(false);
            //                     skuAttributeCombo.setFieldStyle('background-color: white');
            //                     skuAttributeCombo.store.proxy.data = skuAttributes;
            //                     skuAttributeCombo.store.load();
            //                     if (newValue == oldValue) {
            //
            //                     } else {
            //                         skuAttributeCombo.setValue();
            //                     }
            //                 },
            //                 afterrender: function (combo) {
            //                     if (value) {
            //                         combo.fireEvent('change', combo, value, value);
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // },
            {
                text: i18n.getKey('skuAttribute'),
                sortable: false,
                menuDisabled: true,
                width: 120,
                dataIndex: 'skuAttribute',
                xtype: 'componentcolumn',
                renderer: function (value, metadata, record, col, row, store, gridView) {
                    var grid = gridView.ownerCt;
                    // var store = Ext.create('Ext.data.Store', {
                    //     proxy: {
                    //         type: 'memory'
                    //     },
                    //     model: 'CGP.product.view.managerskuattribute.model.SkuAttribute',
                    //     data: []
                    // });
                    return {
                        xtype: 'gridcombo',
                        id: col + '_' + row + '_' + grid.componentUUId,
                        editable: false,
                        fieldStyle: value ? 'background-color: white' : 'background-color: silver',
                        //disabled: value ? false : true,
                        displayField: 'attributeName',
                        valueField: 'attributeId',
                        allowBlank: false,
                        value: value,
                        name: 'skuAttribute',
                        store: me.productAttributeStore,
                        pickerAlign: 'bl',
                        matchFieldWidth: false,
                        gridCfg: {
                            store: me.productAttributeStore,
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
                                    var skuAttribute = newValue[Object.keys(newValue)[0]];
                                    if (Ext.isEmpty(skuAttribute)) {
                                        return false;
                                    }
                                    if (skuAttribute.attribute.options.length > 0) {
                                        //选项类型
                                        operator.store.proxy.data = grid.optionTypeOperator;
                                    } else {
                                        //输入类型
                                        operator.store.proxy.data = grid.inputTypeOperator;
                                    }
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
            // {
            //     name: 'propertyName',
            //     sortable: false,
            //     width: 170,
            //     menuDisabled: true,
            //     dataIndex: 'propertyName',
            //     xtype: 'componentcolumn',
            //     text: i18n.getKey('property'),
            //     hidden: true,
            //     renderer: function (value, metadata, record, col, row, store, gridView) {
            //         var grid = gridView.ownerCt;
            //         return {
            //             xtype: 'combo',
            //             fieldStyle: value ? 'background-color: white' : 'background-color: silver',
            //             disabled: value ? false : true,
            //             name: 'propertyName',
            //             value: 'Value',
            //             id: col + '_' + row + '_' + grid.componentUUId,
            //             store: Ext.create('Ext.data.Store', {
            //                 fields: ['display', 'value'],
            //                 data: grid.optionTypeProperty.concat(grid.inputTypeProperty)
            //             }),
            //             valueField: 'value',
            //             editable: false,
            //             displayField: 'display',
            //             allowBlank: false,
            //             listeners: {
            //                 change: function (combo, newValue, oldValue) {
            //                     var operator = Ext.getCmp(col + '_' + (row + 1) + '_' + grid.componentUUId);
            //                     var skuAttributeGridCombo = Ext.getCmp(col + '_' + (row - 1) + '_' + grid.componentUUId);
            //                     if (!Ext.Object.isEmpty(newValue)) {
            //                         operator.setDisabled(false);
            //                         operator.setFieldStyle('background-color: white');
            //                     } else {
            //                         operator.setDisabled(true);
            //                         operator.setFieldStyle('background-color: silver');
            //                     }
            //                     if (newValue) {
            //                         var skuAttribute = skuAttributeGridCombo.getValue()[skuAttributeGridCombo.getSubmitValue()[0]];
            //                         if (skuAttribute.attribute.options.length > 0) {
            //                             //选项类型
            //                             if (newValue == 'Value' || newValue == 'OriginValue') {
            //                                 operator.store.proxy.data = grid.optionTypeOperator;
            //                             } else if (newValue == 'OriginEnableOption' || newValue == 'EnableOption' || newValue == 'OriginHiddenOption' || newValue == 'HiddenOption') {
            //                                 operator.store.proxy.data = [
            //                                     {
            //                                         value: '==',
            //                                         display: '='
            //                                     },
            //                                     {
            //                                         value: '!=',
            //                                         display: '!='
            //                                     }
            //                                 ];
            //
            //                             } else {//boolean类型的值
            //                                 operator.store.proxy.data = [
            //                                     {
            //                                         value: '==',
            //                                         display: '='
            //                                     }
            //                                 ];
            //                             }
            //                         } else {
            //                             //输入类型
            //                             if (newValue == 'Value' && skuAttribute.attribute.valueType == 'Number') {//且输入值为number类型
            //                                 operator.store.proxy.data = grid.inputTypeOperator;
            //                             } else if (newValue == 'Value' && skuAttribute.attribute.valueType == 'String') {//输入类型为string类型
            //                                 operator.store.proxy.data = [
            //                                     {
            //                                         value: '==',
            //                                         display: '='
            //                                     },
            //                                     {
            //                                         value: '!=',
            //                                         display: '!='
            //                                     }
            //                                 ];
            //                             } else {//boolean类型的值
            //                                 operator.store.proxy.data = [
            //                                     {
            //                                         value: '==',
            //                                         display: '='
            //                                     }
            //                                 ];
            //                             }
            //                         }
            //                         operator.store.load();
            //                     }
            //                     if (newValue == oldValue) {//说明是设置初始值触发的
            //                         operator.setValue(record.get('operator'));
            //                     } else {
            //                         operator.setValue();
            //                     }
            //                 },
            //                 afterrender: function (combo) {
            //                     if (value) {
            //                         combo.fireEvent('change', combo, value, value);
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // },
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
                        allowBlank: false,
                        mapping: {
                            booleanValueProperty: ['Enable', 'Hidden', 'Required', 'OriginEnable', 'OriginHidden', 'OriginRequire', 'ReadOnly'],
                            optionValueProperty: ['Value', 'EnableOption', 'HiddenOption', 'OriginValue', 'OriginEnableOption', 'OriginHiddenOption'],
                        },
                        listeners: {
                            change: function (combo, newValue, oldValue) {
                                var value = Ext.getCmp(col + '_' + (row + 1) + '_' + grid.componentUUId);
                                // var propertyCombo = Ext.getCmp(col + '_' + (row - 1) + '_' + grid.componentUUId);
                                var skuAttributeGridCombo = Ext.getCmp(col + '_' + (row - 1) + '_' + grid.componentUUId);
                                var propertyName = 'Value';
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
                                        var skuAttribute = skuAttributeGridCombo.getValue()[skuAttributeGridCombo.getSubmitValue()[0]];
                                        if (Ext.isEmpty(skuAttribute))
                                            return false;
                                        if (skuAttribute.attribute.options.length > 0) {//选项类型
                                            //这是选项类型可以使用的property
                                            var isRequire = skuAttribute.required;//这个属性的值是否为必填
                                            if (Ext.Array.contains(combo.mapping['optionValueProperty'], propertyName)) {
                                                var optionsCombo = value.getComponent('options');
                                                optionsCombo.store.proxy.data = skuAttribute.attribute.options;
                                                optionsCombo.store.load();
                                                optionsCombo.setDisabled(false);
                                                optionsCombo.show();
                                                optionsCombo.allowBlank = !isRequire;
                                                optionsCombo.isValid();
                                                optionsCombo.setFieldStyle('background-color: white');
                                                //选择值是多选的
                                                if (propertyName == 'EnableOption' || propertyName == 'HiddenOption' || propertyName == 'OriginEnableOption' || propertyName == 'OriginHiddenOption' ||
                                                    skuAttribute.attribute.selectType == 'MULTI' ||
                                                    newValue == 'In' || newValue == 'NotIn') {
                                                    optionsCombo.multiSelect = true;
                                                } else {
                                                    //选项值是单选的
                                                    optionsCombo.multiSelect = false;
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
                                                stringField.allowBlank = !isRequire;
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
                                                    numberField.allowBlank = !isRequire;
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
            conditionType: 'simple'
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
                } else {//比较类型
                    operation.clazz = 'com.qpp.cgp.domain.executecondition.operation.CompareOperation';
                    var valueData = Ext.isEmpty(record.value.input) ? record.value.options : record.value.input;
                    if (Ext.isEmpty(valueData)) {
                        valueData = '';
                    }
                    operation.operations = [
                        {
                            clazz: 'com.qpp.cgp.domain.executecondition.operation.value.PropertyPathValue',
                            propertyName: record.propertyName,
                            attributeProfile: {//_id 用于存放skuAttribute.options length
                                clazz: 'com.qpp.cgp.domain.attributeconfig.AttributeProfile',
                                _id: Ext.isEmpty(record.skuAttribute[Object.keys(record.skuAttribute)[0]].options) ? 0 : record.skuAttribute[Object.keys(record.skuAttribute)[0]].options.length
                            },
                            skuAttributeId: Object.keys(record.skuAttribute)[0],
                            skuAttribute: record.skuAttribute[Object.keys(record.skuAttribute)[0]]

                        },
                        {
                            clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                            value: valueData.toString()
                        }
                    ];
                }
                operation.operator = record.operator;
                operation['operationType'] = 'simple';
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
                var toolBar = me.getDockedItems('toolbar[dock="top"]')[0];
                var typeRadioGroup = toolBar.getComponent('typeRadioGroup');
                typeRadioGroup.setValue({type: data.operation.operator});//设置是AND 或OR
                var createContainer = function (operations, productAttributeStore, grid) {
                    for (var i = 0; i < operations.length; i++) {
                        var item = operations[i];
                        if (item.operationType == 'simple') {
                            var PropertyPathValue = null;
                            if (item.clazz == "com.qpp.cgp.domain.executecondition.operation.BetweenOperation") {
                                PropertyPathValue = item.midValue;
                            } else {
                                PropertyPathValue = item.operations[0];
                            }
                            var skuAttributeId = PropertyPathValue.skuAttributeId;
                            var skuAttributeRecord = null;
                            var operator = item.operator;
                            for (var j = 0; j < productAttributeStore.data.length; j++) {
                                //找出对应的属性
                                if (skuAttributeId == productAttributeStore.data.items[j].get('attributeId')) {
                                    skuAttributeRecord = productAttributeStore.data.items[j].data;
                                }
                            }
                            var value = {
                                propertyName: PropertyPathValue.propertyName,
                                attributeProfile: PropertyPathValue.attributeProfile._id,
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
                if (me.productAttributeStore.data.items.length == 0) {//store未加载
                    me.productAttributeStore.on('load',
                        function () {
                            createContainer(data.operation.operations, me.productAttributeStore, me);
                        },
                        this, {
                            single: true
                        })
                } else {
                    createContainer(data.operation.operations, me.productAttributeStore, me);
                }
                if (data.operation.operations.length > 1 && me.hideConditionModel == false) {
                    typeRadioGroup.show();
                    typeRadioGroup.setDisabled(false);
                }
            }
        }
    }
})

