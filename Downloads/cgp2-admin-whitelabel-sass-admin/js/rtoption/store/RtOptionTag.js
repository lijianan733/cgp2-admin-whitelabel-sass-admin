Ext.define('CGP.rtoption.store.RtOptionTag', {
    extend: 'Ext.data.Store',
    requires: ['CGP.rtoption.model.RtOptionTag'],

    model: 'CGP.rtoption.model.RtOptionTag',
    pageSize:25,
    remoteSort: true,
    sorters: [{
        property: 'id',
        direction: 'DESC'
    }],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/rtOptionTags',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});