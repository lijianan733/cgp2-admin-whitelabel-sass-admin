/**
 * Created by nan on 2018/8/10.
 */
Ext.define('CGP.resourcesoperation.store.ResourcesOperationStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.resourcesoperation.model.ResourcesOperationModel',
    pageSize: 25,
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/security/operations',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
})