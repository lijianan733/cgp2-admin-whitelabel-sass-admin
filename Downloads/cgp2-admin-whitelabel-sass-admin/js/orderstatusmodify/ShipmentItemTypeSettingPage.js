/**
 * @author xiu
 * @date 2025/11/21
 */

Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.CreateShipmentItemTypeSettingPage',
])
Ext.onReady(function () {
  /*  Ext.create('Ext.Viewport', {
        layout: 'fit',
        itemId: 'view',
        items: [
            {
                xtype: 'shipment_item_type_setting'
            }
        ]
    })*/
    Ext.create('CGP.orderstatusmodify.view.CreateShipmentItemTypeSettingPageV2', {
        i18nblock: i18n.getKey('orderstatusmodify'),
        block: 'orderstatusmodify',
        editPage: 'edit.html',
    })
})