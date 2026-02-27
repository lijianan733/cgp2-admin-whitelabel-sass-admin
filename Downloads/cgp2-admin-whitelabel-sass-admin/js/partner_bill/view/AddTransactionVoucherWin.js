/**
 * @Description:添加交易凭证的弹窗
 * @author nan
 * @date 2024/8/23
 */

Ext.Loader.syncRequire([
    'CGP.partner_bill.view.TransactionVoucherForm'
])
Ext.define('CGP.partner_bill.view.AddTransactionVoucherWin', {
    extend: 'Ext.window.Window',
    alias: 'widget.add_transaction_voucher_win',
    modal: true,
    constrain: true,
    title: '录入转账凭证',
    layout: 'fit',
    width: 800,
    maxHeight: 800,
    totalPriceString: null,//需付款金额
    billCurrencyCode: null,//账单货币
    billAmount: null,//账单金额
    billId: null,//订单号
    outGrid: null,
    bill: null,//订单的记录
    bbar: {
        xtype: 'bottomtoolbar',
        saveBtnCfg: {
            handler: function (btn) {
                var win = btn.ownerCt.ownerCt;
                var form = win.getComponent('form');
                if (form.isValid()) {
                    var jsonData = form.getValue();
                    console.log(jsonData);
                    console.log(jsonData)
                    var url = adminPath + `api/partnerBills/payment`;
                    JSAjaxRequest(url, 'POST', true, jsonData, '上传完成', function (require, success, response) {
                        if (success) {
                            var responseText = Ext.JSON.decode(response.responseText);
                            if (responseText.success) {
                                if (jsonData.isConfirmed == true) {
                                    Ext.Msg.alert('提醒', '录入凭证完成,且审核已通过.');
                                } else {
                                    Ext.Msg.alert('提醒', '录入凭证完成');
                                }
                                win.outGrid.store.load();
                                win.close();
                            }
                        }
                    }, true);
                }
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'transaction_voucher_form',
                itemId: 'form',
                border: false,
                billAmount: me.billAmount,//账单金额
                billCurrencyCode: me.billCurrencyCode,//账单货币
                totalPriceString: me.totalPriceString,//需付款金额
                billId: me.billId,//订单号
                outGrid: me.outGrid,
                bill: me.bill,
            }
        ];
        me.callParent(arguments);
    }
});