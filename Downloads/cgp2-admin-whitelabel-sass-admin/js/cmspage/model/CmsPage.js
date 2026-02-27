Ext.define('CGP.cmspage.model.CmsPage', {
    extend : 'Ext.data.Model',
    idProperty:'id',
    fields : [ {
        name : 'id',
        type : 'int',
        useNull: true
    },{
        name: 'type',
        type: 'string'
    },{
        name:'name',
        type:'string'
    },{
        name: 'description',
        type: 'string',
        useNull: true
    },{
        name:'outputUrl',
        type:'string'
    },{
        name:'pageTitle',
        type:'string'
    },{
        name:'pageKeywords',
        type:'string'
    },{
        name:'pageDescription',
        type:'string'
    },{
        name:'websiteId',
        type:'int'
    },{
        name: 'sourcePath',
        type: 'string'
    },{
        name: 'filter',
        type: 'string',
        useNull: true
    },{
        name: 'productFilterId',
        type: 'int',
        useNull:true
    },{
        name: 'productQueryId',
        type: 'int',
        useNull:true
    },{
        name: 'enable',
        type: 'boolean'
    },{
        name:'website',
        type: 'object'
    }],
    proxy : {
        //appendId:false,
        type : 'uxrest',
        url : adminPath + 'api/cmsPages',
        reader:{
            type:'json',
            root:'data'
        }
    }
});