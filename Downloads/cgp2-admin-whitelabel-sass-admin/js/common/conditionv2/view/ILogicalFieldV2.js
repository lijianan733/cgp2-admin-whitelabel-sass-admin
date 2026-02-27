/**
 * @Description:值-操作-值该结构对应的组件,值特化为attribute
 * @author nan
 * @date 2022/9/26
 */
Ext.Loader.syncRequire([
    'CGP.common.conditionv2.view.ValueFieldV2',
    'CGP.common.conditionv2.view.CompareOperatorV2',
    'CGP.common.conditionv2.view.AttributeGridCombo'
])
Ext.define("CGP.common.conditionv2.view.ILogicalFieldV2", {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.ilogicalfieldv2',
    contextStore: null,
    layout: {
        type: 'vbox',
        align: 'center',
        pack: 'center'
    },
    defaults: {
        width: '100%',//只能指定宽度，自适应有问题
        allowBlank: false,
        margin: '10 0 5 0',
        flex: 1,
    },
    diyGetValue: function () {
        var me = this;
        var data = me.getValue();
        var operator = me.getComponent('operator');
        data.clazz = operator.getClazz();
        return data;
    },
    diySetValue: function (data) {
        var me = this;
        console.log(data);
        var newData = Ext.clone(data);
        me.setValue(newData);
    },
    constructor: function () {
        var me = this;
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'attribute_grid_combo',
                fieldLabel: i18n.getKey('输入数据'),
                name: 'source',
                itemId: 'source',
                allowBlank: false,
                store: me.contextStore,
                maxHeight: 24,
                listeners: {
                    //改变了选择，就可以确定值类型和那些操作可选
                    change: function (gridCombo, newValue, oldValue) {
                        //单选，多选，输入  string number boolean
                        if (newValue && !Ext.Object.isEmpty(newValue)) {
                            var attribute = gridCombo.getArrayValue();
                            var valueType = attribute.valueType;
                            var selectType = attribute.selectType;
                            var option = attribute.attrOptions || [];
                            var operator = gridCombo.ownerCt.getComponent('operator');
                            var min = gridCombo.ownerCt.getComponent('min');
                            var max = gridCombo.ownerCt.getComponent('max');
                            var value = gridCombo.ownerCt.getComponent('value');
                            var arr = [value, min, max];
                            //影响可选操作符
                            operator.setOption(selectType, valueType);

                            //影响设置值类型，输入方式
                            arr.map(function (item) {
                                item.setOptionData(option, selectType, valueType);
                            });
                            //清空选项 清空值
                            operator.setValue('==');
                            arr.map(function (item) {
                                item.setValue({
                                    clazz: 'ConstantValue',
                                    value: null,
                                });
                            });
                        }
                    }
                }
            },
            {
                xtype: 'compare_operator_v2',
                itemId: 'operator',
                name: 'operator',
                maxHeight: 24,
                fieldLabel: i18n.getKey('操作'),
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        //影响值
                        var clazz = combo.getClazz();
                        var fieldset = combo.ownerCt;
                        var source = fieldset.getComponent('source');
                        var value = fieldset.getComponent('value');
                        var min = fieldset.getComponent('min');
                        var max = fieldset.getComponent('max');
                        var arr = [value, min, max];
                        var attribute = source.getArrayValue();
                        var valueType = attribute?.valueType || 'String';
                        var selectType = attribute?.selectType || 'NON';
                        var option = attribute?.attrOptions || [];
                        if (clazz == 'CompareOperation') {
                            arr.map(function (item) {
                                item.setVisible(item.itemId == 'value');
                                item.setDisabled(!(item.itemId == 'value'));
                                arr.map(function (item) {
                                    item.setOptionData(option, selectType, valueType);
                                });
                            });
                        } else if (clazz == 'IntervalOperation') {
                            arr.map(function (item) {
                                item.setVisible(item.itemId == 'min' || item.itemId == 'max');
                                item.setDisabled((!(item.itemId == 'min')) && (!(item.itemId == 'max')));
                            });
                        } else if (clazz == 'RangeOperation') {
                            arr.map(function (item) {
                                item.setVisible(item.itemId == 'value');
                                item.setDisabled(!(item.itemId == 'value'));
                            });
                            value.setOptionData(option, 'MULTI', valueType);
                            value.setValue({
                                clazz: 'ConstantValue',
                                valueType: 'Array',
                            });
                        }
                    }
                }
            },
            {
                xtype: 'valuefieldv2',
                itemId: 'value',
                name: 'value',
                contextStore: me.contextStore,
                fieldLabel: i18n.getKey('值'),
                initBaseConfig: {
                    clazzReadOnly: false,//是否只能为固定数据类型
                    defaultClass: 'ConstantValue',//ConstantValue,ProductAttributeValue,ContextPathValue,CalculationValue，
                    defaultValueType: 'String',
                    valueTypeReadOnly: true,
                }
            },
            {
                xtype: 'valuefieldv2',
                itemId: 'min',
                name: 'min',
                hidden: true,
                disabled: true,
                contextStore: me.contextStore,
                fieldLabel: i18n.getKey('最小值'),
                initBaseConfig: {
                    clazzReadOnly: false,
                    defaultClass: 'ConstantValue',//ConstantValue,ProductAttributeValue,ContextPathValue,CalculationValue，
                    defaultValueType: 'String',
                    valueTypeReadOnly: true,
                }
            },
            {
                xtype: 'valuefieldv2',
                itemId: 'max',
                name: 'max',
                hidden: true,
                disabled: true,
                contextStore: me.contextStore,
                fieldLabel: i18n.getKey('最大值'),
                initBaseConfig: {
                    clazzReadOnly: false,
                    defaultClass: 'ConstantValue',//ConstantValue,ProductAttributeValue,ContextPathValue,CalculationValue，
                    defaultValueType: 'String',
                    valueTypeReadOnly: true,
                }
            }
        ];
        me.callParent(arguments);
    }
})

