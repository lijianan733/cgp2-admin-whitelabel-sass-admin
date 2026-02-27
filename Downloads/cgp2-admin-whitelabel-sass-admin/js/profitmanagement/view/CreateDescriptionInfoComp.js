/**
 * @author xiu
 * @date 2025/2/25
 */
Ext.define('CGP.profitmanagement.view.CreateDescriptionInfoComp', {
    extend: 'Ext.container.Container',
    alias: 'widget.create_description_info_comp',
    width: 500,
    layout: {
        type: 'table',
        columns: 3
    },
    defaults: {
        width: 250,
    },
    getMonthlyProfitInfo: function (params, comp) {
        var url = adminPath + `api/${params['year']}/${params['month']}/balance/overview`,
            controller = Ext.create('CGP.profitmanagement.controller.Controller'),
            getData = controller.getQuery(url);

        if (getData) {
            var {
                    currency,
                    year,
                    month,
                    finish,
                    settlePartnerCount,
                    waitSettlePartnerCount,
                } = getData,
                newYearMonth = controller.getLastNowYearMonth(year, month, 0),
                nowYearMonth = newYearMonth['year'] + ' - ' + (newYearMonth['month']),
                isFinishGather = {
                    true: {
                        color: 'green',
                        text: ' (已结清)'
                    },
                    false: {
                        color: 'red',
                        text: ' (未结清)'
                    }
                },
                {color, text} = isFinishGather[finish],
                finishText = JSCreateFont(color, true, text),
                result = Ext.Object.merge(getData, {
                    nowYearMonth: nowYearMonth + finishText,
                    partnerQty: settlePartnerCount + waitSettlePartnerCount
                })

            comp.diySetValue(result);
        } else {
            comp.setClearItem();
            Ext.Msg.alert('提示', '未获取到该月份信息!');
        }
    },
    diySetValue: function (data) {
        var me = this,
            items = me.items.items;

        if (data) {
            var {currency} = data,
                {code, symbol, symbolLeft} = currency;

            items.forEach(item => {
                var {name} = item,
                    result = data[name];

                // 加货币符号
                if (['amount', 'transferBalance', 'waitProfitSettleAmount', 'waitDeficitSettleAmount', 'outTransferBalance', 'inTransferBalance'].includes(name)) {
                    if (result) {
                        result = result.toFixed(2);
                    }
                    result = `${symbolLeft} ${result || 0}`
                }
                item.diySetValue ? item.diySetValue(result) : item.setValue(result);
            })
        }
    },
    setClearItem: function () {
        var me = this,
            items = me.items.items;

        items.forEach(item => {
            item.reset();
        })
    },
    initComponent: function () {
        var me = this;

        me.items = [
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('当前结算年月'),
                itemId: 'nowYearMonth',
                name: 'nowYearMonth',
                colspan: 3,
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('盈余总额'),
                itemId: 'amount',
                name: 'amount',
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('已结算盈余'),
                itemId: 'transferBalance',
                name: 'transferBalance',
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('待结算支出盈余'),
                itemId: 'waitProfitSettleAmount',
                name: 'waitProfitSettleAmount',
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('待结算收入盈余'),
                itemId: 'waitDeficitSettleAmount;',
                name: 'waitDeficitSettleAmount',
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('Partner总数'),
                itemId: 'partnerQty',
                name: 'partnerQty',
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('盈余已结清的Partner数量'),
                itemId: 'settlePartnerCount',
                name: 'settlePartnerCount',
                labelWidth: 160,
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('盈余未结清的Partner数量'),
                itemId: 'waitSettlePartnerCount',
                name: 'waitSettlePartnerCount',
                labelWidth: 160,
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('他月转入总盈余'),
                itemId: 'inTransferBalance',
                name: 'inTransferBalance',
                labelWidth: 100,
            },
            {
                xtype: 'displayfield',
                fieldLabel: i18n.getKey('当月转出总盈余'),
                itemId: 'outTransferBalance',
                name: 'outTransferBalance',
                labelWidth: 100,
            },
        ];
        me.callParent();
    }
})