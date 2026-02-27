Ext.define('CGP.cmspublish.model.CmsPublishTask',{
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    },{
        name: 'type',
        type: 'string'
    },{
        name: 'command',
        type: 'string'
    },{
        name: 'description',
        type: 'string'
    }, {
        name: 'sortOrder',
        type: 'int',
        sortDir: 'ASC'

    }]
})