/**
 * Created by nan on 2018/8/16.
 */
Ext.define('CGP.acprole.store.AcpRoleStore', {
    extend: 'Ext.data.Store',
    model: 'CGP.acprole.model.AcpRoleModel',
    pageSize: 25,
    autoLoad: true,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/security/acp',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    }
})