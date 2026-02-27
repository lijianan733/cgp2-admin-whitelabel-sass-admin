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

Ext.define('CGP.currencyconfig.view.CreateMainPanel', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.createMainPanel',
    defaults: {
        margin: '20 5 10 60',
        labelWidth: 80
    },
    autoScroll: true,
    // model为stage时可选测试汇率套
    diySetValue: function (data) {
        var me = this,
            {
                platform,
                exchangeRateSet,
                currencyUsageScopes,
                effectiveTime,
                expiredTime,
                nextEffectiveSettingId
            } = data,
            {defaultCurrency} = platform,
            defaultCurrencyComp = me.getComponent('defaultCurrency'),
            createEffectDateComp = me.getComponent('createEffectDateComp'),
            createExchangeRateListComp = me.getComponent('createExchangeRateListComp');

        defaultCurrencyComp.setValue(defaultCurrency);

        createExchangeRateListComp.diySetValue({
            exchangeRateSet,
            currencyUsageScopes
        });

        //存在nextEffectiveSettingId(即将生效的配置)时 切换时间显示模式 [不存在(one) 存在(two) 编辑(three)]
        createEffectDateComp.setShowType(nextEffectiveSettingId ? 'two' : 'one');

        createEffectDateComp.diySetValue({
            effectiveTime,
            expiredTime,
            nextEffectiveSettingId
        });
    },
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.currencyconfig.controller.Controller');

        me.tbar = [
            {
                xtype: 'combo',
                name: 'website',
                itemId: 'websiteId',
                margin: '0 0 0 25',
                width: 260,
                fieldLabel: JSCreateFont('#000', true, i18n.getKey('网站'), 14),
                store: Ext.create('CGP.currencyconfig.store.WebsiteStore'),
                valueField: 'id',
                displayField: 'displayField',
                labelAlign: 'right',
                msgTarget: 'side',
                editable: false,
                labelWidth: 60,
                listeners: {
                    afterrender: function (comp) {
                        comp.setValue('236781096');
                    },
                    change: function (comp, newValue) {
                        var url = adminPath + `api/platformCurrencySettings/platform/${newValue}`;
                        JSSetLoading(true);
                        setTimeout(() => {
                            var data = controller.getQuery(url);
                            JSSetLoading(false);
                            me.websiteId = newValue;
                            me.websiteMode = data['platform']['mode'];
                            me.diySetValue(data)
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
            },
        ];

        me.items = [
            {
                xtype: 'textfield',
                fieldStyle: 'background-color: silver',
                readOnly: true,
                itemId: 'defaultCurrency',
                fieldLabel: JSCreateFont('#000', true, i18n.getKey('默认货币'), 16),
                value: 'USD'
            },
            {
                xtype: 'splitBarTitle',
                margin: '30 0 6 0',
                title: JSCreateFont('#000', true, i18n.getKey('货币&汇率：'), 16),
                addButton: [
                    {
                        xtype: 'button',
                        itemId: 'createCurrency',
                        iconCls: 'icon_create',
                        text: JSCreateFont('#666', true, i18n.getKey('新增货币&汇率配置'), 13),
                        margin: '0 0 0 630',
                        width: 160,
                        height: 30,
                        handler: function (btn) {
                            JSOpen({
                                id: 'edit_currencyconfig',
                                url: path + `partials/currencyconfig/edit.html` +
                                    `?type=create&websiteId=${me.websiteId}&websiteMode=${me.websiteMode}`,
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
                                id: 'check_currencyconfig',
                                url: path + `partials/currencyconfig/main.html`
                                    + `?websiteId=${me.websiteId}&websiteMode=${me.websiteMode}`,
                                refresh: true,
                                title: i18n.getKey('货币汇率配置')
                            });
                        }
                    },
                ],
            },
            {
                xtype: 'createEffectDateComp',
                itemId: 'createEffectDateComp',
                topComp: me,
            },
            {
                xtype: 'createExchangeRateListComp',
                itemId: 'createExchangeRateListComp',
                readOnly: true,
                width: '95%',
            },
        ]

        me.callParent();
    },
})