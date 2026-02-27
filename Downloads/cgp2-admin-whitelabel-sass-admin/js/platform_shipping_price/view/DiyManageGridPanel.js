/*
Created by nan on 2025/05/1
*/
Ext.Loader.syncRequire([
    'CGP.common.commoncomp.ManageGrid',
    'CGP.platform_shipping_price.model.PlatformShippingPriceModel',
    'CGP.platform_shipping_price.model.StorePlatformShippingPriceModel',
    'CGP.platform_shipping_price.model.StoreSyncShippingPriceModel',
    'CGP.platform_shipping_price.model.WhiteLabelShippingPriceModel',
])
Ext.define("CGP.platform_shipping_price.view.DiyManageGridPanel", {
    extend: 'CGP.common.commoncomp.ManageGrid',
    alias: 'widget.diy_manage_grid_panel',
    clazz: 'com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig',
    initComponent: function () {
        var me = this;
        var clazz = me.clazz;
        var mapping = {
            'com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig': 'CGP.platform_shipping_price.model.PlatformShippingPriceModel',
            'com.qpp.cgp.domain.common.module.StorePlatformShippingPriceConfig': 'CGP.platform_shipping_price.model.StorePlatformShippingPriceModel',
            'com.qpp.cgp.domain.common.module.StoreSyncShippingPriceConfig': 'CGP.platform_shipping_price.model.StoreSyncShippingPriceModel',
            'com.qpp.cgp.domain.common.module.WhiteLabelShippingPriceConfig': 'CGP.platform_shipping_price.model.WhiteLabelShippingPriceModel',
        };
        var mapping2 = {
            'com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig': 'api/platformShippingPriceConfigs',
            'com.qpp.cgp.domain.common.module.StorePlatformShippingPriceConfig': 'api/storePlatformShippingPriceConfigs',
            'com.qpp.cgp.domain.common.module.StoreSyncShippingPriceConfig': 'api/storeSyncShippingPriceConfigs',
            'com.qpp.cgp.domain.common.module.WhiteLabelShippingPriceConfig': 'api/whiteLabelShippingPriceConfigs',
        };
        var model = mapping[clazz];
        var url = mapping2[clazz];
        var store = Ext.create('Ext.data.Store', {
            model: model,
            pageSize: 25,
            proxy: {
                type: 'uxrest',
                url: adminPath + url,
                reader: {
                    type: 'json',
                    root: 'data.content'
                }
            },
            sorters: {property: '_id', direction: 'DESC'},
            autoLoad: true,
        });
        me.title = me.clazz.split('.').pop();
        me.config.filterCfg = {
            height: 120,
            layout: {
                type: 'table',
                columns: 2
            },
            defaults: {
                isLike: false
            },
            items: [
                {
                    xtype: 'textfield',
                    name: '_id',
                    itemId: 'id',
                    fieldLabel: i18n.getKey('id'),
                },
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('platform'),
                    name: 'platform',
                    itemId: 'platform',
                    hidden: !Ext.Array.contains(['com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig'], me.clazz),
                    editable: false,

                },
                {
                    xtype: 'textfield',
                    fieldLabel: i18n.getKey('storePlatform Code'),
                    name: 'storePlatformCode',
                    itemId: 'storePlatformCode',
                    hidden: Ext.Array.contains(['com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig',
                        'com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig',
                        'com.qpp.cgp.domain.common.module.WhiteLabelShippingPriceConfig'], me.clazz),
                    editable: false,
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

                }
            ]
        };
        me.config.gridCfg = {
            editAction: true,
            deleteAction: true,
            store: store,
            editActionHandler: function (gridView, rowIndex, colIndex, a, b, record) {//编辑按钮的映射
                var clazz = record.get('clazz');
                var id = record.get('_id');
                JSOpen({
                    id: 'platform_shipping_price_' + clazz.split('.').pop(),
                    url: path + `partials/platform_shipping_price/edit.html?id=${id}&clazz=${clazz}`,
                    title: `编辑_${clazz.split('.').pop()}(${id})`,
                    refresh: true
                });
            },
            tbar: {
                btnCreate: {
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt;
                        var clazz = grid.ownerCt.clazz;
                        JSOpen({
                            id: 'platform_shipping_price_' + clazz.split('.').pop(),
                            url: path + `partials/platform_shipping_price/edit.html?clazz=${clazz}`,
                            title: `新建_${clazz.split('.').pop()}`,
                            refresh: true
                        });
                    }
                },
                btnConfig: {
                    hidden: false,
                    disabled: false,
                    handler: function () {

                    }
                }
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                },
                {
                    text: i18n.getKey('platform'),
                    dataIndex: 'platform',
                    hidden: !Ext.Array.contains(['com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig'], me.clazz),
                    renderer: function (value, metaData, record) {
                        return value;

                    }
                },
                {
                    text: i18n.getKey('storePlatformCode'),
                    dataIndex: 'storePlatformCode',
                    width: 150,
                    hidden: Ext.Array.contains(['com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig',
                        'com.qpp.cgp.domain.common.module.PlatformShippingPriceConfig',
                        'com.qpp.cgp.domain.common.module.WhiteLabelShippingPriceConfig'], me.clazz),
                    renderer: function (value, metaData, record) {
                        return value;
                    }
                },
                {
                    text: i18n.getKey('折扣方式'),
                    dataIndex: 'percentage',
                    renderer: function (value) {
                        if (value == true) {
                            return `百分比`;
                        } else {
                            return `固定值`;
                        }
                    }
                },
                {
                    text: i18n.getKey('discount'),
                    dataIndex: 'discount',
                    renderer: function (value, metaData, record) {
                        var percentage = record.get('percentage');
                        if (percentage == true) {
                            return value + '%';
                        } else {
                            return value;
                        }
                    }
                },
                {
                    text: i18n.getKey('应用状态'),
                    dataIndex: 'applicationMode',
                    flex: 1,
                },
            ]
        };
        me.callParent();
    }
})