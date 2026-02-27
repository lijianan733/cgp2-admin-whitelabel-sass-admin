Ext.define('CGP.ordersign.view.orderInfo.OrderForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.order_form',
    border: false,
    defaults: {
        xtype: 'displayfield',
        margin: '5 40 5 0',
        labelWidth: 60,
        readOnly: true,
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                fieldLabel: i18n.getKey('orderNumber'), //订单号🐕
                name: 'orderNumber'
            },
            {
                fieldLabel: i18n.getKey('referenceNo'), //其他单号🐕
                name: 'referenceNo',
            },
            {
                name: 'sysOrderDate',
                itemId: 'sysOrderDate',
                fieldLabel: i18n.getKey('orderDate'), //订单日期🐕
                diyGetValue: function () {
                    var me = this;
                    return me.rewTime;
                },
                diySetValue: function (value) {
                    var me = this;
                    me.rewTime = value;
                    value && me.setValue(Ext.Date.format(new Date(+value), 'Y年m月d日 G:i:s'));
                }
            },
            {
                fieldLabel: i18n.getKey('source'), //销售来源🐕
                name: 'source'
            },
            {
                xtype: 'textfield',
                fieldLabel: i18n.getKey('remark'), //订单备注🐕
                name: 'remark',
                fieldStyle: null,
                readOnly: false,
            },
        ]
        me.callParent();
    },
    diyGetValue: function () {
        var result = {},
            me = this,
            items = me.items.items;

        items.forEach(item => {
            var name = item.getName(),
                value = item.diyGetValue ? item.diyGetValue() : item.getValue();
            result[name] = value;
        })
        return result;
    },
    diySetValue: function (value) {
        var me = this,
            items = me.items.items;

        items.forEach(item => {
            var name = item.getName();
            item.diySetValue ? item.diySetValue(value[name]) : item.setValue(value[name]);
        })
    }
})