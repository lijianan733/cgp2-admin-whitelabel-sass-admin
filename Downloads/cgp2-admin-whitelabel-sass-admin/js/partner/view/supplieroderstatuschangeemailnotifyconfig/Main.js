/**
 * Created by nan on 2018/4/23.
 */
Ext.onReady(function () {
    var partnerId = JSGetQueryString('partnerId');
    var tab = Ext.create('Ext.tab.Panel', {
        id: 'supplierOrderStatusChangeEmailNotifyConfig'
    });
    var allOrderStatus=Ext.create('CGP.common.store.OrderStatuses');
    var array = tab.add([
        {
            id: 'manageCustomerEmailNotifyConfig',
            title: i18n.getKey('manager')+i18n.getKey('user')+i18n.getKey('orderStatusChangeEmailNotifyConfig'),
            html: '<iframe id="tabs_iframe_' + JSGetUUID() + '" src="' + path + 'partials/partner/supplierorderstatuschangeemailnotify/managecustomeremailnotifyconfig.html?partnerId=' + partnerId + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
            closable: false
        },
        {
            id: 'manageServiceEmailNotifyConfig',
            title:i18n.getKey('manager')+i18n.getKey('server')+i18n.getKey('orderStatusChangeEmailNotifyConfig'),
            html: '<iframe id="tabs_iframe_' + JSGetUUID() + '" src="' + path + 'partials/partner/supplierorderstatuschangeemailnotify/manageserviceemailnotifyconfig.html?partnerId=' + partnerId + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
            closable: false
        }
    ]);
    tab.setActiveTab(array[0]);
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [tab]
    });
});