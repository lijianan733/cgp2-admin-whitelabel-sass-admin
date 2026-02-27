/**
 * @author xiu
 * @date 2024/12/31
 */
Ext.Loader.syncRequire([
    'CGP.orderstatusmodify.view.orderitemsmultipleaddress.view.singleAddress.splitBarTitle',
    'CGP.currencyconfig.view.CreateEffectDateComp',
    'CGP.currencyconfig.view.CreateExchangeRateListComp',
    'CGP.currencyconfig.store.WebsiteStore'
]);

Ext.define('CGP.currencyconfig.view.CreateCheckEffectConfigPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.createCheckEffectConfigPanel',
    defaults: {
        margin: '20 5 10 60',
        labelWidth: 80
    },
    // model为stage时可选测试汇率套
    diySetValue: function (data) {
        var me = this,
            {
                currencyUsageScopes,
                effectiveTime,
                exchangeRateSet,
                platform,
                description,
                effectiveMode
            } = data,
            description = me.getComponent('description'),
            createEffectDateComp = me.getComponent('createEffectDateComp'),
            createExchangeRateListComp = me.getComponent('createExchangeRateListComp');

        createEffectDateComp.diySetValue({
            effectiveMode,
            effectiveTime,
            expiredTime: null,
            nextEffectiveSettingId: null
        });
        createExchangeRateListComp.diySetValue({
            exchangeRateSet,
            currencyUsageScopes
        });
    },
    initComponent: function () {
        var me = this,
            id = JSGetQueryString('_id'),
            websiteId = JSGetQueryString('websiteId'),
            websiteMode = JSGetQueryString('websiteMode'),
            controller = Ext.create('CGP.currencyconfig.controller.Controller');

        me.tbar = [
            {
                xtype: 'combo',
                name: 'website',
                itemId: 'websiteId',
                width: 260,
                labelWidth: 60,
                margin: '0 0 0 25',
                allowBlank: false,
                fieldLabel: JSCreateFont('#000', true, i18n.getKey('网站'), 14),
                store: Ext.create('CGP.currencyconfig.store.WebsiteStore'),
                valueField: 'id',
                displayField: 'displayField',
                labelAlign: 'right',
                msgTarget: 'side',
                editable: false,
                readOnly: true,
                fieldStyle: 'background-color: silver',
                listeners: {
                    afterrender: function (comp) {
                        comp.setValue(websiteId);
                    },
                    change: function (comp, newValue) {
                        var url = adminPath + `api/platformCurrencySettings/${id}`;
                        JSSetLoading(true);
                        setTimeout(() => {
                            var data = controller.getQuery(url);
                            me.diySetValue(data);
                            JSSetLoading(false);
                        }, 1000)
                    }
                }
            },
            {
                xtype: 'button',
                text: '刷新',
                margin: '0 0 0 20',
                iconCls: 'icon_refresh',
                handler: function () {
                    location.reload();
                }
            }
        ];

        me.items = [
            {
                xtype: 'splitBarTitle',
                margin: '30 0 6 0',
                title: JSCreateFont('#000', true, i18n.getKey('货币&汇率：'), 16),
                addButton: [
                    {
                        xtype: 'button',
                        itemId: 'createCurrency',
                        iconCls: 'icon_edit',
                        text: JSCreateFont('#666', true, i18n.getKey('编辑'), 13),
                        margin: '0 0 0 710',
                        width: 80,
                        height: 30,
                        handler: function (btn) {
                            JSOpen({
                                id: 'edit_currencyconfig',
                                url: path + `partials/currencyconfig/edit.html` +
                                    `?_id=${id}&type=edit&websiteId=${websiteId}&websiteMode=${websiteMode}`,
                                refresh: true,
                                title: i18n.getKey('创建_货币汇率配置')
                            });
                        }
                    },
                    {
                        xtype: 'button',
                        itemId: 'checkMoreCurrency',
                        iconCls: 'icon_query',
                        text: JSCreateFont('#666', true, i18n.getKey('查看更多货币&汇率配置'), 13),
                        margin: '0 0 0 20',
                        width: 180,
                        height: 30,
                        handler: function (btn) {
                            JSOpen({
                                id: 'currencyconfig',
                                url: path + `partials/currencyconfig/main.html`
                                    + `?websiteId=${websiteId}&websiteMode=${websiteMode}`,
                                refresh: true,
                                title: i18n.getKey('货币汇率配置')
                            });
                        }
                    },
                ]
            },
            {
                xtype: 'createEffectDateComp',
                itemId: 'createEffectDateComp'
            },
            {
                xtype: 'createExchangeRateListComp',
                itemId: 'createExchangeRateListComp',
                readOnly: true,
                width: '100%',
            },
        ]

        me.callParent();
    },
})