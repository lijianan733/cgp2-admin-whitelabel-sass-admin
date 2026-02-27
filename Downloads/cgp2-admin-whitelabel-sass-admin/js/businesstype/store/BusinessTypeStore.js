/**
 * Created by nan on 2020/4/27.
 */
Ext.define('CGP.businesstype.store.BusinessTypeStore', {
    requires: ['CGP.businesstype.model.BusinessTypeModel'],
    model: 'CGP.businesstype.model.BusinessTypeModel',
    proxy: {
        type: 'uxrest',
        url: adminPath + 'api/businessLibrary',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});
