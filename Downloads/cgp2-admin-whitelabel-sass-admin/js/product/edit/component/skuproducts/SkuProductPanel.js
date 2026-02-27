Ext.define('CGP.product.edit.component.skuproducts.SkuProductPanel', {
    extend: 'Ext.panel.Panel',
    itemId: 'SkuProductGrid',
    layout: 'border',
    isSpecialSku: null,
    initComponent: function () {
        var me = this;
        var configurableProductId = JSGetQueryString('productId') || JSGetQueryString('id');
        me.title = i18n.getKey('skuProduct');
        me.filter = Ext.create('CGP.product.edit.component.skuproducts.SkuAttributeFilterForm', {
            region: 'north',
            configurableProductId: configurableProductId,
            skuProductContainer: me
        });
        me.hidden = me.isSpecialSku;
        me.callParent(arguments);
        me.add(me.filter);
    }
});
