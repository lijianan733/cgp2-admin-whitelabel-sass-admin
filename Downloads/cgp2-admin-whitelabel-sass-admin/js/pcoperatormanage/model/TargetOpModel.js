Ext.define('CGP.pcoperatormanage.model.TargetOpModel', {
    extend: 'Ext.data.Model',
    idProperty: '_id',
    fields: [
        {
            name: '_id',
            type: 'string',
            useNull: true
        }, {
            name: 'description',
            type: 'string'
        }, {
            name: 'sourceType',
            type: 'string'
        }
    ], proxy: {
        type: 'uxrest',
        url: adminPath + 'api/operatorcontroller',
        reader: {
            type: 'json',
            root: 'data'
        }
    }

})
