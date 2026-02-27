/**
 * Created by nan on 2020/8/1.
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.config.Config'
])
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var navigationDTOId = JSGetQueryString('navigationId');
    var productViewConfigId = JSGetQueryString('productViewConfigId');
    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
    var productId = builderConfigTab.productId;
    var profileStore = Ext.create('CGP.product.view.productattributeprofile.store.ProfileStore', {
        storeId: 'profileStore',
        params: {
            filter: Ext.JSON.encode([{
                name: 'productId',
                type: 'number',
                value: productId
            }])
        }
    });
    Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.store.ViewConfigV2DTOStore', {
        params: {
            filter: Ext.JSON.encode([{
                name: 'productConfigViewId',
                type: 'number',
                value: productViewConfigId
            }])
        },
        listeners: {
            load: function (store, records) {
                var recordData = null;
                if (records.length > 0) {
                    recordData = records[0].getData();
                }
                var editViewPanel = Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigV2.view.ViewConfigPanel', {
                    navigationDTOId: navigationDTOId,
                    productViewConfigId: productViewConfigId,
                    recordData: recordData,
                    createOrEdit: recordData ? 'edit' : 'create'
                });
                page.add(editViewPanel);
            }
        }
    })

})
