Ext.define('CGP.testreconstructgridpage.model.PartnerModel', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull:true
        },
        {
            name: 'code',
            type: 'string'
        },{
            name: 'name',
            type: 'string'
        },{
            name: 'contactor',
            type: 'string'
        },{
            name: 'telephone',
            type: 'string'
        },{
            name: 'cooperationType',
            type: 'string'
        },{
            name: 'email',
            type: 'string'
        },{
            name: 'website',
            type: 'object'
        },{
            name: 'cooperationBusinesses',
            type: 'object',
            defaultValue:undefined
        }
    ], proxy: {
        type: 'uxrest',
        url: adminPath + 'api/partners',
        reader: {
            type: 'json',
            root: 'data'
        }
    }

})