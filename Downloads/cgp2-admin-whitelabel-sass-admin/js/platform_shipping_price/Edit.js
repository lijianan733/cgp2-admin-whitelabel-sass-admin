/*
* Created by nan on 2025/05/1
*/
Ext.Loader.syncRequire([
    'CGP.platform_shipping_price.model.PlatformShippingPriceModel',
    'CGP.platform_shipping_price.model.StorePlatformShippingPriceModel',
    'CGP.platform_shipping_price.model.StoreSyncShippingPriceModel',
    'CGP.platform_shipping_price.model.WhiteLabelShippingPriceModel'
]);
Ext.onReady(function () {
    var mapping = {
        'com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig': 'CGP.platform_shipping_price.model.PlatformShippingPriceModel',
        'com.qpp.cgp.domain.common.module.StorePlatformShippingPriceConfig': 'CGP.platform_shipping_price.model.StorePlatformShippingPriceModel',
        'com.qpp.cgp.domain.common.module.StoreSyncShippingPriceConfig': 'CGP.platform_shipping_price.model.StoreSyncShippingPriceModel',
        'com.qpp.cgp.domain.common.module.WhiteLabelShippingPriceConfig': 'CGP.platform_shipping_price.model.WhiteLabelShippingPriceModel',
    };
    var model = mapping[JSGetQueryString('clazz')];
    var editPage = Ext.create('Ext.ux.ui.EditPage', {
        block: 'platform_shipping_price',
        gridPage: 'main.html',
        formCfg: {
            model: model,
            fieldDefaults: {
                allowBlank: false,
            },
            items: [
                {
                    xtype: 'hiddenfield',
                    name: '_id',
                    fieldLabel: i18n.getKey('_id'),
                    itemId: '_id',
                },
                {
                    xtype: 'combobox',
                    name: 'clazz',
                    value: JSGetQueryString('clazz'),
                    fieldLabel: i18n.getKey('clazz'),
                    itemId: 'clazz',
                    editable: false,
                    displayField: 'display',
                    valueField: 'value',
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [
                            {
                                display: 'PlatformShippingPriceConfig',
                                value: 'com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig'
                            },
                            {
                                display: 'StorePlatformShippingPriceConfig',
                                value: 'com.qpp.cgp.domain.common.module.StorePlatformShippingPriceConfig'
                            },
                            {
                                display: 'StoreSyncShippingPriceConfig',
                                value: 'com.qpp.cgp.domain.common.module.StoreSyncShippingPriceConfig'
                            },
                            {
                                display: 'WhiteLabelShippingPriceConfig',
                                value: 'com.qpp.cgp.domain.common.module.WhiteLabelShippingPriceConfig'
                            },
                        ]
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('platform'),
                    name: 'platform',
                    itemId: 'platform',
                    editable: false,
                    allowBlank: !Ext.Array.contains(['com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig'], JSGetQueryString('clazz')),
                    displayField: 'display',
                    valueField: 'value',
                    hidden: !Ext.Array.contains(['com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig'], JSGetQueryString('clazz')),
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [
                            {
                                display: 'PS',
                                value: 'PS'
                            },
                        ]
                    }
                },
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('storePlatformCode'),
                    name: 'storePlatformCode',
                    allowBlank: Ext.Array.contains(['com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig',
                        'com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig',
                        'com.qpp.cgp.domain.common.module.WhiteLabelShippingPriceConfig'], JSGetQueryString('clazz')),
                    itemId: 'storePlatformCode',
                    editable: false,
                    hidden: Ext.Array.contains(['com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig',
                        'com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig',
                        'com.qpp.cgp.domain.common.module.WhiteLabelShippingPriceConfig'], JSGetQueryString('clazz')),
                    displayField: 'display',
                    valueField: 'value',
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [
                            {
                                display: 'PS',
                                value: 'PS'
                            },
                        ]
                    }
                },
                {
                    xtype: 'combobox',
                    fieldLabel: i18n.getKey('应用状态'),
                    name: 'applicationMode',
                    itemId: 'applicationMode',
                    editable: false,
                    displayField: 'display',
                    valueField: 'value',
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [
                            {
                                display: 'Stage',
                                value: 'Stage'
                            },
                            {
                                display: 'Production',
                                value: 'Production'
                            },
                        ]
                    }
                },
                //两位小数,
                {
                    xtype: 'combo',
                    fieldLabel: i18n.getKey('折扣方式'),
                    name: 'percentage',
                    itemId: 'percentage',
                    editable: false,
                    displayField: 'display',
                    valueField: 'value',
                    value: true,
                    store: {
                        xtype: 'store',
                        fields: ['value', 'display'],
                        data: [
                            {
                                display: '百分比',
                                value: true
                            },
                            {
                                display: '固定值',
                                value: false
                            },
                        ]
                    }
                },
                {
                    xtype: 'numberfield',
                    fieldLabel: i18n.getKey('discount'),
                    name: 'discount',
                    itemId: 'discount',
                    allowDecimals: true,
                    decimalPrecision: 2,
                    minValue: 0,
                }
            ]
        }
    });
});