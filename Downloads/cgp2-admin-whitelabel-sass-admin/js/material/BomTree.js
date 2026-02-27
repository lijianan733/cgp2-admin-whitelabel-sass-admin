Ext.onReady(function () {
    var treePanel = Ext.create("CGP.material.view.BomTree");
    var infoTab = Ext.create('CGP.material.view.InfoTab', {
        BomTree: treePanel
    });
    Ext.create('Ext.container.Viewport', {
        title: "Material",
        layout: "border",
        defaults: {
            split: true,
            hideCollapseTool: true
        },
        items: [treePanel, infoTab]
    })
});