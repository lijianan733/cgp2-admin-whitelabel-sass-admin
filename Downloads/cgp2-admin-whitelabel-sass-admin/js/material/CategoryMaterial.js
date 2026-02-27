Ext.onReady(function(){
    var treePanel = Ext.create("CGP.material.view.TreePanel");
    //var infoTab = Ext.create("CGP.material.view.InfoTab");
    var centerPanel = Ext.create('CGP.material.view.CenterPanel');
    Ext.create('Ext.container.Viewport',{
        title: "Material",
        layout: "border",
        defaults: {
            split: true,
            hideCollapseTool : true
        },
        items: [treePanel,centerPanel]
    })
});