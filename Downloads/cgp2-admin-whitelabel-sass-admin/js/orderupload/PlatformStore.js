Ext.define('CGP.orderupload.PlatformStore', {
    extend: 'Ext.data.Store',

    fields: [{
        name: 'name',
        type: 'string'
    }, {name: 'value',type: 'string'}],

    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/configurations/supportedThirdOrderPlatform',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    autoLoad: true

});