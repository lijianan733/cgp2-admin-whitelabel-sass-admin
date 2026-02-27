/**
 * Created by nan on 2021/4/6
 */
Ext.Loader.syncRequire([
    'CGP.productset.view.LeftTree',
    'CGP.productset.view.CenterPanel',
    'CGP.productset.view.CenterPanel',
    'CGP.productset.model.ProductSetModel',
    'CGP.productset.view.ProductSetItemForm',
    'CGP.productset.model.ProductSetItemModel',
    'CGP.productset.model.ProductScopeModel',
    'CGP.product.model.Product',
    'CGP.common.field.ProductCategoryCombo'
])
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var outPanel = Ext.create('CGP.productset.view.OutPanel', {});
    page.add(outPanel);

})