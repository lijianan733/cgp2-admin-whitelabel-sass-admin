/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.Loader.syncRequire([
    'CGP.profitmanagement.view.CreateQueryAccountInfoComp',
])
Ext.define('CGP.profitmanagement.view.CreatePartnerProfitInfo', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.partner_profit_info',
    layout: 'fit',
    params: null,
    getPartnerIdEmail: function () {
        var url = adminPath + 'api/partners?page=1&limit=25&sort=[{"property":"createdDate","direction":"DESC"}]',
            controller = Ext.create('CGP.profitmanagement.controller.Controller'),
            partnerId = JSGetQueryString('partnerId'),
            partnerEmail = JSGetQueryString('partnerEmail'),
            result = {
                partnerId: partnerId,
                partnerEmail: partnerEmail,
            }

        if (!partnerId) {
            var firstPartner = controller.getQuery(url)[0],
                {id, email} = firstPartner;

            result = {
                partnerId: id,
                partnerEmail: email,
            }
        }

        return result
    },
    getAccountInfo: function () {
        var me = this,
            controller = Ext.create('CGP.profitmanagement.controller.Controller'),
            {partnerId, partnerEmail} = me.getPartnerIdEmail(),
            url = adminPath + `api/${partnerId}/balance/overview`,
            getData = controller.getQuery(url),
            result = {
                currency: {
                    symbolLeft: ''
                },
                amount: 0,
                waitTransferBalance: 0
            }

        if (getData) {
            result = getData;
        } else {
            Ext.Msg.alert('提示', '未获取到该Partner的盈余详情信息!');
        }

        return result;
    },
    setAccountInfo: function (data) {
        var me = this,
            form = me.getComponent('form'),
            controller = Ext.create('CGP.profitmanagement.controller.Controller'),
            queryAccountInfo = form.getComponent('queryAccountInfo');

        if (data) {
            var {currency, amount, waitTransferBalance} = data,
                {code, symbol, symbolLeft} = currency,
                remark = form.getComponent('remark'),
                accountTotalProfit = form.getComponent('accountTotalProfit'),
                currencyCodeSymbolLeft = `${symbolLeft}`,
                {nowYear, nowMonth} = controller.getCurrentYearAndMonth(),
                {year, month} = controller.getLastNowYearMonth(nowYear, nowMonth, 1),
                newWaitTransferBalance = waitTransferBalance ? waitTransferBalance.toFixed(2) : waitTransferBalance,
                newAmount = amount ? amount.toFixed(2) : amount,
                {partnerId, partnerEmail} = me.getPartnerIdEmail(),
                {settleDays} = controller.getPartnerLimitationData(partnerId),
                remarkParams = {
                    currencyCode: currencyCodeSymbolLeft, //货币
                    minProfit: '100', //最小盈余
                    handlingCharge: '3%', //手续费
                    signatureCoolingData: `${settleDays}日` //签收冷却
                },
                accountTotalParams = {
                    amountText: `${currencyCodeSymbolLeft} ${newAmount}`,
                    nextSquareDate: `下个结算日期将在${year}年${month}月01日`,
                    getMoneyText: `回款金额: ${JSCreateFont('green', true, `${currencyCodeSymbolLeft} ${newWaitTransferBalance}`, 20)}`,
                }

            me.params = {
                amount,
                symbolLeft,
                waitTransferBalance
            };
            remark.diySetValue(remarkParams);
            accountTotalProfit.diySetValue(accountTotalParams);
        } else {
            queryAccountInfo.setDisabledBtn(true);
            Ext.Msg.alert('提示', '未获取到该Partner的总盈余信息!');
        }
    },
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.profitmanagement.controller.Controller'),
            {config, test} = Ext.create('CGP.profitmanagement.defaults.OnlineshopmanagementDefaults'),
            {partnerId, partnerEmail} = me.getPartnerIdEmail(),
            {partner_profit_info} = config,
            {columnsText, filtersText} = partner_profit_info,
            columns = controller.getColumnsType(columnsText),
            filters = controller.getFiltersType(filtersText);

        me.store = Ext.create('CGP.profitmanagement.store.CreatePartnerProfitInfoStore', {
            partnerId: partnerId
        });

        me.tbar = {
            defaults: {
                margin: '0 10 0 10',
            },
            setPartnerInfo: function (data) {
                if (data) {
                    var me = this,
                        {email, id} = data,
                        partnerId = me.getComponent('partnerId'),
                        partnerEmail = me.getComponent('partnerEmail');

                    partnerId.setValue(id);
                    partnerEmail.setValue(email);
                }
            },
            items: [
                {
                    xtype: 'displayfield',
                    name: 'partnerId',
                    itemId: 'partnerId',
                    fieldLabel: i18n.getKey('Partner ID'),
                    margin: '0 20 0 25',
                    labelWidth: 80,
                    value: partnerId,
                },
                {
                    xtype: 'displayfield',
                    name: 'partnerEmail',
                    itemId: 'partnerEmail',
                    fieldLabel: i18n.getKey('邮箱'),
                    labelWidth: 40,
                    margin: '0 40 0 5',
                    value: partnerEmail,
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('切换Partner'),
                    iconCls: 'icon_refresh',
                    width: 120,
                    handler: function (btn) {
                        var tools = btn.ownerCt;
                        controller.createChangePartnerWindow(null, function (selectData) {
                            var record = selectData[0],
                                partnerId = record.get('id'),
                                partnerEmail = record.get('email');

                            // tools.setPartnerInfo(record.data);
                            JSOpen({
                                id: 'partner_profit_infopage',
                                title: i18n.getKey('Partner盈余详情'),
                                url: path + 'partials/profitmanagement/partner_profit_info.html' +
                                    '?partnerId=' + partnerId +
                                    '&partnerEmail=' + partnerEmail,
                                refresh: true
                            })
                        });
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('查看总览'),
                    iconCls: 'icon_check',
                    width: 120,
                    handler: function (btn) {
                        var partnerId = JSGetQueryString('partnerId'),
                            partnerEmail = JSGetQueryString('partnerEmail');

                        JSOpen({
                            id: 'partner_profit_checkpage',
                            title: i18n.getKey('Partner盈余总览'),
                            url: path + 'partials/profitmanagement/partner_profit_check.html' +
                                '?partnerId=' + partnerId +
                                '&partnerEmail=' + partnerEmail,
                            refresh: true
                        })
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('刷新'),
                    iconCls: 'icon_refresh',
                    handler: function (btn) {
                        var partnerId = JSGetQueryString('partnerId'),
                            partnerEmail = JSGetQueryString('partnerEmail');

                        JSOpen({
                            id: 'partner_profit_infopage',
                            title: i18n.getKey('Partner盈余详情'),
                            url: path + 'partials/profitmanagement/partner_profit_info.html' +
                                '?partnerId=' + partnerId +
                                '&partnerEmail=' + partnerEmail,
                            refresh: true
                        })
                    }
                },
            ]
        }

        me.items = [
            {
                xtype: 'errorstrickform',
                itemId: 'form',
                defaults: {
                    margin: '10 25 5 25',
                    width: 350,
                    allowBlank: true,
                },
                items: [
                    {
                        xtype: 'displayfield',
                        name: 'accountTotalProfit',
                        itemId: 'accountTotalProfit',
                        hideTrigger: true,
                        labelWidth: 100,
                        margin: '20 25 5 25',
                        fieldLabel: JSCreateFont('#000', false, i18n.getKey('账户总盈余'), 18),
                        width: '100%',
                        diySetValue: function (data) {
                            if (data) {
                                var me = this,
                                    {amountText, nextSquareDate, getMoneyText} = data,
                                    result = `${amountText} (${nextSquareDate}, ${getMoneyText})`;

                                me.setValue(JSCreateFont('#000', true, result, 18));
                            }
                        },
                    },
                    {
                        xtype: 'displayfield',
                        name: 'remark',
                        itemId: 'remark',
                        hideTrigger: true,
                        labelWidth: 120,
                        width: '100%',
                        diySetValue: function (data) {
                            if (data) {
                                var me = this,
                                    {currencyCode, minProfit, handlingCharge, signatureCoolingData} = data,
                                    result = `  账户盈余需要超过${currencyCode} ${minProfit}，才可以提现;提现会收取${handlingCharge}的手续费,盈余金额一般会在C端客人签收后${signatureCoolingData}后到账（每月1日对到货满${signatureCoolingData}的订单进行结算）。` +
                                        `<br>比如若设置为30天结算,客户2025年02月01日签收,满30天后（2025年03月03日）纳入2025年03月进行结算,在2025年04月01日收到回款。`;

                                me.setValue(result);
                            }
                        },
                        listeners: {
                            afterrender: function (comp) {
                                var {settleDays} = controller.getPartnerLimitationData(partnerId);
                                comp.diySetValue({
                                    currencyCode: `US$`, //货币
                                    minProfit: '100', //最小盈余
                                    handlingCharge: '3%', //手续费
                                    signatureCoolingData: `${settleDays}日` //签收冷却
                                })
                            }
                        }
                    },
                    {
                        xtype: 'create_query_account_info_comp',
                        name: 'queryAccountInfo',
                        itemId: 'queryAccountInfo',
                        margin: '30 25 5 25',
                        width: 1200,
                    },
                    {
                        xtype: 'searchcontainer',
                        itemId: 'grid',
                        width: '100%',
                        diySetNewStoreUrl: function (params, comp) {
                            var {type, beforeDays} = params,
                                store = comp.grid.store,
                                filter = []

                            if (!!type) {
                                filter.push({
                                    name: 'type',
                                    value: type,
                                    type: 'string'
                                })
                            }

                            if (!!beforeDays) {
                                filter.push({
                                    name: 'beforeDays',
                                    value: beforeDays,
                                    type: 'number'
                                })
                            }

                            store.proxy.extraParams = {
                                filter: Ext.JSON.encode(filter)
                            }
                        },
                        gridCfg: {
                            store: me.store,
                            selModel: {
                                selType: 'rowmodel',
                            },
                            customPaging: [
                                {value: 25},
                                {value: 50},
                                {value: 75},
                                {value: 150},
                            ],
                            deleteAction: false,
                            editAction: false,
                            columns: columns,
                        },
                        filterCfg: {
                            hidden: true,
                            header: false,
                        },
                        listeners: {
                            afterrender: function (comp) {
                                var form = comp.ownerCt,
                                    accountTotalProfit = form.getComponent('accountTotalProfit'),
                                    grid = comp.grid,
                                    store = grid.store,
                                    {currency, amount, waitTransferBalance} = me.getAccountInfo(),
                                    {code, symbol, symbolLeft} = currency,
                                    currencyCodeSymbolLeft = `${symbolLeft}`,
                                    {nowYear, nowMonth} = controller.getCurrentYearAndMonth(),
                                    {year, month} = controller.getLastNowYearMonth(nowYear, nowMonth, 1),
                                    newWaitTransferBalance = waitTransferBalance ? waitTransferBalance.toFixed(2) : waitTransferBalance,
                                    newAmount = amount ? amount.toFixed(2) : amount,
                                    result = {
                                        amountText: `${currencyCodeSymbolLeft} ${newAmount}`,
                                        nextSquareDate: `下个结算日期将在${year}年${month}月01日`,
                                        getMoneyText: `回款金额: ${JSCreateFont('green', true, `${currencyCodeSymbolLeft} ${newWaitTransferBalance}`, 20)}`,
                                    }

                                // 同步更新数据
                                store.on('load', function () {
                                    accountTotalProfit.diySetValue(result);
                                })
                            }
                        }
                    }
                ]
            }
        ];
        me.callParent();
        me.on('afterrender', function (comp) {
            me.setAccountInfo(me.getAccountInfo());
        })
    },
})