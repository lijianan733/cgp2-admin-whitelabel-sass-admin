Ext.define('CGP.ordersign.view.orderInfo.PaymentInfo', {
    extend: 'Ext.ux.form.field.UxFieldSet',
    alias: 'widget.payment_info',
    padding: '5 5 10 5',
    defaults: {
        xtype: 'textfield',
        margin: '5 40 5 15',
        labelWidth: 70,
    },
    initComponent: function () {
        var me = this;
        var currency = Ext.create('CGP.currency.store.Currency', {
            params: {
                filter: Ext.JSON.encode([
                    {
                        name: 'website.id',
                        type: 'number',
                        value: 11
                    },
                ])
            }
        });
        var controller = Ext.create('CGP.ordersign.controller.Controller');
        me.items = [
            {
                xtype: 'combobox',
                fieldLabel: i18n.getKey('paymentState'), //付款状态🐕
                name: 'paymentState',
                displayField: 'key',
                valueField: 'value',
                store: {
                    xtype: 'store',
                    fields: ['key', 'value'],
                    data: [
                        {
                            key: '已付款',
                            value: '已付款'
                        },
                        {
                            key: '未付款',
                            value: '未付款'
                        },
                    ]
                },
            },
            {
                xtype: 'combobox',
                fieldLabel: i18n.getKey('paymentMethod'), //付款方式🐕
                name: 'paymentMethod',
                displayField: 'key',
                valueField: 'value',
                store: {
                    xtype: 'store',
                    fields: ['key', 'value'],
                    data: [
                        {
                            key: 'PayPal',
                            value: 'PayPal'
                        },
                        {
                            key: 'Braintree',
                            value: 'Braintree'
                        },
                        {
                            key: 'BankTransfer',
                            value: 'BankTransfer'
                        },
                    ]
                },
            },
            {
                xtype: 'combobox',
                fieldLabel: i18n.getKey('baseCurrencyCode'), //本货币🐕
                name: 'baseCurrencyCode',
                store: currency,
                displayField: 'title',
                valueField: 'code',
            },
            {
                xtype: 'combobox',
                fieldLabel: i18n.getKey('payment') + i18n.getKey('currencyCode'), //付款货币🐕
                name: 'currencyCode',
                itemId: 'currencyCode',
                store: currency,
                displayField: 'title',
                valueField: 'code',
                listeners: {
                    change: function (comp, newValue, oldValue) {
                        var paymentInfo = comp.ownerCt;
                        var currencyCodev2 = paymentInfo.getComponent('currencyCodev2');
                        currencyCodev2.setValue(newValue);
                    }
                }
            },
            {
                xtype: 'combobox',
                fieldLabel: i18n.getKey('payment') + i18n.getKey('currencyCodev2'), //付款货币符号🐕
                name: 'currencyCode',
                itemId: 'currencyCodev2',
                hidden: true,
                store: currency,
                displayField: 'symbolLeft',
                valueField: 'code',
                listeners: {
                    change: function (comp, newValue, oldValue) {
                        var orderInfo = comp.ownerCt.ownerCt
                        var displayValue = comp.getDisplayValue();
                        var orderAmount = orderInfo.getComponent('orderAmount');
                        var isEmptyResult = orderAmount.isEmptyResult;
                        if (!isEmptyResult) {
                            var container = orderAmount.getComponent('container');
                            var totalPriceAfterDiscount = container.getComponent('totalPriceAfterDiscount');
                            var symbol = totalPriceAfterDiscount.getComponent('symbol');
                            var showTotalPrice = orderAmount.getComponent('showTotalPrice');
                            var totalPriceAfterDiscountv2 = showTotalPrice.getComponent('totalPriceAfterDiscount');
                            var symbolv2 = totalPriceAfterDiscountv2.getComponent('symbol');

                            var group = {
                                HKD: 'HK$',
                                USD: '$',
                                CNY: '￥',
                                EUR: '€',
                                GBP: '£'
                            }
                            var array = ['HKD','USD','CNY','EUR','GBP'];
                            array.includes(displayValue) && (displayValue = group[displayValue])
                            symbol.setText(controller.getTitleBold('#C76989', true, displayValue));
                            symbolv2.setText(controller.getTitleBold('red', true, displayValue));
                        }
                    }
                }
            },
            {
                fieldLabel: i18n.getKey('exchangeBaseNumber'), //本货币基数🐕
                name: 'exchangeBaseNumber'
            },
            {
                fieldLabel: i18n.getKey('exchangeRate'), //汇率🐕
                name: 'exchangeRate'
            },

        ];
        me.callParent();
    },
    diyGetValue: function () {
        var result = {},
            me = this,
            items = me.items.items;

        items.forEach(item => {
            var name = item.getName(),
                value = item.diyGetValue ? item.diyGetValue() : item.getValue();

            result[name] = value;
        })
        return result;
    },
    diySetValue: function (value) {
        var me = this,
            items = me.items.items;

        items.forEach(item => item.setValue(value[item.getName()]));
    },
})