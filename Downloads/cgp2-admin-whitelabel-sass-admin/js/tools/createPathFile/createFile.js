/**
 * @author xiu
 * @date 2023/10/16
 */
Ext.Loader.syncRequire([
    'CGP.tools.createPathFile.view.createFile',
])
Ext.onReady(function () {
    Ext.create('Ext.Viewport', {
        layout: 'fit',
        itemId: 'view',
        items: [
            Ext.create('CGP.tools.createPathFile.view.createFile', {})
        ]
    })
})