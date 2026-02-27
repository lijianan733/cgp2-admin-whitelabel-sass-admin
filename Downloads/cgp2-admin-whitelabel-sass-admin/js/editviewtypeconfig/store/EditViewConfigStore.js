/**
 * Created by nan on 2020/7/29.
 */
Ext.Loader.syncRequire([
    'CGP.editviewtypeconfig.model.EditViewConfigModel'
])
Ext.define("CGP.editviewtypeconfig.store.EditViewConfigStore", {
    extend: 'Ext.data.Store',
    requires: ["CGP.editviewtypeconfig.model.EditViewConfigModel"],
    model: 'CGP.editviewtypeconfig.model.EditViewConfigModel',
    proxy: {
        url: adminPath + 'api/editViewTypeDtos',
        type: 'uxrest',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});
