Ext.define("CGP.cmspage.store.Website", {
    extend: 'Ext.data.Store',
    pageSize: 25,
    fields: [
        {
            name: 'id',
            type: 'int',
            useNull:true
        },
        'name'
    ],
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

