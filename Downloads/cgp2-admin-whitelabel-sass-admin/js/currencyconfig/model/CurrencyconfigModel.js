/**
 * @author xiu
 * @date 2024/12/31
 */
Ext.define('CGP.currencyconfig.model.CurrencyconfigModel', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.common.color.RgbColor'
        },
        {
            name: 'version',
            type: 'number'
        },
        {
            name: 'status',
            type: 'string',
        },
        {
            name: 'effectiveTime',
            type: 'number',
        },
        {
            name: 'createdDate',
            type: 'number',
        },
        {
            name: 'expiredTime',
            type: 'number',
        },
        {
            name:'exchangeRateSet',
            type: 'string',
        },
        {
            name:'platform',
            type: 'array',
        },
        {
            name:'platform',
            type: 'array',
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/colors',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})