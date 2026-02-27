Ext.define('CGP.model.SfPostage', {
    extend: Ext.data.Model,
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, {
        name: 'address',
        type: 'string'
    }, {
        name: 'country',
        type: 'object'
    }, {
        name: 'websiteId',
        type: 'int'
    }, {
        name: 'rules',
        type: 'array'
    }, {
        name: 'websiteName',
        type: 'string'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/postage/sf',
        reader: {
            root: 'data',
            type: 'json'
        }
    }
})

Ext.define('CGP.model.PostageTemplate', {
    extend: Ext.data.Model,
    fields: [{
        name: 'startWeight',
        type: 'float'
    }, {
        name: 'endWeight',
        type: 'float'
    }, {
        name: 'firstWeight',
        type: 'float'
    }, {
        name: 'firstFee',
        type: 'float'
    }, {
        name: 'plusWeight',
        type: 'float'
    }, {
        name: 'plusFee',
        type: 'float'
    }, {
        name: 'extraFeeRate',
        type: 'int'
    }, {
        name: 'amountPromotion',
        type: 'float'
    }, {
        name: 'promotion',
        type: 'float'
    }]
})