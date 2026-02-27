/**
 * Created by nan on 2018/10/24.
 */
Ext.define('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.ProduceComponentConfigPanel', {
    extend: 'Ext.panel.Panel',
    requires: ['CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.model.Material',
        'Ext.ux.form.field.MultiCombo'],
    itemId: 'productComponentConfig',
    closable: true,
    layout: {
        type: 'border'
    },
    materialId: null,
    productId: null,
    productType: null,//产品类型，用于判断有无同步删库产品生产组件配置功能
    productConfigBomId: null,
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
        var store = Ext.create('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.store.ProduceComponentConfigStore', {
            params: {
                filter: Ext.JSON.encode([
                    {
                        name: 'productConfigBomId',
                        type: 'number',
                        value: me.productConfigBomId
                    }
                ])
            },
            listeners: {
                load: {
                    fn: function (store, records) {
                        var productBomTree = Ext.create('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.view.ProductBomTree', {
                            materialId: me.materialId,
                            productId: me.productId,
                            productConfigBomId: me.productConfigBomId,
                            produceComponentConfigStore: store,
                            productType: me.productType
                        });
                        var productBomPrintConfigGrid = Ext.create('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.view.ProduceComponentConfigGrid', {
                            materialId: me.materialId,
                            productId: me.productId,
                            productConfigBomId: me.productConfigBomId,
                            produceComponentConfigStore: store
                        });
                        me.add([productBomTree, productBomPrintConfigGrid])
                    }, scope: this, single: true}
            }
        });

    }
})