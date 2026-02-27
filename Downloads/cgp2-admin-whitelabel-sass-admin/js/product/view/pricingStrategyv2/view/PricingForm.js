/**
 * Created by admin on 2020/3/11.
 */
Ext.define("CGP.product.view.pricingStrategyv2.view.PricingForm", {
    extend: 'Ext.ux.form.ErrorStrickForm',
    border: 0,
    isCosting: '',//是否为成本的配置
    fieldDefaults: {
        labelAlign: 'right',
        width: 380,
        labelWidth: 100,
        msgTarget: 'side'
    },

    pricingModel: null,

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'numberfield',
                name: 'index',
                fieldLabel: i18n.getKey('index'),
                itemId: 'index',
                readOnly: true,
                readOnlyCls: 'x-item-disabled',
                allowBlank: false,
                allowDecimals: false,
                hidden: true,
                minValue: 0
            },
            {
                xtype: 'numberfield',
                name: 'from',
                fieldLabel: i18n.getKey('minQty'),
                itemId: 'from',
                allowBlank: false,
                allowDecimals: false,
                minValue: 1,
                validator: function (val) {
                    if (me.getComponent('to').getValue() && val > me.getComponent('to').getValue()) {
                        return '不允许超过' + i18n.getKey('maxQty');
                    } else {
                        return true;
                    }
                },
                listeners: {
                    change: function (comp, newValue) {
                        if (newValue) {
                            comp.ownerCt.getComponent('to').validate();
                        }
                    }
                }
            },
            {
                xtype: 'numberfield',
                name: 'to',
                fieldLabel: i18n.getKey('maxQty'),
                itemId: 'to',
                allowBlank: false,
                allowDecimals: false,
                minValue: 1,
                validator: function (val) {
                    if (me.getComponent('from').getValue() && val < me.getComponent('from').getValue()) {
                        return '不允小于' + i18n.getKey('minQty');
                    } else {
                        return true;
                    }
                },
                listeners: {
                    change: function (comp, newValue) {
                        if (newValue) {
                            comp.ownerCt.getComponent('from').validate();
                        }
                    }
                }
            },
            {
                xtype: 'numberfield',
                name: 'price',
                fieldLabel: i18n.getKey('price'),
                itemId: 'price',
                allowBlank: false,
                decimalPrecision: me.isCosting ? 4 : 2,
                regex: /^(?!0$).*/,
                regexText: '值不能为0',
                minValue: me.isCosting ? 0.0001 : 0.01,
            },
            {
                xtype: 'textfield',
                name: 'description',
                fieldLabel: i18n.getKey('description'),
                itemId: 'description'
            }
        ];
        me.callParent(arguments);

    },

    listeners: {
        afterrender: function (comp) {
            comp.setValue(comp.pricingModel.data)
        }
    },

    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            item.setValue(data[item.name]);
        })
    },
    getValue: function () {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            me.pricingModel.set(item.name, item.getValue());
        })
        return me.pricingModel.data;
    }
})