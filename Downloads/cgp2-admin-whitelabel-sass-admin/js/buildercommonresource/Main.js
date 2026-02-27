/**
 * Created by nan on 2020/10/29
 */
Ext.Loader.syncRequire([
    'CGP.buildercommonresource.view.CommonResourceTab'
])
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'commonresourcetab'
            }
        ]
    });
});

