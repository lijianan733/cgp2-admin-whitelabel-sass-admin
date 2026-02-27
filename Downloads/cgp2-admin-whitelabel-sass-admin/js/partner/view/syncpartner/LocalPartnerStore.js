Ext.define('CGP.partner.view.syncpartner.LocalPartnerStore', {
    extend: 'Ext.data.Store',
    fields: [{
        name: 'id',
        type: 'int'
    }, {
        name: 'name',
        type: 'string'
    }, {name: 'code',type: 'string'}],
    autoSync : true,
    proxy : {
        type : 'memory'
    },
    autoLoad:true
});
