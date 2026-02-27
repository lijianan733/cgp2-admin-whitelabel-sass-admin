/**
 * @Description:
 * @author nan
 * @date 2022/9/26
 */
Ext.Loader.syncRequire([
    'CGP.common.conditionv2.view.ValueField',
    'CGP.common.conditionv2.view.CompareOperator'
])
Ext.define("CGP.common.conditionv2.view.ILogicalField", {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.ilogicalfield',
    contextStore: null,
    productId: null,
    defaults: {
        width: '100%',
        allowBlank: false,
        margin: '10 0 5 0'
    },
    layout: {
        type: 'vbox'
    },
    diyGetValue: function () {
        var me = this;
        var data = me.getValue();
        var result = data.operator;
        delete data.operator;
        result = Ext.Object.merge(result, data);
        return result;
    },
    diySetValue: function (data) {
        var me = this;
        console.log(data);
        var newData = Ext.clone(data);
        newData.operator = {
            operator: newData.operator,
            clazz: newData.clazz
        };
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            item.diySetValue ? item.diySetValue(newData[item.getName()]) : item.setValue(newData[item.getName()]);
        }
    },
    constructor: function () {
        var me = this;
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'valuefield',
                name: 'source',
                itemId: 'source',
                productId: me.productId,
                contextStore: me.contextStore,
                fieldLabel: i18n.getKey('输入源')
            },
            {
                xtype: 'compareoperator',
                itemId: 'operator',
                name: 'operator',
                fieldLabel: i18n.getKey('操作'),
                listeners: {
                    change: function (combo, newValue, oldValue) {
                       
                        var clazz = newValue.clazz;
                        var compareOperator = combo.ownerCt;
                        var value = compareOperator.ownerCt.getComponent('value');
                        var min = compareOperator.ownerCt.getComponent('min');
                        var max = compareOperator.ownerCt.getComponent('max');
                        /*
                                                var arrayValue = compareOperator.ownerCt.getComponent('arrayValue');
                        */
                        var arr = [value, min, max/*, arrayValue*/];
                        if (clazz == 'CompareOperation') {
                            arr.map(function (item) {
                                item.setVisible(item.itemId == 'value');
                                item.setDisabled(!(item.itemId == 'value'));
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
                            value.setValue({
                                clazz: 'ConstantValue',
                                valueType: 'Array',
                            });
                        }
                    }
                }
            },
            {
                xtype: 'valuefield',
                productId: me.productId,
                itemId: 'value',
                name: 'value',
                contextStore: me.contextStore,
                fieldLabel: i18n.getKey('值')
            },
            {
                xtype: 'valuefield',
                itemId: 'min',
                name: 'min',
                hidden: true,
                disabled: true,
                productId: me.productId,
                contextStore: me.contextStore,
                fieldLabel: i18n.getKey('最小值')
            },
            {
                xtype: 'valuefield',
                itemId: 'max',
                name: 'max',
                hidden: true,
                disabled: true,
                productId: me.productId,
                contextStore: me.contextStore,
                fieldLabel: i18n.getKey('最大值')
            }/*,
            {
                xtype: 'arraydatafield',
                itemId: 'arrayValue',
                name: 'value',
                hidden: true,
                disabled: true,
                labelWidth: 50,
                fieldLabel: i18n.getKey('值'),
                diyGetValue: function () {
                    var me = this;
                    var data = me.getValue();
                    return {
                        clazz: 'ConstantValue',
                        valueType: 'Number',
                        nullable: false,
                        value: data
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    //符合数组格式
                    if (data.clazz == 'ConstantValue' && data.valueType == 'Number') {
                        me.setValue(data.value);
                    }
                }
            },*/
        ];
        me.callParent(arguments);
    }
})