/**
 * Created by nan on 2018/6/13.
 */
Ext.syncRequire(['CGP.partner.model.SalerConfigModel', 'CGP.partner.view.placeorderconfig.controller.Controller', 'CGP.configuration.shippingmethod.model', 'CGP.currency.store.Currency']);
Ext.onReady(function () {
    var partnerId = JSGetQueryString('partnerId');
    var websiteId = JSGetQueryString('websiteId');
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var tab = Ext.create('Ext.tab.Panel', {});
    var baseConfigPanel = Ext.create('CGP.partner.view.placeorderconfig.view.BaseConfigForm', {
        partnerId: partnerId,
        websiteId: websiteId,
        tab: tab,
        outTab:tab
    });
    var deliveryAddressPanel = Ext.create('CGP.partner.view.placeorderconfig.view.DeliveryAddressForm', {
        partnerId: partnerId,
        tab: tab,
        outTab:tab
    });
    baseConfigPanel.deliveryAddressPanel = deliveryAddressPanel;
    deliveryAddressPanel.baseConfigPanel = baseConfigPanel;
    page.add(tab);
    tab.add([baseConfigPanel, deliveryAddressPanel]);
    tab.setActiveTab(baseConfigPanel);
    tab.setActiveTab(deliveryAddressPanel);
    tab.setActiveTab(baseConfigPanel);

})
