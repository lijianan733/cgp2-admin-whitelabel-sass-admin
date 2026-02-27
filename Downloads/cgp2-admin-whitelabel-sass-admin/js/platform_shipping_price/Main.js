/*
* Created by nan on 2025/05/1
*/
Ext.Loader.syncRequire([
    'CGP.platform_shipping_price.view.DiyManageGridPanel'
]);
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'tabpanel',
            items: [
                {
                    xtype: 'diy_manage_grid_panel',
                    clazz: 'com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig',
                    name: 'PlatformShippingPrice',
                    itemId: 'PlatformShippingPrice',
                },
                {
                    xtype: 'diy_manage_grid_panel',
                    name: 'StorePlatformShippingPrice',
                    itemId: 'StorePlatformShippingPrice',
                    clazz: 'com.qpp.cgp.domain.common.module.StorePlatformShippingPriceConfig'
                },
                {
                    xtype: 'diy_manage_grid_panel',
                    name: 'StoreSyncShippingPrice',
                    itemId: 'StoreSyncShippingPrice',
                    clazz: 'com.qpp.cgp.domain.common.module.StoreSyncShippingPriceConfig'
                },
                {
                    xtype: 'diy_manage_grid_panel',
                    name: 'WhiteLabelShippingPrice',
                    itemId: 'WhiteLabelShippingPrice',
                    clazz: 'com.qpp.cgp.domain.common.module.WhiteLabelShippingPriceConfig'
                },
            ]
        }]
    });
});