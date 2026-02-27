/**
 * Created by admin on 2020/8/21.
 */
Ext.define("CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.view.KeysValueCondition", {
    extend: "Ext.form.Panel",
    requires : [
        'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.condition.ConditionFieldSet'],
    bodyPadding: '10',
    autoScroll: true,
    region: 'center',
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 120,
        msgTarget: 'side',
        validateOnChange: false
    },
    leftAttributes:null,
    //data: null,
    initComponent: function () {
        var me = this;
        var productId=parseInt(JSGetQueryString('productId'));
        var keysValue=Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.view.KeysValue',{
            data:me.data.inputs,
            name: 'inputs',
            itemId: 'inputsValue',
            width: '100%'
        });
        me.items=[
            {
                xtype: 'textfield',
                name: 'description',
                fieldLabel: i18n.getKey('description'),
                width: 380,
                allowBlank: false
            },
            Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.condition.AttributeMappingRuleConditionFieldSet', {
                title: i18n.getKey('执行规则的前提条件'),
                itemId: 'attributeMappingRuleFieldSet',
                name:'condition',
                productId: productId,
                margin: '10 0',
                leftAttributes: me.leftAttributes
            }),

            keysValue
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
            item.setValue(data[item.name])
        })
    },
    getValue: function () {
        var me = this,data={};
        var items = me.items.items;

        Ext.Array.each(items, function (item) {
            data[item.name]=item.getValue();
        });
        return data;
    }
});
