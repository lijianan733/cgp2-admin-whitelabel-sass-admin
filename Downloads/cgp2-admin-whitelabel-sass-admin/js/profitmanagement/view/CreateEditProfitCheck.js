/**
 * @author xiu
 * @date 2025/2/24
 */
Ext.define('CGP.profitmanagement.view.CreateEditProfitCheck', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.edit_profit_check',
    layout: 'fit',
    getAccountInfo: function (partnerId) {
        var me = this,
            controller = Ext.create('CGP.profitmanagement.controller.Controller'),
            url = adminPath + `api/${partnerId}/balance/overview`,
            getData = controller.getQuery(url);

        return getData;
    },
    // 要改获取信息
    setEditProfitInfo: function () {
        var me = this,
            controller = Ext.create('CGP.profitmanagement.controller.Controller'),
            year = +JSGetQueryString('year'),
            month = +JSGetQueryString('month'),
            amount = JSGetQueryString('amount'),
            partnerId = JSGetQueryString('partnerId'),
            partnerEmail = JSGetQueryString('partnerEmail'),
            waitTransferBalance = JSGetQueryString('waitTransferBalance'),
            settleDate = controller.getLastNowYearMonth(year, month, 0),
            url = adminPath + `api/${year}/${month}/balance?page=1&limit=25`,
            getData = controller.getQuery(url)[0],
            partnerLimitationData = me.getAccountInfo(partnerId);

        if (getData) {
            var {currency} = getData;
            me.diySetValue(Ext.Object.merge(getData, {
                partnerId: partnerId,
                partnerEmail: partnerEmail,
                nowUsableMoney: partnerLimitationData?.waitTransferBalance,
                newUsableMoney: partnerLimitationData?.waitTransferBalance,
                nowMoney: amount,
                newMoney: amount,
                settleDate: settleDate,
                currency: currency['code']
            }))
        } else {
            Ext.Msg.alert('提示', '未查询到盈余相关数据!')
        }
    },
    diySetValue: function (data) {
        if (data || data === 0) {
            var me = this,
                form = me.getComponent('form'),
                items = form.items.items;
 
            items.forEach(item => {
                var {name} = item,
                    result = data[name];

                item.diySetValue ? item.diySetValue(result) : item.setValue(result);
            })
        }
    },
    jumpOpenPage: function () {
        var openPage = JSGetQueryString('openPage'),
            partnerId = JSGetQueryString('partnerId'),
            partnerEmail = JSGetQueryString('partnerEmail'),
            year = JSGetQueryString('year'),
            month = JSGetQueryString('month'),
            openPageType = {
                monthly_profit_case: {
                    id: 'monthly_profit_casepage',
                    title: i18n.getKey('每月盈余情况'),
                    url: path + 'partials/profitmanagement/monthly_profit_case.html' +
                        '?year=' + year +
                        '&month=' + month,
                    refresh: true
                },
                partner_profit_info: {
                    id: 'partner_profit_infopage',
                    url: path + 'partials/profitmanagement/partner_profit_info.html' +
                        '?partnerId=' + partnerId +
                        '&partnerEmail=' + partnerEmail,
                    title: i18n.getKey('Partner盈余详情'),
                    refresh: true
                },
                partner_profit_check: {
                    id: 'partner_profit_checkpage',
                    title: i18n.getKey('Partner盈余总览'),
                    url: path + 'partials/profitmanagement/partner_profit_check.html' +
                        '?partnerId=' + partnerId +
                        '&partnerEmail=' + partnerEmail,
                    refresh: true
                },
            };

        JSOpen(openPageType[openPage]);
    },
    initComponent: function () {
        var me = this,
            partnerId = JSGetQueryString('partnerId'),

            year = JSGetQueryString('year'),
            month = JSGetQueryString('month'),

            symbolLeft = JSGetQueryString('symbolLeft'),
            controller = Ext.create('CGP.profitmanagement.controller.Controller');

        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('保存'),
                iconCls: 'icon_save',
                margin: '0 10 0 15',
                width: 80,
                handler: function (btn) {
                    var panel = btn.ownerCt.ownerCt,
                        form = panel.getComponent('form'),
                        getValue = form.getValues(),
                        isEdit = JSGetQueryString('type') === 'edit',
                        url = adminPath + `api/${partnerId}/balance`,
                        defaultsValue = {
                            year: year,
                            month: month,
                        },
                        putData = Ext.Object.merge(getValue, defaultsValue);

                    if (form.isValid()) {
                        console.log(putData);
                        controller.asyncEditQuery(url, putData, 'PUT', function (require, success, response) {
                            if (success) {
                                var responseText = Ext.JSON.decode(response.responseText);
                                if (responseText.success) {
                                    Ext.Msg.alert('提示', '保存成功', function () {
                                        var tabs = top.Ext.getCmp('tabs'),
                                            _panel = tabs.getActiveTab();

                                        panel.jumpOpenPage();
                                        tabs.remove(_panel);
                                    });
                                }
                            }
                        }, false)
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('取消'),
                iconCls: 'icon_cancel',
                margin: '0 5 0 5',
                width: 80,
                handler: function (btn) {
                    var tabs = top.Ext.getCmp('tabs'),
                        panel = tabs.getActiveTab();
                    me.jumpOpenPage();
                    tabs.remove(panel);
                }
            }
        ]
        me.items = [
            {
                xtype: 'errorstrickform',
                itemId: 'form',
                defaults: {
                    margin: '10 25 5 25',
                    width: 400,
                    colspan: 2,
                },
                layout: {
                    type: 'table',
                    columns: 2
                },
                items: [
                    {
                        xtype: 'displayfield',
                        fieldLabel: i18n.getKey('当前年月'),
                        margin: '10 25 0 25',
                        name: 'settleDate',
                        itemId: 'settleDate',
                        diySetValue: function (data) {
                            var me = this,
                                {year, month} = data;
                            me.setValue(`${year} - ${month}`);
                        }
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: i18n.getKey('Partner ID'),
                        margin: '0 25 0 25',
                        name: 'partnerId',
                        itemId: 'partnerId',
                    },
                    {
                        xtype: 'displayfield',
                        fieldLabel: i18n.getKey('Partner Email'),
                        margin: '0 25 5 25',
                        name: 'partnerEmail',
                        itemId: 'partnerEmail',
                    },
                    /*{
                        xtype: 'combo',
                        fieldLabel: i18n.getKey('原因'),
                        itemId: 'reason',
                        name: 'reason',
                        editable: false,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['key', "value"],
                            data: [
                                {
                                    key: '订单收入',
                                    value: 'IN'
                                },
                                {
                                    key: '转账给Partner',
                                    value: 'movePartner'
                                },
                                {
                                    key: '其他',
                                    value: 'other'
                                },
                            ]
                        }),
                        displayField: 'key',
                        valueField: 'value',
                        value: 'IN'
                    },*/
                    {
                        xtype: 'textfield',
                        fieldLabel: i18n.getKey('货币'),
                        name: 'currency',
                        itemId: 'currency',
                        hidden: true,
                    },
                    {
                        xtype: 'radiogroup',
                        width: 450,
                        fieldLabel: i18n.getKey('记账类型'),
                        name: 'transactionType',
                        itemId: 'transactionType',
                        allowBlank: false,
                        labelWidth: 100,
                        items: [
                            {
                                boxLabel: '收入',
                                name: 'transactionType',
                                inputValue: 'IN',
                                checked: true
                            },
                            {
                                boxLabel: '支出',
                                name: 'transactionType',
                                inputValue: 'OUT',
                            },
                            /*{
                                boxLabel: '平衡 (盈余不变)',
                                name: 'transactionType',
                                inputValue: 'balance',
                            },*/
                        ],
                        listeners: {
                            change: function (comp, value) {
                                var form = comp.ownerCt,
                                    amountComp = form.getComponent('amount'),
                                    amount = amountComp.getValue(),
                                    transactionTypeComp = form.getComponent('transactionType'),
                                    transactionType = transactionTypeComp.getValue()['transactionType'],
                                    nowUsableMoney = form.getComponent('nowUsableMoney'),
                                    newUsableMoney = form.getComponent('newUsableMoney'),
                                    nowUsableMoneyOriginalValue = nowUsableMoney.originalValue,
                                    nowMoney = form.getComponent('nowMoney'),
                                    newMoney = form.getComponent('newMoney'),
                                    nowMoneyOriginalValue = nowMoney.originalValue,
                                    newUsableMoneyCalculate = transactionType === 'IN' ? (+nowUsableMoneyOriginalValue + amount) : (+nowUsableMoneyOriginalValue - amount),
                                    newMoneyCalculate = transactionType === 'IN' ? (+nowMoneyOriginalValue + amount) : (+nowMoneyOriginalValue - amount),
                                    newUsableMoneyResult = amount ? newUsableMoneyCalculate : +nowMoneyOriginalValue,
                                    newMoneyResult = amount ? newMoneyCalculate : +nowMoneyOriginalValue;

                                if (amount) {
                                    newUsableMoney.diySetValue(newUsableMoneyResult);
                                    newMoney.diySetValue(newMoneyResult);
                                }
                            }
                        }
                    },
                    {
                        xtype: 'numberfield',
                        name: 'amount',
                        itemId: 'amount',
                        allowBlank: false,
                        hideTrigger: true,
                        fieldLabel: i18n.getKey('金额'),
                        minValue: 1,
                        diySetValue: function (data) {
                            if (data || data === 0) {
                                var me = this;
                                me.setValue(`${symbolLeft} ${data}`);
                            }
                        },
                        listeners: {
                            change: function (comp, value) {
                                var form = comp.ownerCt,
                                    transactionTypeComp = form.getComponent('transactionType'),
                                    transactionType = transactionTypeComp.getValue()['transactionType'],
                                    nowUsableMoney = form.getComponent('nowUsableMoney'),
                                    newUsableMoney = form.getComponent('newUsableMoney'),
                                    nowUsableMoneyOriginalValue = nowUsableMoney.originalValue,
                                    nowMoney = form.getComponent('nowMoney'),
                                    newMoney = form.getComponent('newMoney'),
                                    nowMoneyOriginalValue = nowMoney.originalValue,
                                    newUsableMoneyCalculate = transactionType === 'IN' ? (+nowUsableMoneyOriginalValue + value) : (+nowUsableMoneyOriginalValue - value),
                                    newMoneyCalculate = transactionType === 'IN' ? (+nowMoneyOriginalValue + value) : (+nowMoneyOriginalValue - value),
                                    newUsableMoneyResult = value ? newUsableMoneyCalculate : +nowMoneyOriginalValue,
                                    newMoneyResult = value ? newMoneyCalculate : +nowMoneyOriginalValue;

                                newUsableMoney.diySetValue(newUsableMoneyResult.toFixed(2));
                                newMoney.diySetValue(newMoneyResult.toFixed(2));
                            }
                        }
                    },
                    {
                        xtype: 'displayfield',
                        name: 'nowUsableMoney',
                        itemId: 'nowUsableMoney',
                        fieldLabel: i18n.getKey('当前可用盈余'),
                        width: 300,
                        margin: '10 0 0 25',
                        colspan: 1,
                        originalValue: 0,
                        diySetValue: function (data) {
                            if (data || data === 0) {
                                var me = this;
                                me.originalValue = data;
                                me.setValue(`${symbolLeft} ${data}`);
                            }
                        },
                    },
                    {
                        xtype: 'displayfield',
                        name: 'newUsableMoney',
                        itemId: 'newUsableMoney',
                        fieldLabel: i18n.getKey('更新后可用盈余'),
                        margin: '10 0 0 0',
                        colspan: 1,
                        labelWidth: 120,
                        originalValue: 0,
                        diySetValue: function (data) {
                            if (data || data === 0) {
                                var me = this;
                                me.originalValue = data;
                                me.setValue(`${symbolLeft} ${data}`);
                            }
                        },
                    },
                    {
                        xtype: 'displayfield',
                        name: 'nowMoney',
                        itemId: 'nowMoney',
                        fieldLabel: i18n.getKey('当月总盈余'),
                        width: 300,
                        margin: '0 0 5 25',
                        colspan: 1,
                        originalValue: 0,
                        diySetValue: function (data) {
                            if (data || data === 0) {
                                var me = this;
                                me.originalValue = data;
                                me.setValue(`${symbolLeft} ${data}`);
                            }
                        },
                    },
                    {
                        xtype: 'displayfield',
                        name: 'newMoney',
                        itemId: 'newMoney',
                        fieldLabel: i18n.getKey('更新后当月总盈余'),
                        margin: '0 0 5 0',
                        colspan: 1,
                        labelWidth: 120,
                        originalValue: 0,
                        diySetValue: function (data) {
                            if (data || data === 0) {
                                var me = this;
                                me.originalValue = data;
                                me.setValue(`${symbolLeft} ${data}`);
                            }
                        },
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: i18n.getKey('备注'),
                        width: 470,
                        height: 60,
                        allowBlank: false,
                        name: 'remark',
                        itemId: 'remark',
                        tipInfo: '请使用英文输入，内容将显示到Partner的流水帐目中'
                    },
                    {
                        xtype: 'textarea',
                        fieldLabel: i18n.getKey('内部备注'),
                        width: 470,
                        height: 60,
                        name: 'innerRemark',
                        itemId: 'innerRemark',
                        tipInfo: '用于QP内部查看备注'
                    },
                ]
            }
        ];
        me.callParent();
        me.on('afterrender', function (comp) {
            comp.setEditProfitInfo();
        })
    },
})