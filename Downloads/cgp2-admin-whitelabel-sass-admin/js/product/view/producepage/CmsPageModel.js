Ext.define('CGP.product.view.producepage.CmsPageModel', {
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
        type: 'string'
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
        name: 'website',
        type: 'object'
    }],
    proxy : {
        //appendId:false,
        type : 'uxrest',
        url : adminPath + 'api/admin/cmsPage',
        reader:{
            type:'json',
            root:'data'
        }
    }
});