Ext.onReady(function () {
    var navigator = Ext.create("CGP.configurationgroup.view.ConfigNavigator");
    var configCenter = Ext.create('CGP.configurationgroup.view.ConfigCenterPanel', {
        id: 'configCenterPanel'
    });
    Ext.create('Ext.container.Viewport', {
        title: "Material",
        layout: "border",
        defaults: {
            split: true,
            hideCollapseTool: true
        },
        items: [navigator, configCenter]
    })
});
