/**
 * Created by nan on 2020/8/20.
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.condition.CustomConditionPanel', {
    extend: 'Ext.panel.Panel',
    bodyStyle: {
        borderColor: 'silver'
    },
    itemId: 'conditionPanel',
    layout: {
        type: 'accordion',
        titleCollapse: true,
        animate: true,
        multi: true,
        activeOnTop: false
    },
    productId: null,
    maxHeight: 350,
    header: false,
    autoScroll: true,
    checkOnly: false,//是否只查看
    items: [],
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'panel',
                title: '自定义执行条件',
                layout: 'fit',
                items: [
                    {
                        xtype: 'textarea',
                        allowBlank: false,
                        minHeight: 120,
                        maxHeight: 150,
                        readOnly: me.checkOnly,
                        emptyText: '格式如下: xx>0 && xx<2 类似的表达式'
                    }
                ]
            }
        ];
        me.callParent();
    },
    isValid: function () {
        var me = this;
        var textarea = me.items.items[0].items.items[0];
        if (me.hidden == false) {
            return textarea.isValid();
        } else {
            return true;
        }
    },
    getValue: function () {
        var me = this;
        var textarea = me.items.items[0].items.items[0];
        var result = {
            clazz: 'com.qpp.cgp.domain.executecondition.InputCondition',
            conditionType: 'custom',
            operation: null
        };
        var operation = {
            operations: [],
            clazz: 'com.qpp.cgp.domain.executecondition.operation.CustomExpressionOperation',
            expression: textarea.getValue()
        };
        result.operation = operation;
        return result;
    },
    setDisabled: function (disabled) {
        var me = this;
        me.callParent(arguments);
        var textarea = me.items.items[0].items.items[0];
        textarea.setDisabled(disabled);
    },
    setValue: function (data) {
        var me = this;
        var textarea = me.items.items[0].items.items[0];
        var expression = data.operation.expression;
        textarea.setValue(expression);
    }
})
