/**
 * Created by nan on 2018/7/19.
 */
Ext.syncRequire([
    'CGP.partner.view.supplierorderconfig.model.RestHttpRequestConfigModel',
    'CGP.partner.view.supplierorderconfig.model.NotifyEmailConfigModel',
    'CGP.partner.view.supplierorderconfig.model.OrderStatusChangeNotifyConfigModel',
    'CGP.partner.view.supplierorderconfig.store.OrderStatusChangeNotifyConfigStore',
    'CGP.partner.view.supplierorderconfig.view.EditOrCreateNotifyEmailConfig',
    'CGP.partner.view.supplierorderconfig.view.RestRequestConfig',
    'CGP.partner.view.supplierorderconfig.view.NotifyEmailConfig',
    'CGP.partner.view.supplierorderconfig.view.HeadersContainer',
    'CGP.partner.view.supplierorderconfig.controller.Controller',
    'CGP.partner.view.partnerorderreportconfigmanage.view.DiyEmailsFieldComponent',
    'CGP.partner.view.supplierorderconfig.config.Config',
    'CGP.mailhistory.controller.overridesubmit'
]);
Ext.onReady(function () {
    var partnerId = JSGetQueryString('partnerId');
    var websiteId = JSGetQueryString('websiteId');
    var type = JSGetQueryString('type');
    var controller = Ext.create('CGP.partner.view.supplierorderconfig.controller.Controller');
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var outTab = Ext.create('Ext.tab.Panel');
    var apiRequestConfigGridPanel = Ext.create('CGP.partner.view.supplierorderconfig.view.RestRequestConfig', {
        controller: controller,
        createOrEdit: 'edit',
        partnerId: partnerId,
        outTab: outTab,
        itemId: 'restRequestConfig',
        type: type,
        title: i18n.getKey('APIRequestConfig')
    });
    var notifyEmailConfigGridPanel = Ext.create('CGP.partner.view.supplierorderconfig.view.NotifyEmailConfig', {
        controller: controller,
        partnerId: partnerId,
        createOrEdit: 'edit',
        outTab: outTab,
        itemId: 'notifyEmailConfig',
        type: type,
        title: i18n.getKey('notifyEmailConfig')
    });
    outTab.add([apiRequestConfigGridPanel, notifyEmailConfigGridPanel]);
    page.add(outTab);
    outTab.setActiveTab(apiRequestConfigGridPanel);
    window.deleteEmail = function (itemId) {
        var field = Ext.getCmp(itemId);
        field.ownerCt.remove(field);
    };
    window.downLoad = function (itemId) {
        var field = Ext.getCmp(itemId);
        var fileName = field.fileName;
        const a = document.createElement('a');
        a.setAttribute('href', imageServer + field.name);
        a.setAttribute('download', fileName);
        a.click();
    };
    window.deleteFile = function (itemId) {
        var field = Ext.getCmp(itemId);
        field.ownerCt.remove(field);
    };
})