/**
 *详细页
 **/
Ext.syncRequire([]);
Ext.define('CGP.product.view.productattributeprofile.view.Information', {
    extend: 'Ext.form.Panel',

    padding: 30,
    defaultType: 'textfield',
    defaults: {
        width: 450,
        labelAlign: 'left',
        labelWidth: 50
    },
    itemId: 'baseInfo',

    initComponent: function () {
        var me = this;
        var productId = parseInt(JSGetQueryString('productId'));
        me.items = [
            {
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name',
                allowBlank: false
            },
            {
                name: 'productId',
                xtype: 'numberfield',
                hidden: true,
                itemId: 'id',
                value: productId
            },
            {
                name: 'sort',
                xtype: 'numberfield',
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('sorter'),
                itemId: 'sort',
                minValue: 0
            }
        ];

        me.title = i18n.getKey('baseInfo');

        me.callParent(arguments);

    },
    refreshData: function (data) {

        var me = this;
        Ext.Array.each(me.items.items, function (item) {

            if (item.name != 'productId') {
                item.setValue(data[item.name]);
            }

        });

    }


});