/**
 * @Description:操作符的控件，值 -操作 -值，中的操作所对应的组件
 * @author nan
 * @date 2022/10/9
 */
Ext.define("CGP.common.conditionv2.view.CompareOperatorV2", {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.compare_operator_v2',
    itemId: 'operator',
    name: 'operator',
    valueField: 'value',
    displayField: 'display',
    editable: false,
    value: '==',
    fieldLabel: i18n.getKey('操作符'),
    //基础的操作
    inputTypeBaseOperator: [
        {
            value: '==',
            display: '='
        },
        {
            value: '!=',
            display: '!='
        },
    ],
    //数值类型的可选操作
    inputTypeNumOperator: [
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
    ],
    //数量范围操作
    rangeTypeOperator: [
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
    //选项类型特有操作
    optionTypeOperator: [
        {
            display: 'In',
            value: 'In'
        }, {
            display: 'NotIn',
            value: 'NotIn'
        }],
    constructor: function () {
        var me = this;
        me.callParent(arguments);
    },
    getClazz: function () {
        var me = this;
        var clazz = 'CompareOperation';
        var operator = me.getValue();
        if (operator) {
            me.optionTypeOperator.map(function (item) {
                if (item.value == operator) {
                    clazz = 'RangeOperation';
                }
            });
            me.rangeTypeOperator.map(function (item) {
                if (item.value == operator) {
                    clazz = 'IntervalOperation';
                }
            });
        }
        return clazz;
    },
    initComponent: function () {
        var me = this;
        me.store = {
            xtype: 'store',
            fields: [
                'value', 'display'
            ],
            data: me.inputTypeBaseOperator
        };
        me.callParent(arguments);
    },
    /**
     * 根据值类型和选择类型，决定该组件有哪些选项
     * @param selectType
     * @param valueType
     */
    setOption: function (selectType, valueType) {
        var me = this;
        //如果是选项类型
        if (selectType == 'SINGLE' || selectType == 'MULTI') {
            //in notin == !=
            var operator = [];
            operator = me.inputTypeBaseOperator.concat(me.optionTypeOperator);
            me.store.proxy.data = operator;
            me.store.load();

        } else if (selectType == 'NON') {
            //输入类型
            if (valueType == 'Number') {
                var operator = [];
                operator = me.inputTypeBaseOperator.concat(me.inputTypeNumOperator);
                operator = operator.concat(me.rangeTypeOperator);
                me.store.proxy.data = operator;
                me.store.load();
            } else {
                me.store.proxy.data = me.inputTypeBaseOperator;
                me.store.load();
            }
        }
    },
})