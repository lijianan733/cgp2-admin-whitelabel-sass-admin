/**
 * Created by nan on 2020/8/1.
 * 新的一套配置界面，旧的界面也保留，根据builderViewVersion来进入不同的界面
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.config.Config'
])
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var navigationDTOId = JSGetQueryString('navigationId');
    var productViewConfigId = JSGetQueryString('productViewConfigId');
    var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
    var productId = builderConfigTab.productId;
    window.componentArr = [];//创建一个全局的变量，用于记录组件列表
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

    Ext.create('CGP.color.store.ColorStore', {
        storeId: 'colorStore',
        autoLoad: true,
        params: {
            filter: Ext.JSON.encode([{
                name: 'clazz',
                type: 'string',
                value: 'com.qpp.cgp.domain.common.color.RgbColor'
            }])
        }
    });
    Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.store.3DModelStore', {
        storeId: '3DModelStore',
    });
    Ext.create('CGP.rtattribute.store.RtType', {
        autoLoad: true,
        storeId: 'rtTypeTreeStore',
        root: {
            _id: 'root',
            name: null,
            id: 'root'
        },
        params: {
            filter: Ext.JSON.encode([{
                name: 'tags',
                type: 'string',
                value: 'RuntimeModelEditor'
            }])
        },
        listeners: {
            load: function (store, currentNode, childrenNode) {
                var tree = this.tree;
                var root = tree.getRootNode();
                var nodeId = childrenNode[0].get('_id');
                root.set('_id', nodeId);
                this.load();
            },
            single: true//使监听只执行一次
        }
    });
    Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.store.ViewConfigV3DTOStore', {
        storeId: 'viewConfigV3DTOStore',
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
                window.componentArr = [];
                if (records.length > 0) {
                    recordData = records[0].getData();
                    //全部组件数组
                    window.componentArr = recordData.componentConfigs;
                }
                //自定义的数组
                var editViewPanel = Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.ViewConfigPanel', {
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
