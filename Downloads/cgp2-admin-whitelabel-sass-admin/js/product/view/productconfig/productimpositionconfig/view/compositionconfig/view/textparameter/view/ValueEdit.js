/**
 * Created by miao on 2021/6/09.
 */
Ext.define("CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.view.ValueEdit", {
    extend: "Ext.form.Panel",
    requires: [],
    bodyPadding: '10',
    autoScroll: true,
    region: 'center',
    fieldDefaults: {
        labelAlign: 'left',
        labelWidth: 120,
        margin: '5',
        msgTarget: 'side',
        validateOnChange: false,
        allowBlank: false
    },
    leftAttributes: null,
    //data: null,
    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'textfield',
                name: 'description',
                itemId: 'description',
                fieldLabel: i18n.getKey('description'),
                width: 380
            },
            Ext.create('CGP.common.condition.view.ConditionContainer', {
                name: 'condition',
                itemId: 'condition',
                // fieldLabel: i18n.getKey('condition'),
                header: false,
                contentAttributeStore: Ext.data.StoreManager.lookup('contentAttributeStore'),
            }),
            Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.textparameter.view.ValueContainer', {
                name: 'value',
                itemId: 'value',
                // fieldLabel: i18n.getKey('value'),
                allowBlank: false
            }),

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
            if (item.rendered && !item.allowBlank && item.isValid() == false) {
                isValid = false;
            }
        });
        return isValid;
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            if (item.name) {
                item.setValue(data[item.name]);
            }
        })
    },
    getValue: function () {
        var me = this, data = {};
        var items = me.items.items;

        Ext.Array.each(items, function (item) {
            if (item.name) {
                data[item.name] = item.getValue();
            }
        });
        return data;
    }
});
