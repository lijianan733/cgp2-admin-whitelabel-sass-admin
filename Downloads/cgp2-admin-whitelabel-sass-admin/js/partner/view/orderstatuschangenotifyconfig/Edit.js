/**
 * Created by nan on 2018/6/19.
 */
Ext.syncRequire([
    'CGP.partner.view.partnerorderreportconfigmanage.view.DiyEmailsFieldComponent',
    'CGP.mailhistory.controller.overridesubmit',
    'CGP.partner.view.orderstatuschangenotifyconfig.model.OrderStatusChangeNotifyConfigModel',
    'CGP.partner.view.orderstatuschangenotifyconfig.model.RestHttpRequestConfigModel',
    'CGP.partner.view.orderstatuschangenotifyconfig.config.Config',
    'CGP.partner.view.orderstatuschangenotifyconfig.model.NotifyEmailConfigModel'
]);
Ext.onReady(function () {
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
    var controller = Ext.create('CGP.partner.view.orderstatuschangenotifyconfig.controller.Controller');
    var partnerId = JSGetQueryString('partnerId');
    var activeTab = JSGetQueryString('activeTab');
    var websiteId = JSGetQueryString('websiteId');
    var createOrEdit = JSGetQueryString('createOrEdit');
    var type = JSGetQueryString('type');
    var recordId = JSGetQueryString('recordId');
    var tab = Ext.create('Ext.tab.Panel', {
        id: 'outTab',
        listeners: {
            tabchange: function () {
                if (arguments[2] && arguments[2].msgPanel) {
                    arguments[2].msgPanel.hide();
                }
            }
        }
    });
    var baseInfoPanel = Ext.create('CGP.partner.view.orderstatuschangenotifyconfig.view.BaseInfoConfig', {
        controller: controller,
        partnerId: partnerId,
        recordId: recordId,
        outTab: tab,
        itemId: 'baseInfoPanel',
        type: type,
        title: i18n.getKey('baseInfo'),
        createOrEdit: createOrEdit
    });
    var restRequestConfig = Ext.create('CGP.partner.view.orderstatuschangenotifyconfig.view.RestRequestConfig', {
        controller: controller,
        partnerId: partnerId,
        recordId: recordId,
        outTab: tab,
        itemId: 'restRequestConfig',
        type: type,
        title: i18n.getKey('APIRequestConfig'),
        createOrEdit: createOrEdit
    });
    var notifyEmailConfig = Ext.create('CGP.partner.view.orderstatuschangenotifyconfig.view.NotifyEmailConfig', {
        controller: controller,
        partnerId: partnerId,
        recordId: recordId,
        outTab: tab,
        itemId: 'notifyEmailConfig',
        type: type,
        title: i18n.getKey('notifyEmailConfig'),
        createOrEdit: createOrEdit
    });
    tab.add([baseInfoPanel, restRequestConfig, notifyEmailConfig]);
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    page.add(tab);
    tab.setActiveTab(baseInfoPanel);
    if (!Ext.isEmpty(activeTab)) {
        tab.setActiveTab(parseInt(activeTab))
    }
});