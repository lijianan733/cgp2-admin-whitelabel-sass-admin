/**
 * Created by admin on 2020/8/22.
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.view.ConditionCheck', {
    extend: "Ext.window.Window",
    requires: [],
    bodyPadding: '10',
    autoScroll: true,
    region: 'center',
    leftAttributes: null,
    data: null,
    initComponent: function () {
        var me = this;
        var productId = parseInt(JSGetQueryString('productId'));

        me.items = [
//            Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.condition.AttributeMappingRuleConditionFieldSet', {
//                title: i18n.getKey('执行规则的前提条件'),
//                itemId: 'conditionCheckComp',
//                name: 'condition',
//                productId: productId,
//                margin: '10 0',
//                leftAttributes: me.leftAttributes
//            })
            {
                xtype: 'form',
                itemId:'conditionCheckForm',
                border:0,
                items: [
                    Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.condition.AttributeMappingRuleConditionFieldSet', {
                        title: i18n.getKey('执行规则的前提条件'),
                        itemId: 'conditionCheckComp',
                        name: 'condition',
                        productId: productId,
                        margin: '10 0',
                        leftAttributes: me.leftAttributes
                    })
                ],
                setValue: function (data) {
                    var me = this;
                    var items = me.items.items;
                    Ext.Array.each(items, function (item) {
                        item.setValue(data[item.name])
                    })
                }
            }
        ];

        me.callParent(arguments);
    },
    listeners: {
        afterrender: function (comp) {
            if (!Ext.isEmpty(comp.data)) {
                comp.setValue(comp.data);
            }
        }
    },

    isValid: function () {
        var me = this;
        var isValid = true;
        me.items.items.forEach(function (item) {
            if (item.rendered) {
                if (item.isValid() == false) {
                    isValid = false;
                }
            }
        });
        return isValid;
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            item.setValue(data)
        })
    },
    getValue: function () {
        var me = this, data = {};
        var items = me.items.items;

        Ext.Array.each(items, function (item) {
            data[item.name] = item.getValue();
        });
        return data;
    }
});
