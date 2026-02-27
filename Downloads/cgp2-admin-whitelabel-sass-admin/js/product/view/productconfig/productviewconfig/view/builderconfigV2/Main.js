/**
 * Created by nan on 2020/11/5
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productviewconfig.view.builderconfigV2.view.BuilderConfigTab',
    'CGP.font.store.FontStore',
    'CGP.common.commoncomp.QueryGrid'
])
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'builderconfigtab',
            }
        ]
    })
})