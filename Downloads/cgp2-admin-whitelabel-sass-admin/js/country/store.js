Ext.Loader.syncRequire([
    'CGP.country.model.CountryModel',
    'CGP.country.store.CountryStore'
])
var store = Ext.create('CGP.country.store.CountryStore');