/**
 * Created by shirley on 2021/8/31
 * 国家
 * */
Ext.Loader.syncRequire([
    'CGP.areashippingconfigtemplate.model.CountriesModel'
]);
Ext.define('CGP.areashippingconfigtemplate.store.CountriesStore', {
    extend: 'Ext.data.Store',
    requires:['CGP.areashippingconfigtemplate.model.CountriesModel'],
    model:'CGP.areashippingconfigtemplate.model.CountriesModel',
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