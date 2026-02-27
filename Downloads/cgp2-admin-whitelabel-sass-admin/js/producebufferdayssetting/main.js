/**
 * @author xiu
 * @date 2025/9/26
 */
Ext.Loader.syncRequire([
    'CGP.producebufferdayssetting.store.ProduceBufferDaysSettingStore',
    'CGP.producebufferdayssetting.controller.Controller',
])
Ext.onReady(function () {
    Ext.create('CGP.producebufferdayssetting.view.CreateGridPage', {
        i18nblock: i18n.getKey('producebufferdayssetting'),
        block: 'producebufferdayssetting',
        editPage: 'edit.html',
    })
});
