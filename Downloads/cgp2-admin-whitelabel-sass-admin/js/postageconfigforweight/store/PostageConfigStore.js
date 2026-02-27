/**
 * Created by nan on 2023/9/12
 * 国家
 * */
Ext.Loader.syncRequire([
    'CGP.postageconfigforweight.model.PostageConfigModel',
]);
Ext.define('CGP.postageconfigforweight.store.PostageConfigStore', {
    extend: 'Ext.data.Store',
    requires: ['CGP.postageconfigforweight.model.PostageConfigModel'],
    model: 'CGP.postageconfigforweight.model.PostageConfigModel',
    remoteSort: true,
    pageSize: 25,
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/postageConfigs',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
})