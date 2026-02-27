Ext.define('CGP.product.edit.module.SkuProduct', {
    extend: 'Ext.panel.Panel',


    config: {
        layout: 'border'
    },
    constructor: function () {

        var me = this;





        me = Ext.apply(me, config);

        config = Ext.apply({
            title: i18n.getKey('skuProduct')
        }, config);

        me.callParent([config]);

        me.content = me;
    },

    initComponent: function () {

        var me = this;
        var data = me.data;
        var attributes = me.attributes;
        me.callParent(arguments);

        me.attributeForm = Ext.create('CGP.product.edit.component.skuproducts.skuAttribute', {
            skuAttributes: data.skuAttributes,
            attributes: attributes
        });
        me.skuProductGrid = Ext.create('CGP.product.edit.component.skuproducts.SkuProduct');
    }

})