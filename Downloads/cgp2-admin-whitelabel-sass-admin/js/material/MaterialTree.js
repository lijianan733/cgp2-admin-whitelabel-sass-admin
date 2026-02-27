Ext.onReady(function(){
    var treePanel = Ext.create("CGP.material.view.MaterialTreePanel");
    //var infoTab = Ext.create("CGP.material.view.InfoTab");
    var infoTab = Ext.create('CGP.material.view.InfoTab');
    Ext.create('Ext.container.Viewport',{
        title: "Material",
        layout: "border",
        defaults: {
            split: true,
            hideCollapseTool : true
        },
        items: [treePanel,infoTab]
    })
});