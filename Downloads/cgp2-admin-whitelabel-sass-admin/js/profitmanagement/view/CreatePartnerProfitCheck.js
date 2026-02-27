/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.define('CGP.profitmanagement.view.CreatePartnerProfitCheck', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.partner_profit_check',
    layout: 'fit',
    getPartnerIdEmail: function () {
        var url = adminPath + 'api/partners?page=1&limit=25&sort=[{"property":"createdDate","direction":"DESC"}]',
            controller = Ext.create('CGP.profitmanagement.controller.Controller'),
            partnerId = JSGetQueryString('partnerId'),
            partnerEmail = JSGetQueryString('partnerEmail'),
            result = {
                partnerId: partnerId,
                partnerEmail: partnerEmail,
            }

        if (!partnerId || (partnerId === 'null')) {
            var firstPartner = controller.getQuery(url)[0],
                {id, email} = firstPartner;

            result = {
                partnerId: id,
                partnerEmail: email
            }
        }

        return result
    },
    getAccountInfo: function () {
        var me = this,
            controller = Ext.create('CGP.profitmanagement.controller.Controller'),
            {partnerId, partnerEmail} = me.getPartnerIdEmail(),
            url = adminPath + `api/${partnerId}/balance/overview`,
            getData = controller.getQuery(url);

        return getData;
    },
    setAccountInfo: function (data) {
        var me = this,
            isHideMsg = JSGetQueryString('isHideMsg') === 'true'
        if (data) {
            var controller = Ext.create('CGP.profitmanagement.controller.Controller'),
                form = me.getComponent('form'),
                {currency, amount, waitTransferBalance} = data,
                {partnerId, partnerEmail} = me.getPartnerIdEmail(),
                {code, symbol, symbolLeft} = currency,
                remark = form.getComponent('remark'),
                accountTotalProfit = form.getComponent('accountTotalProfit'),
                currencyCodeSymbolLeft = `${symbolLeft}`,
                {nowYear, nowMonth} = controller.getCurrentYearAndMonth(),
                {year, month} = controller.getLastNowYearMonth(nowYear, nowMonth, 1),
                newWaitTransferBalance = waitTransferBalance ? waitTransferBalance.toFixed(2) : waitTransferBalance,
                newAmount = amount ? amount.toFixed(2) : amount,
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

            remark.diySetValue(remarkParams);
            accountTotalProfit.diySetValue(accountTotalParams);
        } else {
            !isHideMsg && Ext.Msg.alert('提示', '未获取到该Partner的总盈余信息!');
        }
    },
    initComponent: function () {
        var me = this,
            controller = Ext.create('CGP.profitmanagement.controller.Controller'),
            {config, test} = Ext.create('CGP.profitmanagement.defaults.OnlineshopmanagementDefaults'),
            {partnerId, partnerEmail} = me.getPartnerIdEmail(),
            {partner_profit_check} = config,
            {columnsText, filtersText} = partner_profit_check,
            columns = controller.getColumnsType(columnsText);

        me.store = Ext.create('CGP.profitmanagement.store.CreatePartnerProfitCheckStore', {
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
                                id: 'partner_profit_checkpage',
                                title: i18n.getKey('Partner盈余总览'),
                                url: path + 'partials/profitmanagement/partner_profit_check.html' +
                                    '?partnerId=' + partnerId +
                                    '&partnerEmail=' + partnerEmail,
                                refresh: true
                            })
                        });
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('查看盈余详情'),
                    iconCls: 'icon_check',
                    width: 120,
                    handler: function (btn) {
                        JSOpen({
                            id: "partner_profit_infopage",
                            url: path + 'partials/profitmanagement/partner_profit_info.html' +
                                '?partnerId=' + partnerId +
                                '&partnerEmail=' + partnerEmail,
                            title: i18n.getKey('Partner盈余详情'),
                            refresh: true
                        });
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('刷新'),
                    iconCls: 'icon_refresh',
                    handler: function (btn) {
                        var partnerId = JSGetQueryString('partnerId'),
                            partnerEmail = JSGetQueryString('partnerEmail'),
                            isHideMsg = JSGetQueryString('isHideMsg') === 'true';

                        JSOpen({
                            id: 'partner_profit_checkpage',
                            title: i18n.getKey('Partner盈余总览'),
                            url: path + 'partials/profitmanagement/partner_profit_check.html' +
                                '?partnerId=' + partnerId +
                                '&partnerEmail=' + partnerEmail +
                                '&isHideMsg=' + isHideMsg,
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
                        width: '90%',
                        diySetValue: function (data) {
                            if (data) {
                                var me = this,
                                    {currencyCode, minProfit, handlingCharge, signatureCoolingData} = data,
                                    result = `  账户盈余需要超过${currencyCode} ${minProfit}，才可以提现;提现会收取${handlingCharge}的手续费,盈余金额一般会在C端客人签收后${signatureCoolingData}后到账（每月1日对到货满${signatureCoolingData}的订单进行结算）。` +
                                        `<br>比如客户2025年02月01日签收,客户2025年02月01日签收,满30天后（2025年03月03日）纳入2025年03月进行结算,在2025年04月01日收到回款。`;

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
                        xtype: 'searchcontainer',
                        itemId: 'grid',
                        margin: '30 25 5 25',
                        width: '90%',
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