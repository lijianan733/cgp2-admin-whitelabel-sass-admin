Ext.define("CGP.rttypes.store.AllAttribute", {

    extend: 'Ext.data.Store',
    requires: ['CGP.rtattribute.model.Attribute'],

    model: 'CGP.rtattribute.model.Attribute',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/rtAttributeDefs',
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