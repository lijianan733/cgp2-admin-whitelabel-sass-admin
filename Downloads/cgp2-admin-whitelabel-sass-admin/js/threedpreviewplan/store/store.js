Ext.define("CGP.threedpreviewplan.store.store",{
    extend : 'Ext.data.Store',

    model : "CGP.threedpreviewplan.model.model",
    remoteSort: 'true',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/threedmodeltestplans',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    sorters: [{
        property: '_id',
        direction: 'DESC'
    }],
    autoLoad: true
});
