/**
 * @author xiu
 * @date 2025/7/30
 */
Ext.Loader.syncRequire([
    'CGP.websiteproductlist.model.WebsiteproductlistModel',
    'CGP.websiteproductlist.controller.Controller',
])
Ext.onReady(function () {
    Ext.create('CGP.websiteproductlist.view.CreateEditPage', {
        block: 'websiteproductlist',
        gridPage: 'main.html',
    })
});
