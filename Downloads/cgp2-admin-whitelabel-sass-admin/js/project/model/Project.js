Ext.define('CGP.project.model.Project',{
	extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'int',
        useNull: true
    }, {
        name: 'name',
        type: 'string'
    }, {
        name: 'uuid',
        type: 'string'
    }, {
        name: 'thumbnail',
        type: 'string'
    },{
        name: 'projectStatus',
        type: 'string'
    }, {
        name: 'createdDate',
        type: 'date',
        dateWriteFormat: 'Uu',
        convert: function (value) {
            if(!Ext.isEmpty(value)){
                return new Date(value);
            }
        }
    },{
        name: 'productInstanceId',
        type: 'string'
    }, {
        name: 'user',
        type: 'object'
    }, {
        name: 'product',
        type: 'object'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + "api/projects",
        reader: {
            type: 'json',
            root: 'data'
        }
    }
});