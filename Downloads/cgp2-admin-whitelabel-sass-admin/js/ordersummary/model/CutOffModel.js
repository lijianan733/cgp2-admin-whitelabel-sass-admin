/**
 * @Description:
 * @author nan
 * @date 2023/1/13
 */
Ext.define('CGP.ordersummary.model.CutOffModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        //入賬日期
        'accountingDate',
        //会计汇率(网站货币转HKD)
        'accountingExchangeRate',
        //入賬月份
        'accountingMonth',
        // 付款货币代号，ISO 4217标准
        'currencyCode',
        //出貨方式
        'deliveryName',
        //预计送达日期
        'expectedShippingDate',
        //净收入(QP)：销售订单总金额-退款金额-美国销售税
        {
            name: 'netReceiptQP',
            type: 'number',
            useNull: true,
        },
        //净收入(QP HKD)：销售订单总金额-退款金额-美国销售税
        {
            name: 'netReceiptQPHKD',
            type: 'number',
            useNull: true,
        },
        //销售订单号
        'orderNo',
        //序号
        'serialNo',
        //收货人所在国家
        'shippingCountry',
        //實際出貨方式
        'shippingMethod',
        //递单号
        'shippingNo',
        //實際簽收日期
        'signDate',
        //WhiteLabel订单的状态
        {
            name: 'status',
            type: 'object',
            useNull: true,
        },
        //来源:暂无
        'substituteFrom',
        //代签收日期:暂无
        'substituteSignDate',
        //總成本（HKD）
        {
            name: 'totalCost',
            type: 'number',
            useNull: true,
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/reports/cutoff',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})

/**
 * accountingDate (string, optional): 入賬日期 ,
 * accountingExchangeRate (string, optional): 会计汇率(网站货币转HKD) ,
 * accountingMonth (integer, optional): 入賬月份 ,
 * currencyCode (string, optional): 付款货币代号，ISO 4217标准 ,
 * deliveryName (string, optional): 出貨方式 ,
 * expectedShippingDate (string, optional): 预计送达日期 ,
 * netReceiptQP (number, optional): 净收入(QP)：销售订单总金额-退款金额-美国销售税 ,
 * netReceiptQPHKD (number, optional): 净收入(QP HKD)：销售订单总金额-退款金额-美国销售税 ,
 * orderNo (string, optional): 销售订单号 ,
 * serialNo (integer, optional): 序号 ,
 * shippingCountry (string, optional): 收货人所在国家 ,
 * shippingMethod (string, optional): 實際出貨方式 ,
 * shippingNo (string, optional): 递单号 ,
 * signDate (string, optional): 實際簽收日期 ,
 * status (OrderStatus, optional): WhiteLabel订单的状态 ,
 * substituteFrom (string, optional): 来源:暂无
 * substituteSignDate (string, optional): 代签收日期:暂无 ,
 * totalCost (number, optional): 總成本（HKD）
 */