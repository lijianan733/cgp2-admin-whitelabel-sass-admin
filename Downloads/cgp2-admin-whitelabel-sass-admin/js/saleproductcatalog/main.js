Ext.onReady(function () {
    var treePanel = Ext.create("CGP.productcatalog.CatalogTree",{
        showAsProductCatalog:false
    });
    var infoTab = Ext.create('CGP.productcatalog.CenterPanel', {
        BomTree: treePanel
    });
    Ext.create('Ext.container.Viewport', {
        title: "productCatalog",
        layout: "border",
        defaults: {
            split: true,
            hideCollapseTool: true
        },
        items: [treePanel, infoTab]
    })
});
