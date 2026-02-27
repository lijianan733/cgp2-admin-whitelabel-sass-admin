/**
 * @author xiu
 * @date 2024/7/29
 */
Ext.Loader.syncRequire([
    'CGP.tools.downLoadImage.view.CreateDownLoadImage',
])
Ext.onReady(function () {
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'down_load_image',
            }
        ]
    })
})