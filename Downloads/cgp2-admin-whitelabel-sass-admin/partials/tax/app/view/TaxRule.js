/**
 * TaxRule
 * @Author: miao
 * @Date: 2021/11/3
 */
Ext.define("CGP.tax.view.TaxRule", {
    extend: "Ext.form.Panel",
    alias: 'widget.taxrule',
    requires: [],
    autoScroll: true,
    scroll: 'vertical',
    border: 0,
    fieldDefaults: {
        labelAlign: 'right',
        width: 380,
        labelWidth: 120,
        msgTarget: 'side'
    },

    readOnly: false,
    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'numberfield',
                itemId: 'rate',
                name: 'rate',
                fieldLabel: i18n.getKey('rate'),
                allowBlank: me.readOnly||false,
                readOnly: me.readOnly
            },
            {
                xtype: 'numberfield',
                itemId: 'additionalAmount',
                name: 'additionalAmount',
                fieldLabel: i18n.getKey('additionalAmount'),
                allowBlank: me.readOnly||false,
                readOnly: me.readOnly
            },
            {
                xtype: 'numberfield',
                itemId: 'amontThreshold',
                name: 'amontThreshold',
                fieldLabel: i18n.getKey('amontThreshold'),
                allowBlank: me.readOnly||false,
                readOnly: me.readOnly,
                minValue:0,
                value:0
            },
        ];
        me.callParent(arguments);
    },
    getValue: function () {
        var me = this, data = {};
        var items = me.items.items;
        for (var item of items) {
            data[item.name] = item.getValue()
        }
        return data;
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        me.data = data;
        for (var item of items) {
            if(item.name=='amontThreshold'){
                item.setValue(data[item.name]||0);
            }
            else{
                item.setValue(data[item.name]);
            }
        }
    }
});