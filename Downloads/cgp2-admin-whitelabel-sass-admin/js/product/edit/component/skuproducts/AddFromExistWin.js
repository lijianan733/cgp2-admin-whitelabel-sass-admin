Ext.define("CGP.product.edit.component.skuproducts.AddFromExistWin",{
    extend: "Ext.window.Window",

    width: 800,
    height: 600,
    layout: 'border',
    modal: true,
    initComponent: function(){
        var  me = this;

        me.title = i18n.getKey('addFromExist');
        var skuProductGrid = Ext.create("CGP.product.edit.component.skuproducts.AddFromExistGrid",{
            skuAttributeIds: me.skuAttributeIds,
            sku: me.sku,
            attributes: me.attributes,
            configurableProductId: me.configurableProductId,
            addSkuProductToconfigurableProduct: me.addSkuProductToconfigurableProduct
        });
        me.items = [skuProductGrid];
        me.callParent(arguments);
    }
})