/**
 * currency model
 */
Ext.define('CGP.exchangerateconfig.model.ExchangeRateConfig', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true,
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.common.rate.ExchangeRate'
        },
        {
            name: 'version',
            type: 'number',
        },
        {
            name: 'description',
            type: 'string',
        },
        {
            name: 'status',
            type: 'string',
        },
        {
            name: 'usedPlatforms',
            type: 'array',
        },
        {
            name: 'createdDate',
            type: 'number',
        },
        {
            name: 'exchangeRates',
            type: 'array',
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/exchangeRates',
        reader: {
            type: 'json',
            root: 'data',
        },
    },
});