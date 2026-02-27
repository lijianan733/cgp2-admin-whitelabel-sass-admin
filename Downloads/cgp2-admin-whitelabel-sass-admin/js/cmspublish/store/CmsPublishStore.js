Ext.define('CGP.cmspublish.store.CmsPublishStore',{
    extend: 'Ext.data.Store',
    model: 'CGP.cmspublish.model.CmsPublishModel',
    pageSize: 25,
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