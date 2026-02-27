/**
 * Created by nan on 2018/9/19.
 */
Ext.onReady(function () {
    var productId = JSGetQueryString('productId');
    var isSkuProduct = JSGetQueryString('type');
    var parentConfigProductId = JSGetQueryString('parentConfigProductId');//记录是由哪个可配置产品生成的
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var customsCategoryStore = Ext.create("CGP.customscategory.store.CustomsCategory");


    var customsElementForm = Ext.create('CGP.product.view.customselement.view.CustomsElement', {
        productId: productId,
        isSkuProduct: isSkuProduct ? isSkuProduct == 'SKU' : null,
        parentConfigProductId:parentConfigProductId,
        customsCategoryStore: customsCategoryStore
    });
    page.add(customsElementForm)
});
