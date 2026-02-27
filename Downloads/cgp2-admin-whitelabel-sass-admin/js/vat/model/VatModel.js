Ext.define('CGP.vat.model.VatModel', {
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
            defaultValue: 'com.qpp.cgp.vo.vat.VatIdVo'
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
            name: 'remark',
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
            name: 'vatId',
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