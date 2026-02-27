Ext.define('CGP.product.view.pricerule.Edit', {
    extend: 'Ext.form.Panel',
    alias: 'widget.priceruleeditor',

    initComponent: function () {
        var me = this;



        me.items = [{
            xtype:'numberfield',
            itemId: 'qtyFrom',
            name: 'qtyFrom',
            minValue:0,
            allowDecimal:false,
            allowExponential:false,
            fieldLabel: i18n.getKey('qtyFrom')
        },{
            xtype:'numberfield',
            itemId: 'qtyTo',
            name: 'qtyTo',
            minValue:0,
            allowDecimal:false,
            allowExponential:false,
            fieldLabel: i18n.getKey('qtyTo')
        },{
            xtype:'numberfield',
            itemId: 'price',
            name: 'price',
            minValue:0,
            allowExponential:false,
            fieldLabel: i18n.getKey('price')
        }];

        me.callParent(arguments);
    }
})