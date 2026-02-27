/**
 * Created by nan on 2018/7/23.
 */
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {layout: 'fit'});
    var partnerId = JSGetQueryString('partnerId');
    var websiteId = JSGetQueryString('websiteId');
    var controller = Ext.create('CGP.partner.view.ecommerceenableproductmanage.controller.Controller');
    var grid = Ext.create('CGP.partner.view.ecommerceenableproductmanage.view.EnableProductManagePanel', {
        websiteId: websiteId,
        partnerId: partnerId,
        itemId: 'EnableProductManagePanel',
        controller: controller
    });
    page.add(grid);
});