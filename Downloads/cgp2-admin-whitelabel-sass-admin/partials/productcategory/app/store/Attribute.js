Ext.define('CGP.productcategory.store.Attribute', {
    extend: 'Ext.data.Store',

    model: 'CGP.productcategory.model.Attribute',
    remoteSort: false,
    pageSize: 25,

    sorters: [{
        property: 'sortOrder',
        direction: 'ASC'
    }],


    constructor: function (config) {
        this.proxy = {
            type: 'uxrest',
            url: config.url,
            reader: {
                type: 'json',
                root: 'data'
            }
        };

        this.callParent(arguments);

    }

})