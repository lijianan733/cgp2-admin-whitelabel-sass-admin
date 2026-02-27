/**
 * @Description:
 * @author nan
 * @date 2023/8/2
 */
Ext.define('CGP.USExemptionCert.model.QPVatModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        '_id',
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.qp.QPVatId'
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
        },
        {
            name: 'countryCode2',
            type: 'object',
            convert: function (value, record) {
                return {
                    countryName: record.get('countryName'),
                    countryCode: record.get('countryCode'),
                };
            }
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/qp/vatIds',
        reader: {
            type: 'json',
            root: 'data'
        }
    }

})
