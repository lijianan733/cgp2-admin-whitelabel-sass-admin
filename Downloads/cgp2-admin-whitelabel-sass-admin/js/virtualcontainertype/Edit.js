Ext.Loader.syncRequire([
])
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var recordId = JSGetQueryString('id');
    var CustomDataForm = Ext.create('CGP.virtualcontainertype.view.CenterPanel', {
        recordId: recordId
    });
    page.add(CustomDataForm);
});