Ext.define('CGP.tools.freemark.template.view.ContextForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    layout: {
        type: 'table',
        columns: 2
    },
    fieldDefaults: {
        labelAlign: 'right',
        width: 280,
        labelWidth: 120,
        msgTarget: 'side'
    },
    autoScroll: true,
    scroll: 'vertical',
    border:false,
    padding:'10',

    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('skuAttribute'),
                colspan:2
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('orderInformation'),
                colspan:2
            },
            {
                xtype: 'textfield',
                itemId: 'orderNumber',
                name:'orderNumber',
                text:i18n.getKey('orderNumber'),
                allowBlank: false
            },
            {
                xtype: 'numberfield',
                itemId: 'pageIndex',
                name:'pageIndex',
                text:i18n.getKey('pageIndex'),
                allowBlank: false
            },
            {
                xtype: 'numberfield',
                itemId: 'pageTotal',
                name:'pageTotal',
                text:i18n.getKey('pageTotal'),
                allowBlank: false
            },
            {
                xtype: 'numberfield',
                itemId: 'printQty',
                name:'printQty',
                text:i18n.getKey('printQty'),
                allowBlank: false
            },
            {
                xtype: 'datefield',
                itemId: 'datePurchased',
                name:'datePurchased',
                text:i18n.getKey('datePurchased'),
                allowBlank: false,
                value: new Date()
            },
            {
                xtype: 'textfield',
                itemId: 'barCode',
                name:'barCode',
                text:i18n.getKey('barCode'),
                allowBlank: false
            },
        ];

        me.callParent();

    },
    getValue: function () {
        var me = this,data={};
        var items = me.items.items;

        Ext.Array.each(items, function (item) {
            if(!item.hidden){
                data[item.name]=item.getValue()
            }
        });
        return data;
    },
    createItem:function (attr){

    }
});