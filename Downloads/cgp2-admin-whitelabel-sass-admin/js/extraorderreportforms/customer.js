/**
 * @author xiu
 * @date 2025/1/21
 */
Ext.Loader.syncRequire([
    'CGP.extraorderreportforms.store.ExtraorderreportformsStore',
    'CGP.extraorderreportforms.controller.Controller',
])
Ext.onReady(function () {
    Ext.create('CGP.extraorderreportforms.view.CreateGridPage', {
        i18nblock: i18n.getKey('extraorderreportforms'),
        block: 'extraorderreportforms',
        type: 'customer',
    })
});
