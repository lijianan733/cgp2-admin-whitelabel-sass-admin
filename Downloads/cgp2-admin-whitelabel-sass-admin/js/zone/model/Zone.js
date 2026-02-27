/**
 *
 */

Ext.define('CGP.zone.model.Zone', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull: true
        },
        {
            name: 'clazz',
            type: 'string'
        }, {
            name: 'code',
            type: 'string'
        }, {
            name: 'name',
            type: 'string'
        }, {
            name: 'country'
        }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/zones',
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});