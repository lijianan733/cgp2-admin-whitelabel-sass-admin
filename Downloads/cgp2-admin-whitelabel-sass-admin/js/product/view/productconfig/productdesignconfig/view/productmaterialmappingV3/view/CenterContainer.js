/**
 * Created by nan on 2020/3/26.
 * 切换物料时，提示保存
 * 1.保存，和删除，触发自定义dirty事件
 *
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.CenterContainer", {
    extend: "Ext.tab.Panel",
    region: 'center',
    controller: null,
    createOrEdit: 'create',
    materialMappingDTOConfig: null,
    productConfigDesignId: null,
    isDirty: false,
    materialId: null,//记录当前显示的是哪个物料
    id: 'productMaterialMappingV3_CenterContainer',
    refreshData: function (materialPath, MMTDetail, ubiMaterialMappingDTOConfig) {
        var me = this;
        me.el.mask('loading...');
        me.materialPath = materialPath;
        me.materialId = MMTDetail ? MMTDetail._id : null;
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
                    if (item.itemId == 'extraConfigForm') {
                        if (MMTDetail.isPackage) {
                            item.tab.show();
                            item.show();
                        } else {
                            item.tab.hide();
                            item.hide();
                        }
                    } else {
                        item.tab.show();
                        item.show();
                    }
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
            var materialMappingDTOConfig = me.materialMappingDTOConfig = ubiMaterialMappingDTOConfig ||
                me.controller.getMaterialMappingDTOConfig(materialPath, me.productConfigDesignId, false,me.configType).pop();
            if (materialMappingDTOConfig) {
                me.createOrEdit = 'edit';
            } else {
                me.createOrEdit = 'create';
            }
            for (var i = 0; i < me.items.items.length; i++) {
                var item = me.items.items[i];
                if (MMTDetail) {
                    item.refreshData(MMTDetail, materialMappingDTOConfig);
                }
            }
            if (me.items.items[0].tab.hidden == false) {
                me.setActiveTab(0);
            }
            me.el.unmask();
            if (MMTDetail) {
                me.fireEvent('completeRefreshData', me);
            }
        }, 100);
    },
    listeners: {
        tabchange: function (tab, newTab, oldTab) {
            if (newTab.itemId == 'materialBomMapping') {
                var gridFields = newTab.query('gridfield');
                gridFields.forEach(function (item) {
                    if (item._grid) {
                        item._grid.getView().refresh();
                    }
                })
            }
            var allHide = true;
            for (var i = 0; i < tab.items.items.length; i++) {
                if (tab.items.items[i].tab.hidden == false) {
                    allHide = false;
                }
            }
            if (allHide == true) {
                tab.tabBar.hide();
                var toolbar = tab.getDockedItems('toolbar[dock="top"]')[0];
                toolbar.hide();
            } else {
                tab.tabBar.show();
                var toolbar = tab.getDockedItems('toolbar[dock="top"]')[0];
                toolbar.show();
            }
        },
        afterrender: function (tabPanel) {
            var toolbar = tabPanel.getDockedItems('toolbar[dock="top"]')[0];
            toolbar.hide();
            tabPanel.tabBar.hide();
            tabPanel.items.items.forEach(function (item) {
                item.tab.hide();
                item.hide();
            })
        },
        completeRefreshData: function (centerPanel) {
            var bomTree = Ext.getCmp('leftBomTree');
            var bomTreeSelectedNode = bomTree.getSelectionModel().getSelection()[0];
            var attributePath = bomTree.attributePath;
            if (bomTreeSelectedNode) {
                if (bomTreeSelectedNode.raw.clazz == 'com.qpp.cgp.domain.bom.bomitem.FixedBOMItem' ||
                    bomTreeSelectedNode.raw.clazz == 'com.qpp.cgp.domain.bom.bomitem.UnassignBOMItem' ||
                    bomTreeSelectedNode.raw.clazz == 'com.qpp.cgp.domain.bom.bomitem.OptionalBOMItem') {
                    var materialBomMapping = centerPanel.getComponent('materialBomMapping');
                    var bomItemConfigFieldset = materialBomMapping.getFieldSetByBomItemId(bomTreeSelectedNode.get('id'));
                    centerPanel.setActiveTab(materialBomMapping);
                    if (bomItemConfigFieldset) {
                        bomItemConfigFieldset.expand();
                    }
                }
            }
            if (attributePath) {
                var spuAttributePanel = centerPanel.getComponent('spuAttributePanel');
                var spuAttributeLeftTree = spuAttributePanel.getComponent('spuAttributeTree');
                centerPanel.setActiveTab(spuAttributePanel);
                spuAttributeLeftTree.selectPath(bomTree.attributePath);
                bomTree.attributePath = null;
            }
        },
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        me.items.items.forEach(function (item) {
            if (item.isValid() == false) {
                isValid = false;
                me.setActiveTab(item);
            }
        });
        return isValid;
    },
    getValue: function () {
        var me = this;
        var result = {};
        var spuAttributePanel = me.getComponent('spuAttributePanel');
        var materialBomMapping = me.getComponent('materialBomMapping');
        var extraConfigForm = me.getComponent('extraConfigForm');
        result = {
            packageQty: extraConfigForm.getValue(),
            productConfigDesignId: me.productConfigDesignId,
            materialPath: me.materialPath,
            clazz: 'com.qpp.cgp.domain.product.config.material.mapping2dto.MaterialMappingDTOConfig',
            spuRtObjectMappings: spuAttributePanel.getValue(),
            bomItemMappings: materialBomMapping.getValue(),
            description: me.materialMappingDTOConfig ? me.materialMappingDTOConfig.description : null
        };
        if(me.configType == 'mappingConfig'){
            delete result.productConfigDesignId;
            result.productConfigMappingId = me.productConfigDesignId;
        }
        result.materialMappingConfigDomain = me.controller.createMaterialMappingConfigDomain(result,me.configType);
        console.log(result);
        return result;
    },
    initComponent: function () {
        var me = this;
        //定义新的事件
        me.addEvents({
            "dirty": true,
            'completeRefreshData': true//配置详情完成刷新
        });
        me.on('dirty', function () {
            this.isDirty = true;
            console.log('dirty');
        }, this);
        var controller = me.controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.Controller');
        var spuAttributePanel = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.SpuAttributePanel', {
            title: i18n.getKey('material') + i18n.getKey('attribute') + i18n.getKey('mapping') + i18n.getKey('config'),
            itemId: 'spuAttributePanel'
        });
        var materialBomMapping = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.MaterialBomMapping', {
            title: i18n.getKey('materialSchema') + i18n.getKey('mapping') + i18n.getKey('config'),
            itemId: 'materialBomMapping'
        });
        var extraConfigForm = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.ExtraConfigForm', {
            itemId: 'extraConfigForm'
        });
        me.items = [spuAttributePanel, materialBomMapping, extraConfigForm];
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                itemId: 'saveBtn',
                handler: function (btn) {
                    var centerPanel = btn.ownerCt.ownerCt;
                    if (centerPanel.isValid()) {
                        var data = centerPanel.getValue();
                        centerPanel.el.mask('loading..');
                        var recordId = me.materialMappingDTOConfig ? me.materialMappingDTOConfig._id : null;
                        setTimeout(function () {
                            controller.saveProductMaterialMappingConfig(data, me.createOrEdit, recordId, me);
                        }, 100)
                    }
                }
            }
        ];
        me.callParent();
        me.on('afterrender', function () {
            var page = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    }

})
