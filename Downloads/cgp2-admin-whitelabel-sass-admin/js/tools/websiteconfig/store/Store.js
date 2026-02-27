/**
 * @Description:
 * @author nan
 * @date 2023/2/16
 */
Ext.define('CGP.tools.websiteconfig.store.Store', {
    extend: 'Ext.data.Store',
    autoLoad: true,
    autoSync: true,
    model: 'CGP.tools.websiteconfig.model.Model',
    require: ['CGP.tools.websiteconfig.model.Model'],
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/webSiteConfigs',
        reader: {
            idProperty: '_id',
            type: 'json',
            root: 'data.content'
        }
    },
});
