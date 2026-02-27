/**
 * @Description:
 * @author nan
 * @date 2023/1/13
 */
Ext.define('CGP.ordersummary.model.AccountModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        //訂單號碼
        'orderNo',
        //其他單號
        'referenceNo',
        //本貨幣
        'baseCurrencyCode',
        //付款貨幣
        'currencyCode',
        //本貨幣基數
        {
            name: 'exchangeBaseNumber',
            type: 'number',
            useNull: true,
        },
        //匯率
        {
            name: 'exchangeRate',
            type: 'number',
            useNull: true,
        },
        //付款日期
        'orderDate',
        //系统下单时间
        {
            name: 'sysOrderDate',
            type: 'number',
            useNull: true,
        },
        //系统付款时间
        'sysPayDate',
        //交收日期
        {
            name: 'deliveryDate',
            type: 'number',
            useNull: true,
        },
        //帳單地址
        'billAddress',
        //用戶ID
        'userMail',
        //用戶姓名
        'userName',
        //收貨人
        'receiverName',
        //付款狀態
        'paymentState',
        //付款方式
        'paymentMethod',
        //當前流程
        {
            name: 'status',
            type: 'object'
        },
        //出貨方式
        'deliveryName',
        //總成本(HKD)
        {
            name: 'totalCost',
            type: 'number',
            useNull: true,
        },
        //產品總售價
        {
            name: 'productsPrice',
            type: 'number',
            useNull: true,
        },
        //重量(G)
        {
            name: 'productsWeight',
            type: 'number',
            useNull: true,
        },
        //運費
        {
            name: 'shippingPrice',
            type: 'number',
            useNull: true,
        },
        //額外費用
        {
            name: 'paddingPrice',
            type: 'number',
            useNull: true,
        },
        //稅金
        {
            name: 'tax',
            type: 'number',
            useNull: true,
        },
        //稅率
        {
            name: 'taxRate',
            type: 'number',
            useNull: true,
        },
        //現金卷
        'rewardCredit',
        //優惠券代碼
        'couponCode',
        //折扣
        {
            name: 'discountAmount',
            type: 'number',
            useNull: true,
        },
        //訂單類型
        'orderType',
        //產品總售價扣除折扣
        {
            name: 'totalPriceAfterDiscount',
            type: 'number',
            useNull: true,
        },
        //銀行轉賬優惠金額
        {
            name: 'bankTransferDiscount',
            type: 'number',
            useNull: true,
        },
        //總價
        {
            name: 'totalPrice',
            type: 'number',
            useNull: true,
        },
        //退款金額(退美國銷售稅)
        {
            name: 'taxAmount',
            type: 'number',
            useNull: true,
        },
        {
            name: 'otherAmount',
            type: 'number',
            useNull: true,
        },
        //退款來源
        'refundSource',
        //退款單號
        'refundNumber',
        //退款時間
        {
            name: 'refundDate',
            type: 'number',
            useNull: true,
        },
        //Net Receipt(QP)
        {
            name: 'netReceipt',
            type: 'number',
            useNull: true,
        },
        //NetReceiptQP
        {
            name: 'netReceiptQP',
            type: 'number',
            useNull: true,
        },
        //會計匯率
        {
            name: 'accountingExchangeRate',
            type: 'number',
            useNull: true,
        },
        //Net Receipt(QP HKD)
        {
            name: 'netReceiptQPHKD',
            type: 'number',
            useNull: true,
        },
        //税金(HKD)
        {
            name: 'taxHKD',
            type: 'number',
            useNull: true,
        },
        //郵遞單號
        'shippingNo',
        //實際運費(HKD)
        {
            name: 'shippingCost',
            type: 'number',
            useNull: true,
        },
        //(重做)郵遞單號
        'redoShippingNo',
        //(重做)實際運費(HKD)
        {
            name: 'redoShippingCost',
            type: 'number',
            useNull: true,
        },
        //備註
        'remark',
        //  收貨人國家/地區
        'shippingCountry',
        //收貨人城市
        'shippingCity',
        //收貨人省/州
        'shippingState',
        //邮编
        {
            name: 'shippingPostCode',
            type: 'number',
            useNull: true,
        },
        //是否曾購物
        {
            name: 'isReturnedCustomer',
            type: 'boolean'
        },
        //DateRegistered
        'registeredDate',
        //EdmDate
        'edmDate',
        //來源
        'source',
        //额外附加费用说明
        'paddingDesc',
        //美國銷售稅金（已收取）[
        {
            name: 'paidSalesTax',
            type: 'number',
            useNull: true,
        },
        //付款日期
        'payDate',
        //Taxable sales(Sales tax exclude)
        'taxableSales'
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/reports/account',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})
