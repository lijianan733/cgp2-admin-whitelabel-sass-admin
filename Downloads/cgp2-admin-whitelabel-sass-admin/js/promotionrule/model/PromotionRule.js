Ext.define('CGP.promotionrule.model.PromotionRule', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        'name',
        'description',
        {
            name: 'active',
            type: 'boolean'
        },
        {
            name: 'cumulative',
            type: 'boolean'
        },
        {
            name: 'websiteId',
            type: 'int'
        },
        'websiteName',
        {
            name: 'promotionId',
            type: 'int'
        },
        'promotionName',
        {
            name: 'policy',
            type: 'object'
        },
        {
            name: 'conditions',
            type: 'array'
        },
        {
            name: 'couponRequired',
            type: 'boolean',
            defaultValue: false
        }
    ],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/promotionRules',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})