/**
 * Created by admin on 2020/8/21.
 */
Ext.define("CGP.tools.freemark.template.view.KeysValueCondition", {
    extend: "Ext.form.Panel",
    requires: [
        'CGP.common.condition.ConditionFieldSet'],
    bodyPadding: '10',
    autoScroll: true,
    region: 'center',
    fieldDefaults: {
        labelAlign: 'left',
        labelWidth: 120,
        msgTarget: 'side',
        validateOnChange: false
    },
    leftAttributes: null,
    //data: null,
    initComponent: function () {
        var me = this;
        var productId = me.productId;

        var keysValue = Ext.create('CGP.tools.freemark.template.view.KeysValue', {
            data: me.data.inputs,
            name: 'variables',
            itemId: 'variables',
            width: '100%',
            padding: "5 15",
            productId: me.productId
        });
        me.items = [
            {
                xtype: 'textfield',
                name: 'description',
                fieldLabel: i18n.getKey('description'),
                padding: 15,
                width: 380
            },
            // Ext.create('CGP.common.condition.AttributeConditionFieldset', {
            //     title: i18n.getKey('执行规则的前提条件'),
            //     itemId: 'attributeMappingRuleFieldSet',
            //     name:'condition',
            //     productId: productId,
            //     margin: '10 0',
            //     border:0
            // }),
            Ext.create('CGP.common.condition.view.ConditionFieldContainer', {
                fieldLabel: i18n.getKey('执行规则的前提条件'),
                labelAlign: "top",
                itemId: 'attributeMappingRuleFieldSet',
                name: 'condition',
                contentAttributeStore: Ext.data.StoreManager.get('contentAttribute') || Ext.create('CGP.common.store.ConditionProductAttribute', {
                    storeId: 'contentAttribute',
                    productId: productId
                }),
                padding: "5 15",
                border: 0,
                conditionPanelItems: {
                    simpleConditionGrid:{
                        leftValue:"ProductAttributeValue"
                    },
                    variableCondition: Ext.create('CGP.tools.freemark.template.view.VariableConditionPanel', {
                        title: i18n.getKey('自定变量执行条件'),
                        hideConditionModel: true,
                        checkOnly: me.checkOnly,
                        itemId: 'variableConditionPanel',
                        productId: me.productId
                    })
                }
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
        var me = this, data = {};
        var items = me.items.items;

        Ext.Array.each(items, function (item) {
            data[item.name] = item.getValue();
        });
        return data;
    }
});
