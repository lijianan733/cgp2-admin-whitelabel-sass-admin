/**
 * @author nan
 * @date 2025/12/3
 * @description TODO
 */

Ext.Loader.syncRequire([
    'CGP.order.view.transactionvoucher.model.CurrencyModel',
    'CGP.partner_credit.view.ImageArrField',
    'CGP.partner_bill.view.PartnerPayMethodCombo'
])
Ext.define('CGP.partner_bill.view.TransactionVoucherForm', {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.transaction_voucher_form',
    itemId: 'form',
    defaults: {
        width: 450,
        margin: '5 25',
        allowBlank: true,
    },
    isValidForItems: true,
    totalPriceString: null,//需付款金额
    billId: null,//订单号
    bill: null,//订单记录
    platformId: null,
    billAmount: null,//账单金额
    billCurrencyCode: null,//账单货币
    getName: function () {
        return this.name;
    },
    diySetValue: function (data) {
        var me = this;
        if (data) {
            var diyData = {
                currencyCode: data.paymentCurrencyCode,
                amount: data.paymentAmount,
                paymentNumbers: data.paymentNumbers,
                paymentCertificates: data.paymentCertificates,
                remark: data.remark
            };
            for (var key in diyData) {
                var comp = me.down(`[itemId=${key}]`);
                var value = diyData[key];
                if (comp.diySetValue) {
                    comp.diySetValue(value);
                } else {
                    comp.setValue(value);
                }
            }
        }
    },
    getErrors: function () {
        return '相关信息不完备';
    },
    getFieldLabel: function () {
        return '线下付款信息';
    },
    /**
     * 根据环境获取的对于的1平台，然后根据平台获取对于的货币
     * @returns {*}
     */
    getCurrencyInfo: function () {
        var me = this;
        var isProduction = JSWebsiteIsStage();
        var url = adminPath + 'api/platform/v2?page=1&start=0&limit=1000';
        var platformArr = [];
        var result = [];
        JSAjaxRequest(url, "GET", false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    platformArr = responseText.data.content;
                }
            }
        }, true);
        var platformId = '';//平台id
        var scope = 'Backend';
        var code = 'QPMN';
        var mode = isProduction ? 'Production' : 'Stage';
        platformArr.map(function (item) {
            if (item.code == code && item.mode == mode) {
                platformId = item.id;
            }
        });
        me.platformId = platformId;
        var url2 = adminPath + `api/platformCurrencySettings/platform/${platformId}/scope/${scope}?page=1&start=0&limit=1000`;
        JSAjaxRequest(url2, "GET", false, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data.currencies;
                }
            }
        }, true);
        return result;
    },
    /**
     * 切换币种，计算需付的金额
     */
    getSwitchCurrency: function (price, currencyCode, targetCurrencyCode, decimalPlaces = 2) {
        var me = this;
        var platformId = me.platformId;
        var url = adminPath + `api/platform/${platformId}/currency/exchange`;
        var result = '';
        var jsonData = {
            "price": price,
            "currencyCode": currencyCode,
            "targetCurrencyCode": targetCurrencyCode,
            "decimalPlaces": decimalPlaces
        };
        JSAjaxRequest(url, "POST", false, jsonData, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    result = responseText.data;
                }
            }
        }, true);
        return result;
    },
    isValid: function () {
        var me = this;
        this.msgPanel.hide();
        var isValid = true,
            errors = {};
        if (me.disabled == true) {
            return true;
        }
        this.items.items.forEach(function (f) {
            if (!f.isValid()) {
                var errorInfo = f.getErrors();
                if (Ext.isObject(errorInfo) && !Ext.Object.isEmpty(errorInfo)) {//处理uxfieldContainer的错误信息
                    errors = Ext.Object.merge(errors, errorInfo);
                } else {
                    errors[f.getFieldLabel()] = errorInfo;
                }
                isValid = false;
            }
        });
        var val1 = me.getComponent('paymentCertificates').diyGetValue();
        var val2 = me.getComponent('paymentNumbers').diyGetValue();
        if (Ext.isEmpty(val1) && Ext.isEmpty(val2)) {
            isValid = false;
            errors['提示'] = '付款交易号或者付款凭证必须至少填写一项';
        }
        isValid ? null : this.showErrors(errors);
        return isValid;
    },
    initComponent: function () {
        var me = this;
        var needPayAmount = me.billAmount;//需付款金额
        var currencyData = me.getCurrencyInfo();
        me.items = [
            {
                xtype: 'displayfield',
                name: 'price',
                itemId: 'price',
                fieldStyle: 'color: red;font-weight: bold;',//设置文本框的样式
                value: me.totalPriceString,
                fieldLabel: '账单应付金额',
            },
            {
                xtype: 'hiddenfield',
                name: 'paymentCurrencyCode',
                itemId: 'paymentCurrencyCode',
                value: me.billCurrencyCode,
            },
            {
                xtype: 'uxfieldcontainer',
                fieldLabel: '实收金额',
                width: '100%',
                defaults: {},
                allowBlank: false,
                labelAlign: 'left',
                itemId: 'paymentAmount',
                name: 'paymentAmount',
                diyGetValue: function () {
                    return this.getComponent('amount').getValue();
                },
                layout: {
                    type: 'hbox'
                },
                items: [
                    {
                        xtype: 'combo',
                        itemId: 'currencyCode',
                        name: 'currencyCode',
                        valueField: 'code',
                        displayField: 'code',
                        titleField: 'title',
                        allowBlank: false,
                        editable: false,
                        width: 100,
                        emptyText: '货币',
                        value: me.billCurrencyCode,
                        store: {
                            xtype: 'store',
                            model: 'CGP.order.view.transactionvoucher.model.CurrencyModel',
                            data: currencyData,
                            proxy: {
                                type: 'memory'
                            }
                        },
                        diySetValue: function (data) {
                            var me = this;
                            me.setValue(data);
                        },
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var fieldContainer = field.ownerCt;
                                var form = fieldContainer.ownerCt;
                                var amount = fieldContainer.getComponent('amount');
                                var modifiedAmount2 = form.getComponent('paymentCurrencyCode');
                                modifiedAmount2.setValue(newValue);

                                //更新应收金额为当前货币类型的金额
                                var info = fieldContainer.getComponent('info');
                                var newNeedPayAmount = form.getSwitchCurrency(needPayAmount, me.billCurrencyCode, newValue);
                                var record = field.store.findRecord('code', newValue);
                                info.setValue(`(应收：${record.get('symbolLeft')}${newNeedPayAmount})`);
                                info.needPayAmount = newNeedPayAmount;
                                //切换币种，计算实收金额
                                amount.setValue(newNeedPayAmount);
                            }
                        }
                    },
                    {
                        xtype: 'numberfield',
                        allowDecimals: true,
                        width: 150,
                        maskRe: /[\d,\.]/,//只能输入数值
                        decimalPrecision: 2,//这里设置保留2为小数
                        hideTrigger: true,
                        allowBlank: false,
                        step: 0,
                        readOnly: true,
                        fieldStyle: 'background-color:silver',
                        minValue: 0,
                        emptyText: '实收金额',
                        name: 'amount',
                        itemId: 'amount',
                        margin: '0 5 0 5',
                        value: needPayAmount,
                        checkChangeOnBlur: true,
                        delayedTask: null,
                    },
                    {
                        xtype: 'displayfield',
                        width: 200,
                        itemId: 'info',
                        needPayAmount: needPayAmount,
                        fieldStyle: 'color: red;font-weight: bold;',//设置文本框的样式
                        value: `(应收：${me.totalPriceString})`
                    }
                ],
                getErrors: function () {
                    return {
                        实收金额: '该输入项为必输项'
                    };
                }
            },
            {
                xtype: 'datetimefield',
                itemId: 'billPaymentDate',
                name: 'billPaymentDate',
                editable: false,
                fieldLabel: '付款日期',
                format: 'Y-m-d H:i:s',
                allowBlank: false,
                value: new Date(),
                diyGetValue: function () {
                    //返回时间戳
                    return this.getValue().getTime();
                }
            },
            {
                xtype: 'partner_pay_method_combo',
                itemId: 'paymentMethod',
                name: 'paymentMethod',
                allowBlank: false
            },
            {
                xtype: 'hiddenfield',
                name: 'billIds',
                itemId: 'billIds',
                fieldLabel: 'billIds',
                value: me.billId,
                diyGetValue: function () {
                    var me = this;
                    return [me.getValue()];
                }
            },
            {
                xtype: 'arraydatafield',
                fieldLabel: '付款交易号',
                itemId: 'paymentNumbers',
                name: 'paymentNumbers',
                resultType: 'Array',
                diyInputComponent: {
                    xtype: 'textfield',
                    margin: '5 25',
                    flex: 1,
                    width: '100%',
                    emptyText: '付款交易号',
                }
            },
            {
                xtype: 'image_arr_field',
                width: '100%',
                flex: 1,
                name: 'paymentCertificates',
                itemId: 'paymentCertificates',
                isPaging: false,//不分页
            },
            {
                xtype: 'textarea',
                name: 'remark',
                itemId: 'remark',
                fieldLabel: '备注',
                height: 80,
                validateBlank: true,
            },
        ];
        me.callParent();
    },
})