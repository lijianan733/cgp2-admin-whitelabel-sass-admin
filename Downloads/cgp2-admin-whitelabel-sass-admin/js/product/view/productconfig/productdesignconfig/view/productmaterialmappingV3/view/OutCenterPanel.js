/**
 * Created by nan on 2020/4/22.
 * ubi下的smt可以配置多个mapping
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.OutCenterPanel', {
    extend: 'Ext.panel.Panel',
    layout: 'border',
    region: 'center',
    productConfigDesignId: null,
    materialDetail: null,
    materialPath: null,
    materialId: null,
    /**
     *
     * @param materialPath
     * @param MMTDetail
     * @param isMultiMappings 是否可以有多个物料映射
     */
    refreshData: function (materialPath, MMTDetail, isMultiMappings) {
        var me = this;
        me.el.mask('loading...');
        me.materialPath = materialPath;
        me.materialId = MMTDetail ? MMTDetail._id : null;
        setTimeout(function () {
            for (var i = 0; i < me.items.items.length; i++) {
                var item = me.items.items[i];
                if (item.xtype == 'bordersplitter') {
                    continue;
                }
                if (MMTDetail) {
                    if (isMultiMappings == true) {//待定件可以有多个mapping
                        if (item.itemId == 'centerContainer') {
                            item.refreshData(/*materialPath, MMTDetail*/);
                        } else {//
                            item.show();
                            item.refreshData(materialPath, MMTDetail);
                        }
                    } else {
                        if (item.itemId == 'centerContainer') {
                            item.refreshData(materialPath, MMTDetail);
                        } else {//
                            item.hide();
                        }
                    }
                } else {
                    if (item.itemId == 'centerContainer') {
                        item.refreshData();
                    } else {
                        item.hide();
                    }
                }
            }
            me.el.unmask();
        }, 100);

        /*
                   setTimeout(function () {
                       if (MMTDetail) {
                           var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
                           toolbar.show();
                           var saveBtn = toolbar.getComponent('saveBtn');
                           if (MMTDetail.clazz == 'com.qpp.cgp.domain.bom.MaterialSpu') {
                               saveBtn.setText('创建空白的配置');
                           } else {
                               saveBtn.setText(i18n.getKey('save'));
                           }
                           for (var i = 0; i < me.items.items.length; i++) {
                               var item = me.items.items[i];
                               item.tab.show();
                               item.show();
                               me.tabBar.show();
                           }
                       } else {
                           var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
                           toolbar.hide();
                           for (var i = 0; i < me.items.items.length; i++) {
                               var item = me.items.items[i];
                               item.tab.hide();
                               item.hide();
                               me.tabBar.hide();
                           }
                       }
                       var materialMappingDTOConfig = me.materialMappingDTOConfig = me.controller.getMaterialMappingDTOConfig(materialPath, me.productConfigDesignId).pop();
                       for (var i = 0; i < me.items.items.length; i++) {
                           var item = me.items.items[i];
                           if (MMTDetail) {
                               item.show();
                               item.refreshData(MMTDetail, materialMappingDTOConfig);
                           }
                       }
                       if (materialMappingDTOConfig) {
                           me.createOrEdit = 'edit';

                       } else {
                           me.createOrEdit = 'create';
                       }
                       me.el.unmask();
                       me.setActiveTab(0);
                   }, 100)
        */
    },
    initComponent: function () {
        var me = this;
        var productConfigDesignId = me.productConfigDesignId;
        var materialDetail = me.materialDetail;
        var centerContainer = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.CenterContainer', {
            itemId: 'centerContainer',
            productConfigDesignId: productConfigDesignId,
            configType: me.configType,
            MMTDetail: materialDetail,

        });
        var manageMaterialMappingLeftGrid = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.ManageMaterialMappingLeftGrid', {
            itemId: 'manageMaterialMappingLeftGrid',
            productConfigDesignId: productConfigDesignId,
            region: 'west',
            configType: me.configType,
            MMTDetail: materialDetail,
        });
        me.items = [
            manageMaterialMappingLeftGrid,
            centerContainer
        ];
        me.callParent();
    }
})
