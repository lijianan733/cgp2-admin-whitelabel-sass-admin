Ext.Loader.syncRequire([
    'CGP.partner.view.popStoreRestrict.createWriteLimitComp',
])
Ext.define('CGP.partner.view.popStoreRestrict.popStoreRestrict', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.pop_store_restrict',
    layout: 'fit',
    partnersLimitationId: null,
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.partner.controller.Controller'),
            data = me.getRenderData();

        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function (btn) {
                    var me = btn.ownerCt.ownerCt,
                        form = me.getComponent('form'),
                        url = adminPath + 'api/partner/popup/store/limitation', //杜成伟
                        {
                            partnerId,
                            limitContainer,
                            paymentPeriod,
                            productLimitContainer,
                            productPriceLimitContainer
                        } = me.getValue(),
                        result = {
                            partnerId: partnerId,
                            popupStoreLimitation: {
                                maxStoreQty: limitContainer,
                                maxProductQty: productLimitContainer,
                                maxProductPriceTimes: productPriceLimitContainer,
                                settleDays: paymentPeriod
                            }
                        }

                    if (form.isValid()) {
                        me.partnersLimitationId && (result['_id'] = me.partnersLimitationId);
                        controller.asyncEditQuery(url, result, true, function (require, success, response) {
                            if (success) {
                                var responseText = Ext.JSON.decode(response.responseText);
                                if (responseText.success) {
                                    const data = responseText.data;
                                    console.log(data);
                                }
                            }
                        })
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function (btn) {
                    var tabs = top.Ext.getCmp('tabs'),
                        panel = tabs.getActiveTab();
                    tabs.remove(panel);
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('reresh'),
                iconCls: 'icon_refresh',
                handler: function (btn) {
                    location.reload();
                }
            },

        ]
        me.items = [
            {
                xtype: 'errorstrickform',
                itemId: 'form',
                defaults: {
                    margin: '30 25 5 25',
                    width: '90%',
                    allowBlank: true,
                    defaults: {
                        margin: 0,
                    },
                },
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: i18n.getKey('Partner ID'),
                        margin: '10 0 0 25',
                        name: 'partnerId',
                        itemId: 'partnerId',
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: i18n.getKey('Partner Email'),
                        margin: '0 0 0 25',
                        name: 'partnerEmail',
                        itemId: 'partnerEmail',
                    },
                    {
                        xtype: 'write_limit_comp',
                        name: 'limitContainer',
                        itemId: 'limitContainer',
                        title: 'Pop-up Store上限',
                    },
                    {
                        xtype: 'write_limit_comp',
                        name: 'productLimitContainer',
                        itemId: 'productLimitContainer',
                        title: 'Pop-up Store产品上限',
                    },
                    {
                        xtype: 'write_limit_comp',
                        name: 'productPriceLimitContainer',
                        itemId: 'productPriceLimitContainer',
                        title: 'Pop-up Store产品价格上限',
                    },
                    {
                        xtype: 'write_limit_comp',
                        name: 'paymentPeriod',
                        itemId: 'paymentPeriod',
                        title: '回款周期',
                    }
                ]
            }
        ];
        me.callParent();
        me.on('afterrender', function (comp) {
            comp.setValue(data);
        })
    },
    getValue: function () {
        var me = this,
            form = me.getComponent('form');
        return form.getValue();
    },
    setValue: function (data) {
        if (data) {
            var me = this,
                form = me.getComponent('form'),
                items = form.items.items;

            items.forEach(item => {
                var {name} = item;
                item.diySetValue ? item.diySetValue(data[name]) : item.setValue(data[name]);
            })
        }
    },
    // 获取默认限制
    getDefaultLimitation: function () {
        var controller = Ext.create('CGP.orderitemsmultipleaddress.controller.Controller'),
            url = adminPath + 'api/global/popup/store/limitation/default',
            result = controller.getQuery(url),
            {popupStoreLimitation} = result
        
        /*result = {
            maxStoreQty: 50,
            maxProductQty: 50,
            maxProductPriceTimes: 50,
            settleDays: 50,
        }*/
        // result = null

        if (!popupStoreLimitation) {
            Ext.Msg.alert('提示', '未获取到限制默认值!')
        }

        return popupStoreLimitation;
    },
    // 获取partner限制
    getPartnersLimitation: function (partnerId) {
        var me = this,
            controller = Ext.create('CGP.orderitemsmultipleaddress.controller.Controller'),
            url = adminPath + `api/partner/popup/store/limitation/partners/${partnerId}`,
            result = controller.getQuery(url);
            
        /*result = {
            _id: '123444',
            partnerId: 'partnerId',
            maxStoreQty: 70,
            maxProductQty: 70,
            maxProductPriceTimes: 70,
            settleDays: 70,
            currentPartnerStoreCount: 5,
            allStoreCount: 100,
        }
        result = null*/


        if (result) {
            me.partnersLimitationId = result['_id'];
        } else {
            Ext.Msg.alert('提示', '未获取到Partner信息!')
        }

        return result;
    },
    // 转换数据格式
    getRenderData: function () {
        var me = this,
            partnerId = JSGetQueryString('partnerId'),
            partnerEmail = JSGetQueryString('partnerEmail'),
            defaultLimitation = me.getDefaultLimitation(),
            result = null,
            partnersLimitation = me.getPartnersLimitation(partnerId);

        if (partnersLimitation) {
            result = {
                partnerId: partnerId,
                partnerEmail: partnerEmail,
                limitContainer: {
                    defaultValue: defaultLimitation['maxStoreQty'],
                    type: partnersLimitation['maxStoreQty'] ? 'custom' : 'default',
                    limit: partnersLimitation['maxStoreQty'],
                    qty: partnersLimitation['allStoreCount'],
                    partnerQty: partnersLimitation['currentPartnerStoreCount']
                },
                productLimitContainer: {
                    defaultValue: defaultLimitation['maxProductQty'],
                    type: partnersLimitation['maxProductQty'] ? 'custom' : 'default',
                    limit: partnersLimitation['maxProductQty'],
                },
                productPriceLimitContainer: {
                    defaultValue: defaultLimitation['maxProductPriceTimes'],
                    type: partnersLimitation['maxProductPriceTimes'] ? 'custom' : 'default',
                    limit: partnersLimitation['maxProductPriceTimes'],
                },
                paymentPeriod: {
                    defaultValue: defaultLimitation['settleDays'],
                    type: partnersLimitation['settleDays'] ? 'custom' : 'default',
                    limit: partnersLimitation['settleDays'],
                    day: 31
                },
            }
        }

        return result;
    },
})