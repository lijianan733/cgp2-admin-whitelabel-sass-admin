/**
 * Created by nan on 2020/2/19.
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.store.PreProcessConfigStore',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.model.PreProcessConfigModel',
    'CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.ConditionMappingConfigGird'
])
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: []
    });
    var tab = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.MainTab', {
        designId: JSGetQueryString('designId')
    });
    page.add(tab)
});
