Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.ManageCommonConfigGridPanel'
])
Ext.onReady(function () {
    var PMVTId = JSGetQueryString('PMVTId');
    var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.controller.Controller');
    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');//最外面的tabs
    var productId = builderConfigTab.productId;
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var contentData = controller.buildPMVTContentData(productId)
    var gridConfigPanel = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.ManageSpecialConfigPanel', {
        width: '100%',
        title: i18n.getKey('grid') + i18n.getKey('PCS预处理配置'),
        PMVTId: PMVTId,
        flex: 1,
        contentData: contentData
    });
    var commonGrid = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.pcspreprocess.view.ManageCommonConfigGridPanel', {
        width: '100%',
        title: i18n.getKey('通用PCS预处理配置'),
        PMVTId: PMVTId,
        height: 350,
        contentData: contentData
    });

    var tab = Ext.create('Ext.tab.Panel', {
        items: [commonGrid, gridConfigPanel]
    });
    tab.contentData = contentData;//把改产品用到的属性上下文存在tab中
    page.add(tab);

});
