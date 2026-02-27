Ext.define('CGP.order.actions.modifyuser.model.Order', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
            name: 'id',
            type: 'int',
            useNull: true
 		}, 'orderNumber', 'customerEmail', 'website', {
            name: 'websiteId',
            type: 'int'
        },{
        	name : 'customerId',
        	type : 'int'
        }
 	],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/orders',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
})