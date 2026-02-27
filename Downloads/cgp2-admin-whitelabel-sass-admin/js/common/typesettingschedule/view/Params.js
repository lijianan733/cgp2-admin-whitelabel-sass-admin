/**
 * Created by admin on 2020/8/17.
 */
Ext.define('CGP.common.typesettingschedule.view.Params', {
    extend: "Ext.form.Panel",
    layout: {
        type: 'table',
        columns: 2
    },
    bodyStyle: 'padding:10px',
    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 120,
        msgTarget: 'side',
        validateOnChange: false
    },
    data: null,

    initComponent: function () {
        var me = this;
        me.items = [
            {
                name: 'orderNumber',
                //allowBlank: false,
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('orderNumber'),
                itemId: 'orderNumber'
            },
            {
                name: 'orderId',
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('orderId'),
                itemId: 'orderId'
            },
            {
                name: 'orderItemId',
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('orderItemId'),
                itemId: 'orderItemId'
            },
            {
                name: 'materialPath',
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('materialPath'),
                itemId: 'materialPath'
            },
            {
                name: 'viewType',
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('viewType'),
                itemId: 'viewType'
            }
        ];
        me.callParent(arguments);
    },

    listeners: {
        afterrender: function (comp) {
            var me = this;
            if (me.data) {
                me.setValue(me.data);
            }
        }
    },
    setValue: function (data) {
        var me = this;
        var items = me.items.items;
        Ext.Array.each(items, function (item) {
            item.setValue(data[item.name]);
        })
    }
})