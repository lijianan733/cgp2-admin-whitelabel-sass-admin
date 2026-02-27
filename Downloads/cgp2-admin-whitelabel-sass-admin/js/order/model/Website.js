/**
 * 网站管理的model
 */
Ext.define('CGP.order.model.Website', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, {
        name: 'name',
        type: 'string'
    }]
});