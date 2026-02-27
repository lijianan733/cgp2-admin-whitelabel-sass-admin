/**
 * @Description:
 * @author nan
 * @date 2023/2/16
 */
Ext.Loader.syncRequire([
    'CGP.tools.expressiontemplate.view.ExpressionTemplateGrid'
])
Ext.onReady(function () {
    var view = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'expressiontemplategrid'
        }]
    })
})