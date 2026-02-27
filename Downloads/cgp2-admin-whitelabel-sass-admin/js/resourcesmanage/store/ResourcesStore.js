/**
 * Created by nan on 2018/8/9.
 */
Ext.define('CGP.resourcesmanage.store.ResourcesStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.resourcesmanage.model.ResourcesModel',
    pageSize: 25,
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath+'api/security/resources',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
})