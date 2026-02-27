Ext.define('CGP.country.store.CountryStore', {
    extend: 'Ext.data.Store',
    storeId: 'countryStore',
    //model.js
    model: 'CGP.country.model.CountryModel',
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/countries',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
})