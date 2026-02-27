Ext.define('CGP.cmspage.store.CmsPublishStore',{
    extend: 'Ext.data.Store',
    pageSize: 25,
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
        type:'uxrest',
        url: adminPath + 'api/cmsPublishs',
        reader: {
            root: 'data.content',
            type: 'json'
        }
    },
    autoLoad: true
})