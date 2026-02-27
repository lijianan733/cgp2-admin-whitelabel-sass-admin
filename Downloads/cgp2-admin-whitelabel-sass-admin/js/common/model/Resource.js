Ext.define('CGP.common.model.Resource',{
    extend:'Ext.data.Model',
    idProperty:'id',
    fields:[{
        name : 'id',
        type : 'int',
        useNull: true
    },{
        name:'name',
        type:'string'
    },{
        name:'type',
        type:'string'
    },{
        name:'value',
        type:'string'
    },{
        name:'cultureCode',
        type:'string'
    },{
        name:'active',
        type:'boolean'
    },{
        name:'multilingualKey',
        type:'string',
        convert: function (value, record) {
            return record.raw?.clazz;
        }
    }],
    proxy : {
        //appendId:false,
        type : 'uxrest',
        url : adminPath + 'api/resources',
        reader:{
            type:'json',
            root:'data'
        }
    }
});