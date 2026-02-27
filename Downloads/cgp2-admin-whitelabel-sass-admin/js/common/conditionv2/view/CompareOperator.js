/**
 * @Description:
 * @author nan
 * @date 2022/10/9
 */
Ext.define("CGP.common.conditionv2.view.CompareOperator", {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.compareoperator',
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
    ],
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
    optionTypeOperator: [
        {
            display: 'In',
            value: 'In'
        }, {
            display: 'NotIn',
            value: 'NotIn'
        }],
    layout: {
        type: 'vbox',
        align: 'left'
    },
    defaults: {
        margin: '0 0 0 50',
        width: '100%'
    },
    constructor: function () {
        var me = this;
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.items =  [
            {
                xtype: 'radiogroup',
                columns: 3,
                itemId: 'clazz',
                name: 'clazz',
                hidden: false,
                disabled: false,
                fieldLabel: i18n.getKey('操作方式'),
                vertical: true,
                tipInfo: 'In/NotIn 如：属性值在[1,2,3,4]这些值里面',
                items: [
                    {boxLabel: '比较', name: 'clazz', inputValue: 'CompareOperation', checked: true,},
                    {boxLabel: '区间', name: 'clazz', inputValue: 'IntervalOperation'},
                    {boxLabel: 'In/NotIn', name: 'clazz', inputValue: 'RangeOperation'},
                ],
                mapping: {
                    CompareOperation: ['clazz', 'nullable',],
                    IntervalOperation: ['path'],
                    RangeOperation: ['attributeId'],
                },
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var container = combo.ownerCt;
                        var operator = container.getComponent('operator');
                        var clazz = newValue.clazz;
                        if (clazz == 'CompareOperation') {
                            operator.store.proxy.data = container.inputTypeOperator;
                            operator.store.load();
                            operator.setValue('==');
                        } else if (clazz == 'IntervalOperation') {
                            operator.store.proxy.data = container.rangeTypeOperator;
                            operator.store.load();
                            operator.setValue('[min,max]');
                        } else if (clazz == 'RangeOperation') {
                            operator.store.proxy.data = container.optionTypeOperator;
                            operator.store.load();
                            operator.setValue('In');
                        }
                    }
                },
                diyGetValue: function () {
                    var me = this;
                    return me.getValue().clazz;
                },
                diySetValue: function (data) {
                    var me = this;
                    me.setValue({
                        clazz: data
                    });
                }
            },
            {
                xtype: 'combo',
                hidden: false,
                disabled: false,
                itemId: 'operator',
                name: 'operator',
                valueField: 'value',
                displayField: 'display',
                editable: false,
                value: '==',
                fieldLabel: i18n.getKey('操作符'),
                store: {
                    xtype: 'store',
                    fields: [
                        'value', 'display'
                    ],
                    data: me.inputTypeOperator
                },
            },
        ];
        me.callParent(arguments);
        var radio = me.getComponent('clazz');
        //分发change事件
        me.relayEvents(radio, ['change']);
    }
})