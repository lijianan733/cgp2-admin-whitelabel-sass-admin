Ext.onReady(function(){
    var treePanel = Ext.create("CGP.rtoption.view.TreePanel");
    var centerPanel = Ext.create('CGP.rtoption.view.CenterPanel');
    Ext.create('Ext.container.Viewport',{
        title: "RtOption",
        layout: "border",
        defaults: {
            split: true,
            hideCollapseTool : true
        },
        items: [
            treePanel,
            centerPanel
        ]
    })
});