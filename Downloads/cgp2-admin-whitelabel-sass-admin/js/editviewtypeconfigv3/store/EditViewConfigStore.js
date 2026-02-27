/**
 * Created by nan on 2020/7/29.
 */
Ext.Loader.syncRequire([
    'CGP.editviewtypeconfigv3.model.EditViewConfigModel'
])
Ext.define("CGP.editviewtypeconfigv3.store.EditViewConfigStore", {
    extend: 'Ext.data.Store',
    requires: ["CGP.editviewtypeconfigv3.model.EditViewConfigModel"],
    model: 'CGP.editviewtypeconfigv3.model.EditViewConfigModel',
    proxy: {
        url: adminPath + 'api/editViewTypeDtos/v3',
        type: 'uxrest',
        reader: {
            type: 'json',
            root: 'data.content'
        }
    },
    autoLoad: true
});
