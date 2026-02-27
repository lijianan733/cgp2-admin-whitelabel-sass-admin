/**
 * Created by nan on 2020/7/29.
 */
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var editViewPanel = Ext.create('CGP.editviewtypeconfig.view.EditViewConfigPanel', {});
    page.add(editViewPanel);
})
