/**
 * @author xiu
 * @date 2025/5/15
 */
Ext.Loader.syncRequire([
    'CGP.partner.view.partnerstorecheck.model.ManufactureproductionconfigModel',
    'CGP.partner.view.partnerstorecheck.controller.Controller',
])
Ext.onReady(function () {
    Ext.create('CGP.partner.view.partnerstorecheck.view.CreateGridPage', {
        block: 'partnerstorecheck',
        gridPage: 'main.html',
    })
});
