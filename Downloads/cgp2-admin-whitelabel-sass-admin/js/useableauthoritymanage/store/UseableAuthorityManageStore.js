/**
 * Created by nan on 2018/8/10.
 */
Ext.define('CGP.useableauthoritymanage.store.UseableAuthorityManageStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.useableauthoritymanage.model.UseableAuthorityManageModel',
    pageSize: 25,
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/security/privileges',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
})