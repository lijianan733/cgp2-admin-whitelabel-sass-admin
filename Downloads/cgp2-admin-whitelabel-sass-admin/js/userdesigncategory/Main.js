/**
 * Created by nan on 2018/5/21.
 */
Ext.onReady(function () {
    var treePanel = Ext.create("CGP.userdesigncategory.view.CategoryListNavigator");
    var centerPanel = Ext.create('CGP.userdesigncategory.view.UserDesignDispalyPanel');
    Ext.create('Ext.container.Viewport', {
        title: "Material",
        layout: "border",
        defaults: {
            split: true,
            hideCollapseTool: true
        },
        items: [treePanel, centerPanel]
    })
});