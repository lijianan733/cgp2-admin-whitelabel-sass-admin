Ext.onReady(function(){
    var treePanel = Ext.create("CGP.rttypes.view.TreePanel");
    var info = Ext.create("CGP.rttypes.view.information.InfoTabs");
    Ext.create('Ext.container.Viewport',{
        title: "RtTypes",
        layout: "border",
        defaults: {
            split: true,
            hideCollapseTool : true
        },
        items: [treePanel,info]
    })
});