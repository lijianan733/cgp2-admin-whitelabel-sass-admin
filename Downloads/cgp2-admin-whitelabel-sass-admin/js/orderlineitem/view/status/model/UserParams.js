Ext.define('CGP.orderlineitem.view.status.model.UserParams', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'orderItemId',
            type: 'int'
        },
        {
            name: 'userParams',
            type: 'object'
        },
        {
            name: 'userParamDefaultValues',
            type: 'object'
        },
        {
            name: 'userImpositionParams',
            type: 'object'
        }]
})