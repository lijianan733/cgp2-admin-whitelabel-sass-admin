Ext.define("CGP.product.view.pricingStrategyv2.controller.Edit", {
    url: '',
    constructor: function (config) {
        var me = this;

        me.callParent(arguments);
    },
//    strategyTypeWindow:function(tabPanel,id){
//
//    },
    /*
    *
    * */
    openStrategyWindow: function (tabPanel, id) {
        var me = this;
        var method = 'get', url = adminPath + 'api/pricingstrategies/' + id;
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    var strategyModel = Ext.create('CGP.product.view.pricingStrategyv2.model.PricingStrategy', resp.data);
                    var strategyType = strategyModel.data['strategyType'];
                    var title = i18n.getKey('edit') + i18n.getKey('pricingStrategy') + '(' + id + ')';
                    me.createStrategy(tabPanel, id, strategyType, title, strategyModel);

                } else {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            },
            callback: function () {

            }
        });
    },
    strategyTypeWindow: function (tabPanel, id) {
        var me = this;
        var strategyStore = Ext.create('Ext.data.Store', {
            fields: ['value', 'displayName'],
            data: [
                {
                    "value": "com.qpp.cgp.domain.pricing.configuration.SimpleQtyTablePricingSetting",
                    "displayName": i18n.getKey('simple') + i18n.getKey('pricingStrategy')
                },
                {
                    "value": "com.qpp.cgp.domain.pricing.configuration.AdditionQtyTablePricingSetting",
                    "displayName": i18n.getKey('addition') + i18n.getKey('pricingStrategy')
                }
            ]
        });
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('pricingStrategy') + i18n.getKey('type'),
            itemId: 'strategyTypeWindow',
            bodyPadding: 10,
            width: 400,
            height: 160,
            items: [
                {
                    xtype: 'combo',
                    itemId: 'strategyType',
                    name: 'strategyType',
                    fieldLabel: i18n.getKey('type'),
                    store: strategyStore,
                    queryMode: 'local',
                    displayField: 'displayName',
                    valueField: 'value',
                    allowBlank: false,
                    value: 'com.qpp.cgp.domain.pricing.configuration.SimpleQtyTablePricingSetting',
                    labelAlign: 'right',
                    width: 300
                }
            ],
            bbar: ['->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var wid = btn.ownerCt.ownerCt, strategyType = wid.getComponent('strategyType').getValue();
                        var title = i18n.getKey('create') + i18n.getKey('pricingStrategy');
                        wid.close();
                        me.createStrategy(tabPanel, id, strategyType, title);
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        btn.ownerCt.ownerCt.close();
                    }
                }]
        }).show();
    },

    createStrategy: function (tabPanel, id, strategyType, title, strategyModel) {
        var clazzName = 'CGP.product.view.pricingStrategyv2.view.PricingStrategyEdit';
        if (strategyType == 'com.qpp.cgp.domain.pricing.configuration.AdditionQtyTablePricingSetting') {
            clazzName = 'CGP.product.view.pricingStrategyv2.view.AdditionTableEdit';
        }
        var pricingStrategy = Ext.create(clazzName, {
            itemId: 'pricingStrategy',
            title: title,
            closable: true,
            strategyId: id,
            tabPanel: tabPanel
        });
        tabPanel.remove('pricingStrategy');
        tabPanel.add(pricingStrategy);
        tabPanel.setActiveTab(pricingStrategy.itemId);
    },
    save: function (data) {
        var method = 'POST', url = me.url;
        if (!Ext.isEmpty(data._id) && data._id != 0) {
            method = 'PUT';
            url = url + "/" + data._id;
        } else {
            data._id = JSGetCommonKey();
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveSuccess'));
                } else {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            },
            callback: function () {

            }
        });
    },

    conditionWind: function (productId, data) {
        var win = Ext.create("Ext.window.Window", {
            itemId: "conditionWind",
            title: i18n.getKey('condition'),
            modal: true,
            bodyPadding: 10,
            width: 600,
            height: 400,
            layout: 'fit',
            items: [
                Ext.create('CGP.product.view.pricingStrategyv2.view.ConditionComp', {
                    productId: productId,
                    strategyId: data._id,
                    parameterTypes: [
                        {
                            boxLabel: i18n.getKey('attribute'),
                            name: 'parameterType',
                            inputValue: 'attribute',
                            checked: true
                        },
                        {
                            boxLabel: 'Qty',
                            name: 'parameterType',
                            inputValue: 'Qty'
                        }
                    ]
                })
            ],
            bbar: ['->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var wind = btn.ownerCt.ownerCt;
                        var conditionComp = wind.getComponent('conditioncomp');
                        if (conditionComp.isValid()) {
                            var strategyData = conditionComp.getValue();
                            var strategyController = Ext.create('CGP.product.view.pricingStrategyv2.controller.PricingStrategy');
                            strategyController.save(strategyData);
                        }
                        wind.close();

                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        btn.ownerCt.ownerCt.close();
                    }
                }]
        });
        win.show();
    }
});