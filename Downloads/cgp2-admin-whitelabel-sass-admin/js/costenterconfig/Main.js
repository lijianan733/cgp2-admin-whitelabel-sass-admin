/**
 * @author xiu
 * @date 2022/9/19
 */
Ext.syncRequire([
    'CGP.costenterconfig.component.tabPanel',
])
Ext.onReady(function () {
    var tabPanel = Ext.create('CGP.costenterconfig.component.tabPanel');
    Ext.create('Ext.Viewport', {
        layout: 'fit',
        items: [tabPanel]
    });
})