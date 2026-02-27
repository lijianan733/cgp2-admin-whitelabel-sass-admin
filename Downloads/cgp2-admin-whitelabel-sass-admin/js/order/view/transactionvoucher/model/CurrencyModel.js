/**
 * @author nan
 * @date 2025/12/5
 * @description TODO
 */
Ext.define('CGP.order.view.transactionvoucher.model.CurrencyModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        }, {
            name: 'clazz',
            type: 'com.qpp.cgp.domain.common.Currency'
        }, {
            name: 'code',
            type: 'string'
        }, {
            name: 'decimalPlaces',
            type: 'string'
        }, {
            name: 'decimalPoint',
            type: 'string'
        }, {
            name: 'symbol',
            type: 'string'
        }, {
            name: 'symbolLeft',
            type: 'string'
        }, {
            name: 'symbolRight',
            type: 'string'
        }, {
            name: 'thousandsPoint',
            type: 'string'
        },
        {
            name: 'title',
            type: 'string'
        }, {
            name: 'value',
            type: 'number'
        }, {
            name: 'website',
            type: 'object'
        }
    ]/*    proxy: {
        type: 'attribute_version_rest',
        url: adminPath + 'api/products/skuAttributes',
        reader: {
            type: 'json',
            root: 'data'
        }
    }*/
/*{
    "id": 14311043,
    "clazz": "com.qpp.cgp.domain.common.Currency",
    "createdDate": 1602051427000,
    "createdBy": "14175044",
    "modifiedDate": 1736235915764,
    "modifiedBy": "2231538",
    "code": "CHF",
    "title": "Swiss Franc",
    "symbolLeft": "CHF",
    "symbolRight": "",
    "decimalPoint": ".",
    "thousandsPoint": ",",
    "decimalPlaces": "2",
    "value": 0.95238,
    "website": {
        "id": 11,
        "clazz": "com.qpp.cgp.domain.common.Website",
        "modifiedDate": 1736235915764
     },
    "symbol": "CHF"
}*/

})
