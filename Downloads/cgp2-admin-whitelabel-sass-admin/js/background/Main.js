/**
 * Created by nan on 2020/12/18
 */
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var tab = Ext.create('CGP.background.view.MainPanel', {});
    page.add(tab);
})
