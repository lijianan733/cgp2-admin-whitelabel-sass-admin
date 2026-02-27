/**
 * Created by nan on 2021/10/21.
 */
Ext.define('CGP.areaamountrule.model.AreaAmountRuleModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string'
        },
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'description',
            type: 'string'
        },
        {
            name: 'clazz',
            type: 'string',
            defaultValue: 'com.qpp.cgp.domain.adjust.ProductAdjustAmount'
        },
        {
            name: 'areaAdjustAmounts',
            type: 'array',
        },
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/productadjustamount',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})