/**
 * Created by nan on 2021/8/24
 * pc预设主题
 *
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpreset.view.EditForm'
])
Ext.onReady(function () {
    var mvtId = JSGetQueryString('mvtId');
    var mvtType = JSGetQueryString('mvtType');
    var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.controller.Controller');
    var pcsData = controller.getPCSData(mvtId);
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var tab = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.OutTab', {
        pcsData: pcsData,
        mvtId: mvtId,
        mvtType: mvtType,
    });
    page.add(tab);
});
