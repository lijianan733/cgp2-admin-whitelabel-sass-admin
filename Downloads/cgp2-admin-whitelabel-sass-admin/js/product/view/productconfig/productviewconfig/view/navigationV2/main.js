Ext.onReady(function () {
    var navigationId = JSGetQueryString('navigationId');
    var productViewConfigId = JSGetQueryString('productViewConfigId');
    var haveRootNode = JSGetQueryString('haveRootNode');
    var treePanel = Ext.create("CGP.product.view.productconfig.productviewconfig.view.navigationV2.view.NavigationTree", {
        navigationId: navigationId,
        productViewConfigId: productViewConfigId,
        haveRootNode: haveRootNode
    });
    var infoTab = Ext.create('CGP.product.view.productconfig.productviewconfig.view.navigationV2.view.InfoTab', {
        productViewConfigId: productViewConfigId,
        navigationId: navigationId
    });
    Ext.create('Ext.container.Viewport', {
        title: i18n.getKey("navigation") + i18n.getKey('config'),
        layout: "border",
        defaults: {
            split: true,
            hideCollapseTool: true
        },
        items: [treePanel, infoTab]
    })
});