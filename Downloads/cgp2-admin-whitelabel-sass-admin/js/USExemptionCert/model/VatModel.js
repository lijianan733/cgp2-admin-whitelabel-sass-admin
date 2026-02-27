Ext.define('CGP.USExemptionCert.model.VatModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'number'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.partner.tax.exemption.ExemptionCert'
        },
        //国家地区代码
        {
            name: 'countryCode',
            type: 'string'
        },
        //国家地区名称
        {
            name: 'countryName',
            type: 'string'
        },
        //partner信息
        {
            name: 'partner',
            type: 'object',
        },
        //备注
        {
            name: 'reason',
            type: 'string',
        },
        //vat状态
        // Pending
        // Valid
        // Invalid
        {
            name: 'status',
            type: 'string',
        },
        {
            name: 'location',
            type: 'object'
        },
        {
            name: 'cert',
            type: 'object'
        },
        {
            name: 'buyerInfo',
            type: 'object'
        },
        {
            name: 'signature',
            type: 'object'
        },
        {
            name: 'questions',
            type: 'array'
        },
        {
            name: 'additionalDoc',
            type: 'array'
        },{
            name: 'remark',
            type: 'string'
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/vatIds',
        reader: {
            type: 'json',
            root: 'data'
        }
    }

})
