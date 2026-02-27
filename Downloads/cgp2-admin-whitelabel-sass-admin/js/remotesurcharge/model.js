Ext.define('CGP.model.RemoteSurcharge', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, 'shippingMode', {name:'country',type: 'object'}, 'startPostcode', 'endPostcode', {
        name: 'startOrderAmount',
        type: 'float'
    }, {
        name: 'endOrderAmount',
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
        name: 'minCharge',
        type: 'float'
    }, 'status'],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/remoteSurcharge',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})