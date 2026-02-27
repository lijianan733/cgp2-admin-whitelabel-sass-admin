Ext.define("CGP.partner.store.WebsiteAll",{
	extend : 'Ext.data.Store',

	model : 'CGP.partner.model.Website',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/websites',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});
