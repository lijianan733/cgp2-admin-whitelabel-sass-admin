Ext.define('CGP.product.view.syncproduct.LocalProductStore', {
    extend: 'Ext.data.Store',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }, {name: 'type',type: 'string'}],
    autoSync : true,
    proxy : {
        type : 'memory'
    },
    autoLoad:true
});
