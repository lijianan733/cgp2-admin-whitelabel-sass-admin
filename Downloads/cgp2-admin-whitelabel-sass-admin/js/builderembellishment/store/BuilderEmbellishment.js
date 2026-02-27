Ext.define("CGP.builderembellishment.store.BuilderEmbellishment",{
	extend : "Ext.data.Store",
	model : "CGP.builderembellishment.model.BuilderEmbellishment",
	remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/admin/builderembellishment',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});
