/***
 *
 *
 */
Ext.define('CGP.zone.store.Zone',{
    extend: 'Ext.data.Store',
    requires:['CGP.zone.model.Zone'],
    model: 'CGP.zone.model.Zone',
    storeId : 'zoneStore',
    remoteSort:false,
    pageSize:25,
    proxy:{
        type:'uxrest',
        url:adminPath + 'api/zones',
        reader:{
            type:'json',
            root:'data.content'
        }
    },
    autoLoad:true
});
