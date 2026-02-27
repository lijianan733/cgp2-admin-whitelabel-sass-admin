Ext.define('CGP.cmspublish.model.CmsPublishModel',{
    extend: 'Ext.data.Model',
    idProperty:'id',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    },{
        name: 'name',
        type: 'string'
    },{
        name: 'description',
        type: 'string'
    },{
        name: 'type',
        type: 'string'
    }, {
        name: 'tasks',
        type: 'array',
        serialize: function (value) {
            if(Ext.isEmpty(value)){
                return [];
            }
            return value;
        }
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/cmsPublishs',
        reader: {
            root: 'data',
            type: 'json'
        }
    }
})