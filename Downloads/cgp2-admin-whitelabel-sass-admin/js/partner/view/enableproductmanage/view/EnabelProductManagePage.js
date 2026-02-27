/**
 * Created by nan on 2017/12/8.
 *
 */
Ext.define('CGP.partner.view.enableproductmanage.view.EnabelProductManagePage', {
    extend: 'Ext.panel.Panel',
    layout: 'fit',
    constructor: function () {
        var me = this;
        var partnerId = Number(JSGetQueryString('partnerId'));
        var websiteId = Number(JSGetQueryString('websiteId'));
        var controller = Ext.create('CGP.partner.controller.Controller');
        me.title = i18n.getKey('enabelProductManage');
        me.items = [Ext.create('CGP.partner.view.enableproductmanage.view.EnableProductManagePanel', {
            width: 950,
            height: 600,
            supgrid: me,
            websiteId: websiteId,
            partnerId: partnerId,
            id: 'PartnerUList',
            controller: controller
        })];
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;

        me.callParent(arguments);
    }
})