Ext.Loader.syncRequire(['CGP.product.view.productconfig.productbomconfig.model.ProductBomConfigModel']);
Ext.define('CGP.product.view.productconfig.ProductConfigTab', {
    extend: 'Ext.tab.Panel',
    header: false,
    productBomConfig: path + 'partials/product/productconfig/' + 'productbomconfig' + '.html',
    productImpositionCfg: path + 'partials/product/productconfig/' + 'productimpositioncfg' + '.html',
    productViewCfg: path + 'partials/product/productconfig/' + 'productviewconfig' + '.html',
    productDesignCfg: path + 'partials/product/productconfig/' + 'productdesignconfig' + '.html',
    productMappingCfg: path + 'partials/product/productconfig/' + 'productmappingconfig' + '.html',
    id: 'builderConfigTab',
    region: 'center',
    activeTab: 0,
    initComponent: function () {
        var me = this;
        me.productId = me.getQueryString('productId');
        me.productConfigId = me.getQueryString('productConfigId');
        me.productDesignCfg += '?productId=' + me.productId;
        me.productMappingCfg += '?productId=' + me.productId;
        me.configurableProductId = JSGetQueryString('configurableProductId');//用于page中进行过滤的参数
        me.isLock = me.getQueryString('isLock') == 'true' ? true : false;
        me.productType = me.getQueryString('productType');
        var activeTab = me.getQueryString('activeTab');//这是用于调整tab显示那个子panel
        var viewConfigId = me.getQueryString('viewConfigId');//用于page中进行过滤的参数
        if (viewConfigId) {
            me.productViewCfg = me.productViewCfg + '?id=' + viewConfigId;
        }
        var isSpecialSku = (me.productType == 'SKU' && Ext.isEmpty(me.configurableProductId));//是sku且没有父可配置产品
        /*me.tabBar={
         items:[
         {
         xtype:'button',
         text:'refresh',
         listeners:{
         'click':function(){
         alert('you clicked a tab btn');
         }
         }
         }]
         };*/
        me.items = [
            {
                id: 'productBomConfig',
                title: i18n.getKey('productBomConfig'),
                html: '<iframe id="tabs_iframe_' + 'productBomConfig' + '" src="' + me.productBomConfig + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: false
            },
            {
                id: 'productImpositionCfg',
                title: i18n.getKey("productImpositionCfg"),
                html: '<iframe id="tabs_iframe_' + 'productImpositionCfg' + '" src="' + me.productImpositionCfg + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: false
            },
            {
                id: 'productViewCfg',
                title: i18n.getKey('productViewCfg'),
                html: '<iframe id="tabs_iframe_' + 'productViewCfg' + '" src="' + me.productViewCfg + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: false
            },
            {
                id: 'productDesignCfg',
                title: i18n.getKey('productDesignConfig'),
                html: '<iframe id="tabs_iframe_' + 'productDesignCfg' + '" src="' + me.productDesignCfg + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: false
            },
            {
                id: 'productMappingCfg',
                title: i18n.getKey('product') + i18n.getKey('mapping') + i18n.getKey('config'),
                hidden: isSpecialSku,
                html: '<iframe id="tabs_iframe_' + 'productMappingConfig' + '" src="' + me.productMappingCfg + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: false
            }
        ];
        me.callParent(arguments);
        if (activeTab) {
            me.setActiveTab(parseInt(activeTab) - 1)
        }
    },
    //添加一个BuilderBomConfig   编辑页 到tabPanel中
    addBuilderBomConfigEditTab: function (id, tabTitle) {
        var me = this;
        var url = path + 'partials/product/productconfig/' + 'productbomconfigedit' + '.html';
        var title = tabTitle + "_" + i18n.getKey('create');
        if (id != null && id != 'undefined') {
            url = url + '?id=' + id;
            title = tabTitle + "_" + i18n.getKey('edit');
        }

        var tab = Ext.getCmp('productbomconfigedit');
        if (tab == null) {
            var tab = me.add({
                id: 'productbomconfigedit',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    },
    //添加一个发送给客服的订单邮件模版  编辑页  到tabPanel页
    addBuilderImpositionCfgEditTab: function (id, tabTitle) {
        var me = this;
        var url = path + 'partials/product/productconfig/' + 'productimpositioncfgedit' + '.html';
        var title = tabTitle + "_" + i18n.getKey('create');
        if (id != null && id != 'undefined') {
            url = url + '?id=' + id;
            title = tabTitle + "_" + i18n.getKey('edit');
        }
        var tab = Ext.getCmp('productimpositioncfgedit');
        if (tab == null) {
            var tab = me.add({
                id: 'productimpositioncfgedit',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    },
    addBuilderViewCfgEditTab: function (id, tabTitle) {
        var me = this;
        var url = path + 'partials/product/productconfig/' + 'productviewconfigedit' + '.html';
        var title = tabTitle + "_" + i18n.getKey('create');
        if (id != null && id != 'undefined') {
            url = url + '?id=' + id;
            title = tabTitle + "_" + i18n.getKey('edit');
        }

        var tab = Ext.getCmp('productviewconfigedit');
        if (tab == null) {
            var tab = me.add({
                id: 'productviewconfigedit',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    },
    addProductDesignCfgEditTab: function (id, tabTitle) {
        var me = this;
        var url = path + 'partials/product/productconfig/' + 'productdesignconfigedit' + '.html';
        var title = tabTitle + "_" + i18n.getKey('create');
        if (id != null && id != 'undefined') {
            url = url + '?id=' + id;
            title = tabTitle + "_" + i18n.getKey('edit');
        }

        var tab = Ext.getCmp('productdesignconfigedit');
        if (tab == null) {
            var tab = me.add({
                id: 'productdesignconfigedit',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    },
    addProductMappingCfgEditTab: function (id, tabTitle) {
        var me = this;
        var url = path + 'partials/product/productconfig/' + 'productmappingconfigedit' + '.html';
        var title = tabTitle + "_" + i18n.getKey('create');
        if (id != null && id != 'undefined') {
            url = url + '?id=' + id;
            title = tabTitle + "_" + i18n.getKey('edit');
        }

        var tab = Ext.getCmp('productmappingconfigedit');
        if (tab == null) {
            var tab = me.add({
                id: 'productmappingconfigedit',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    },


    managerBuilderConfig: function (id, productViewConfigId) {
        var me = this;
        var url = path + 'partials/product/productconfig/' + 'managerbuilderconfig' + '.html?id=' + id + '&productViewConfigId=' + productViewConfigId;
        var title = i18n.getKey('manager') + i18n.getKey('builderConfig') + '(' + i18n.getKey('productViewCfg') + ':' + productViewConfigId + ')';
        var tab = Ext.getCmp('managerBuilderConfig');
        if (tab == null) {
            var tab = me.add({
                id: 'managerBuilderConfig',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    },
    /**
     * 管理builder配置V2版本
     * @param id
     * @param productViewConfigId
     */
    beforeManagerBuilderConfigV2: function (id, productViewConfigId, builderViewVersion) {
        var me = this;
        var preUrl = adminPath + 'api/builderconfigs/v2?filter=[{"name":"productConfigViewId","type":"number","value":"' + productViewConfigId + '"}]&page=1&start=0&limit=25'
        JSAjaxRequest(preUrl, "GET", true, null, false, function (require, success, response) {
            if (success) {
                var responseText = Ext.JSON.decode(response.responseText);
                if (responseText.success) {
                    var data = responseText.data.content;
                    if (data.length > 0) {
                        me.managerBuilderConfigV2(id, productViewConfigId, builderViewVersion, 'edit');
                    } else {
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否创建新的配置?'), function (selector) {
                            if (selector == 'yes') {
                                me.managerBuilderConfigV2(id, productViewConfigId, builderViewVersion, 'create');
                            }
                        })
                    }
                }
            }
        }, false);

    },
    managerBuilderConfigV2: function (id, productViewConfigId, builderViewVersion, status) {
        var me = this;
        var url = path + 'partials/product/productconfig/productviewconfig/builderconfigv2/main.html?id=' + id + '&productViewConfigId=' + productViewConfigId + '&builderViewVersion=' + builderViewVersion;
        var title = i18n.getKey(status) + '_' + i18n.getKey('builderConfig') + '(' + i18n.getKey('productViewCfg') + ':' + productViewConfigId + ')';
        var tab = Ext.getCmp('managerBuilderConfigV2');
        if (tab == null) {
            var tab = me.add({
                id: 'managerBuilderConfigV2',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%"' +
                    ' frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%"' +
                ' frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
        }
        me.setActiveTab(tab);
    },

    managerNavigationTree: function (productViewConfigId, navigationId, haveRootNode) {
        var me = this;
        var url = path + 'partials/product/productconfig/productviewconfig/navigationtree/main.html?navigationId=' + navigationId + '&productViewConfigId=' + productViewConfigId + '&haveRootNode=' + haveRootNode;
        var title = i18n.getKey('manager') + i18n.getKey('navigation') + i18n.getKey('config') + '(' + i18n.getKey('productViewCfg') + ':' + productViewConfigId + ')';
        var tab = Ext.getCmp('navigationTree');
        if (tab == null) {
            var tab = me.add({
                id: 'navigationTree',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    }
    ,
    managerProductMaterialViewType: function (productConfigDesignId, productBomConfigId, productId, materialViewTypeId, title) {
        var me = this;
        var url = path + "partials/product/productconfig/productdesignconfig/productmaterialviewtype/main.html" +
            "?productConfigDesignId=" + productConfigDesignId +
            '&productBomConfigId=' + productBomConfigId +
            '&productId=' + productId +
            '&productMaterialViewTypeId=' + materialViewTypeId;
        title = title ?? i18n.getKey('manager') + i18n.getKey('product') + i18n.getKey('material') + i18n.getKey('view') + i18n.getKey('type');
        var tab = Ext.getCmp('managerProductMaterialViewtype');
        if (tab == null) {
            var tab = me.add({
                id: 'managerProductMaterialViewtype',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    }
    ,
    managerSbomProductMaterialViewType: function (productConfigDesignId, productBomConfigId, productId, materialViewTypeId, title) {
        var me = this;
        CGP.product.view.productconfig.productbomconfig.model.ProductBomConfigModel.load(productBomConfigId, {
            scope: this,
            failure: function (record, operation) {
                Ext.Msg.alert(i18n.getKey('prompt'), '加载productBomConfig失败！')
            },
            success: function (record, operation) {
                //do something if the load succeeded
                var materialId = record.get('productMaterialId');
                var url = path + "partials/product/productconfig/productdesignconfig/salematerialbommvtmanage/main.html" +
                    "?productConfigDesignId=" + productConfigDesignId +
                    '&productBomConfigId=' + productBomConfigId +
                    '&productId=' + productId +
                    '&materialId=' + materialId +
                    '&productMaterialViewTypeId=' + materialViewTypeId;
                title = title ?? i18n.getKey('manager') + i18n.getKey('product') + i18n.getKey('material') + i18n.getKey('view') + i18n.getKey('type');
                var tab = Ext.getCmp('managerSbomProductMaterialViewType');
                if (tab == null) {
                    var tab = me.add({
                        id: 'managerSbomProductMaterialViewType',
                        title: title,
                        html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                        closable: true
                    });
                } else {
                    tab.setTitle(title);
                    tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

                }
                me.setActiveTab(tab);
            }
        })

    }
    ,
    editProductMaterialViewType: function (recordId, productId, productConfigDesignId, productBomConfigId, schemaVersion) {
        var me = this;
        var url = path + "partials/product/productconfig/productdesignconfig/productmaterialviewtype/edit.html" +
            "?productConfigDesignId=" + productConfigDesignId +
            '&productBomConfigId=' + productBomConfigId +
            '&productId=' + productId +
            '&schemaVersion=' + schemaVersion;
        if (recordId) {
            url += '&recordId=' + recordId;
        }
        var title = (recordId ? i18n.getKey('edit') : i18n.getKey('create')) + i18n.getKey('product') + i18n.getKey('material') + i18n.getKey('view') + i18n.getKey('type');
        var tab = Ext.getCmp('editProductMaterialViewType');
        if (tab == null) {
            var tab = me.add({
                id: 'editProductMaterialViewType',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
        }
        me.setActiveTab(tab);
    }
    ,
    managerPcsPreprocessConfig: function (sourceId) {
        var me = this;
        var url = path + "partials/product/productconfig/productdesignconfig/pcspreprocessconfig/main.html" +
            "?PMVTId=" + sourceId
        var title = i18n.getKey('manager') + i18n.getKey('pcs') + i18n.getKey('preprocess');
        var tab = Ext.getCmp('managerpcsPreprocess');
        if (tab == null) {
            var tab = me.add({
                id: 'managerpcsPreprocess',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    }
    ,
    managerMaterialTypeToSpuConfigs: function (productConfigDesignId, productBomConfigId) {
        var me = this;
        var url = path + "partials/product/productconfig/managermaterialtypetospuconfigs.html?productConfigDesignId=" + productConfigDesignId + '&productBomConfigId=' + productBomConfigId;
        var title = i18n.getKey('manager') + i18n.getKey('materialTypeToSpuConfigs');
        var tab = Ext.getCmp('managermaterialtypetospuconfigs');
        if (tab == null) {
            var tab = me.add({
                id: 'managermaterialtypetospuconfigs',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    }
    ,
    managerMaterialMappings: function (productConfigDesignId, productBomConfigId) {
        var me = this;
        var url = path + "partials/product/productconfig/managermaterialmappings.html?productConfigDesignId=" + productConfigDesignId + '&productBomConfigId=' + productBomConfigId;
        var title = i18n.getKey('manager') + i18n.getKey('materialMappings');
        var tab = Ext.getCmp('managermaterialmappings');
        if (tab == null) {
            var tab = me.add({
                id: 'managermaterialmappings',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    }
    ,
    managerMaterialMappingConfigsV2: function (productConfigDesignId, productBomConfigId) {
        var me = this;
        var url = path + "partials/product/productconfig/managermaterialmappingsV2.html?productConfigDesignId=" + productConfigDesignId + '&productBomConfigId=' + productBomConfigId;
        var title = i18n.getKey('manager') + i18n.getKey('materialMappings');
        var tab = Ext.getCmp('managermaterialmappingsV2');
        if (tab == null) {
            var tab = me.add({
                id: 'managermaterialmappingsV2',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    }
    ,
    /**
     * 产品映射配置，配置产品中的待定价和可选件的数量规则和物料选择规则
     * @param productConfigDesignId 映射关联的配置编号
     * @param productBomConfigId
     * @param configType 物料映射关联的产品配置类型（designConfig或mappingConfig）
     */
    managerMaterialMappingConfigV3: function (productConfigDesignId, productBomConfigId, productId, productBomConfig, configType) {
        var me = this;
        var MMTId = null;
        MMTId = productBomConfig[productBomConfig.length - 1].productMaterialId;
        var url = path + "partials/product/productconfig/productdesignconfig/managermaterialmappingv3/main.html" +
            "?productConfigDesignId=" + productConfigDesignId +
            '&productBomConfigId=' + productBomConfigId +
            '&productId=' + productId +
            '&MMTId=' + MMTId + '&configType=' + configType;
        var title = i18n.getKey('manager') + i18n.getKey('materialMappings');
        var tab = Ext.getCmp('managermaterialmappingV3');
        if (tab == null) {
            var tab = me.add({
                id: 'managermaterialmappingV3',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
        }
        me.setActiveTab(tab);
    }
    ,
    /**
     * 管理简易bom配置
     * @param productConfigDesignId
     * @param productBomConfigId
     */
    managerSimplifyBomConfig: function (productConfigDesignId, productBomConfigId) {
        var me = this;
        var url = path + "partials/product/productconfig/productdesignconfig/simplifybommanage/main.html?productConfigDesignId=" + productConfigDesignId + '&productBomConfigId=' + productBomConfigId;
        var title = i18n.getKey('manager') + i18n.getKey('simplifyBom') + i18n.getKey('material') + i18n.getKey('view') + i18n.getKey('type');
        Ext.Ajax.request({
            url: adminPath + 'api/SBNodeController/' + productConfigDesignId + '/SBNOdeTree/root/children',
            method: 'GET',
            headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
            success: function (rep) {
                var response = Ext.JSON.decode(rep.responseText);
                if (response.success) {
                    var data = response.data;
                    if (Ext.isEmpty(data)) {
                        me.manageSimplifyBomNode(productConfigDesignId, productBomConfigId);
                    } else {
                        var sbomNodeId = data[0]._id;
                        url += '&sbomNodeId=' + sbomNodeId;
                        var tab = Ext.getCmp('managerSimplifyConfig');
                        if (tab == null) {
                            var tab = me.add({
                                id: 'managerSimplifyConfig',
                                title: title,
                                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                                closable: true
                            });
                        } else {
                            tab.setTitle(title);
                            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

                        }
                        me.setActiveTab(tab);
                    }
                } else {
                    Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                }
            },
            failure: function (resp) {
                var response = Ext.JSON.decode(resp.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        });

    }
    ,
    /**
     * 编辑简易bom配置
     * @param productConfigDesignId
     * @param productBomConfigId
     */
    editSimplifyBomConfig: function (productConfigDesignId, productBomConfigId, recordId, sbomNodeId) {
        var me = this;
        var title = (recordId ? i18n.getKey('edit') : i18n.getKey('create')) + i18n.getKey('simplifyBom') + i18n.getKey('material') + i18n.getKey('view') + i18n.getKey('type');
        var url = path + "partials/product/productconfig/productdesignconfig/simplifybommanage/edit.html" +
            "?productConfigDesignId=" + productConfigDesignId +
            '&productBomConfigId=' + productBomConfigId +
            '&sbomNodeId=' + sbomNodeId;
        if (recordId) {
            url += '&recordId=' + recordId;
        }
        var tab = Ext.getCmp('editSimplifyConfig');
        if (tab == null) {
            var tab = me.add({
                id: 'editSimplifyConfig',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);

    }
    ,
    /**
     * 管理productMaterialViewTypeTemplateConfig
     */
    managerProductMaterialViewTypeTemplateConfig: function (mvtId, mvtType, productConfigDesignId) {
        var me = this;
        var url = path + "partials/product/productconfig/productdesignconfig/productmaterialviewtype/managematerialviewtypetemplateconfig/main.html?mvtId=" + mvtId + '&mvtType=' + mvtType + '&productConfigDesignId=' + productConfigDesignId;
        var title = i18n.getKey('manager') + i18n.getKey('template') + i18n.getKey('config');
        var tab = Ext.getCmp('manageTemplateConfig');
        if (tab == null) {
            var tab = me.add({
                id: 'manageTemplateConfig',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
        }
        me.setActiveTab(tab);

    }
    ,

//imageImageIntegrationConfig管理
    managerImageImageIntegrationConfigs: function (productConfigDesignId, productBomConfigId, url, name) {
        var me = this;
        var title = i18n.getKey('manager') + i18n.getKey(name);
        var tab = Ext.getCmp('manage' + name);
        if (tab == null) {
            var tab = me.add({
                id: 'manage' + name,
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    }
    ,

    getQueryString: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    ,
//添加productBom打印配置
    productBomPrintConfig: function (productId, productConfigBomId, materialId) {
        var me = this;
        var tab = me.getComponent('productComponentConfig');
        if (tab != null) {
            me.remove(tab);
        }
        tab = Ext.create('CGP.product.view.productconfig.productbomconfig.view.producecomponentconfig.ProduceComponentConfigPanel', {
            title: i18n.getKey('productComponentConfig'),
            materialId: materialId,
            productId: productId,
            productConfigBomId: productConfigBomId,
            productType: me.productType
        });
        me.add(tab);
        me.setActiveTab(tab);
    }
    ,
    /**
     *打开关联简易的bom节点管理界面
     * @param productDesignConfigId
     * @param productBomConfigId
     */
    manageSimplifyBomNode: function (productDesignConfigId, productBomConfigId) {
        var me = this;
        var result = true;
        /**
         * 判断是否已经存在简易结构
         */
        var isHadSimplifyBom = function (productDesignConfigId) {
            var result = true;
            Ext.Ajax.request({
                url: encodeURI(adminPath + 'api/SBNodeController?page=1&limit=1&filter=' + JSON.stringify([{
                    name: "productConfigDesignId",
                    value: productDesignConfigId,
                    type: "number"
                }])),
                async: false,
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        if (responseMessage.data.content.length == 0) {
                            result = false;
                        } else {
                            isHadSimplifyBomConfig(responseMessage.data.content[0])
                        }
                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            });
            return result;
        };
        var filterData = Ext.JSON.encode([{
            "name": "productConfigDesignId",
            "type": "number",
            "value": productDesignConfigId
        }]);
        /**
         * 检查是否存在simplifybomconfig
         */
        var isHadSimplifyBomConfig = function (sbomNode) {
            Ext.Ajax.request({
                url: encodeURI(adminPath + 'api/simplifyBomController?page=1&start=0&limit=1000&filter=' + filterData),
                method: 'GET',
                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                async: false,
                success: function (rep) {
                    var response = Ext.JSON.decode(rep.responseText);
                    if (response.success) {
                        var data = response.data;
                        if (Ext.isEmpty(data.content)) {
                            Ext.Ajax.request({
                                url: adminPath + 'api/simplifyBomController',
                                method: 'POST',
                                jsonData: {
                                    clazz: 'com.qpp.cgp.domain.simplifyBom.SimplifyBomConfig',
                                    productConfigDesignId: productDesignConfigId,
                                    sbom: sbomNode,
                                    simplifyMaterialViewTypes: []
                                },
                                headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                                success: function (rep) {
                                    var response = Ext.JSON.decode(rep.responseText);
                                    if (response.success) {
                                        me.simplifyBomConfigId = response.data._id;
                                        openNewTab(productDesignConfigId, productBomConfigId, me.materialId, me.simplifyBomConfigId);
                                    } else {
                                        Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                                    }
                                },
                                failure: function (resp) {
                                    var response = Ext.JSON.decode(resp.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                                }
                            });
                        } else {
                            me.simplifyBomConfigId = data.content[0]._id;
                            openNewTab(productDesignConfigId, productBomConfigId, me.materialId, me.simplifyBomConfigId);
                        }
                    } else {
                        Ext.Msg.alert('提示', '请求失败！' + response.data.message);
                    }
                },
                failure: function (resp) {
                    var response = Ext.JSON.decode(resp.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                }
            });
        };
        /**
         * @param productBomConfigId
         * @param materialId
         */
        var openNewTab = function (productDesignConfigId, productBomConfigId, materialId, simplifyBomConfigId) {
            var url = path + "partials/product/productconfig/productdesignconfig/simplifybomnodemanage/main.html?productConfigDesignId="
                + productDesignConfigId + '&productBomConfigId=' + productBomConfigId + '&materialId=' + materialId + '&simplifyBomConfigId=' + simplifyBomConfigId;
            var title = i18n.getKey('manager') + i18n.getKey('simplifyBomNode');
            var tab = Ext.getCmp('managerSimplifyBomNode');
            if (tab == null) {
                var tab = me.add({
                    id: 'managerSimplifyBomNode',
                    title: title,
                    html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                    closable: true
                });
            } else {
                tab.setTitle(title);
                tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
            }
            me.setActiveTab(tab);
        };
        result = isHadSimplifyBom(productDesignConfigId);
        //获取到对应的materialId
        CGP.product.view.productconfig.productbomconfig.model.ProductBomConfigModel.load(productBomConfigId, {
                scope: this,
                failure: function (record, operation) {
                    //do something if the load failed
                },
                success: function (record, operation) {
                    //do something if the load succeeded
                    me.materialId = record.get('productMaterialId');
                    if (result == true) {
                        openNewTab(productDesignConfigId, productBomConfigId, me.materialId, me.simplifyBomConfigId);
                    } else {
                        Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('是否新建简易Bom的根节点?'), function (selector) {
                            if (selector == 'yes') {
                                //新建简易bom的根节点节点
                                Ext.Ajax.request({
                                    url: adminPath + 'api/SBNodeController',
                                    method: 'POST',
                                    jsonData: {
                                        "clazz": "com.qpp.cgp.domain.simplifyBom.SBNode",
                                        "description": '简易Bom的根节点',
                                        "left": true,
                                        "sbomPath": me.materialId,
                                        "productConfigDesignId": productDesignConfigId
                                    },
                                    headers: {
                                        Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                    },
                                    success: function (response) {
                                        var responseMessage = Ext.JSON.decode(response.responseText);
                                        if (responseMessage.success) {
                                            isHadSimplifyBomConfig(responseMessage.data);
                                            //openNewTab(productDesignConfigId, productBomConfigId, me.materialId, me.simplifyBomConfigId);
                                        } else {
                                            Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                        }
                                    },
                                    failure: function (response) {
                                        var responseMessage = Ext.JSON.decode(response.responseText);
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    }
                                });
                            }
                        })
                    }
                },
                callback: function (record, operation) {
                    //do something whether the load succeeded or failed
                }
            }
        );
    }
    ,
    manageSourceConfig: function (designId, productBomConfigId, productId, recordId) {
        var me = this;
        var url = path + 'partials/product/productconfig/productdesignconfig/sourceconfig/main.html?designId=' + designId + '&productBomConfigId=' + productBomConfigId + '&productId=' + productId + '&_id=' + (recordId || '');
        var title = i18n.getKey('manager') + i18n.getKey('sourceConfig');
        var tab = Ext.getCmp('manageSourceConfig');
        if (tab == null) {
            var tab = me.add({
                id: 'manageSourceConfig',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
        }
        me.setActiveTab(tab);
    }
    ,
    /**
     * 管理mvt预处理配置
     * @param designId
     * @param productId
     */
    manageMaterialViewTypePreProcessConfig: function (designId, productId, productBomConfigId) {
        var me = this;
        var url = path + 'partials/product/productconfig/productdesignconfig/preprocessconfig/main.html?designId=' + designId + '&productId=' + productId + '&productBomConfigId=' + productBomConfigId;
        var title = i18n.getKey('manager') + i18n.getKey('preProcessConfig');
        var tab = Ext.getCmp('preProcessConfig');
        if (tab == null) {
            var tab = me.add({
                id: 'preProcessConfig',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
        }
        me.setActiveTab(tab);
    }
    ,
    /**
     * 编辑mvt预处理配置
     * @param designId
     * @param productId
     */
    editMaterialViewTypePreProcessConfig: function (designId, recordId, createOrEdit, clazz) {
        var me = this;
        var url = path + 'partials/product/productconfig/productdesignconfig/preprocessconfig/edit.html?' +
            'designId=' + designId +
            '&recordId=' + (recordId ? recordId : '') +
            '&clazz=' + clazz;
        var title = i18n.getKey(createOrEdit) + i18n.getKey('preProcessConfig');
        var tab = Ext.getCmp('editPreProcessConfig');
        if (tab == null) {
            var tab = me.add({
                id: 'editPreProcessConfig',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
        }
        me.setActiveTab(tab);
    }
    ,
    /**
     *跳转到管理产品属性映射测试历史界面
     * @param productConfigDesignId
     * @param productBomConfigId
     * @param productId
     * @param productBomConfig
     */
    managerMaterialMappingConfigV3TestHistory: function (productConfigDesignId, productId, MMTId, includeIds, configType) {
        var me = this;
        if (includeIds) {

        } else {
            includeIds = '';
        }
        var url = path + "partials/product/productconfig/productdesignconfig/materialmappingV3test/main.html" +
            "?productConfigDesignId=" + productConfigDesignId +
            '&productId=' + productId +
            '&MMTId=' + MMTId +
            '&includeIds=' + includeIds + '&configType=' + configType;
        var title = i18n.getKey('manager') + i18n.getKey('materialMapping') + i18n.getKey('test') + i18n.getKey('history');
        var tab = Ext.getCmp('materialmappingV3test');
        if (tab == null) {
            var tab = me.add({
                id: 'materialmappingV3test',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    }
    ,
    /**
     *跳转到校验生成的SMU是否符合预期的tab
     * @param productConfigDesignId
     * @param productBomConfigId
     * @param productId
     * @param productBomConfig
     */
    validMaterial: function (productConfigDesignId, productId, MMTId, recordId, isReadOnly, configType) {
        var me = this;
        var url = path + "partials/product/productconfig/productdesignconfig/materialmappingV3test/validmaterial.html" +
            "?productConfigDesignId=" + productConfigDesignId +
            '&productId=' + productId +
            '&MMTId=' + MMTId +
            '&recordId=' + recordId +
            '&isReadOnly=' + isReadOnly + '&configType=' + configType;
        var title = i18n.getKey('校验期望');
        if (isReadOnly) {
            title = i18n.getKey('查看物料');
        }
        var tab = Ext.getCmp('validMaterial');
        if (tab == null) {
            var tab = me.add({
                id: 'validMaterial',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
        }
        me.setActiveTab(tab);
    }
    ,
    checkTestRecordDetail: function (productId, recordId) {
        var me = this;
        var url = path + "partials/product/productconfig/productdesignconfig/materialmappingV3test/edit.html" +
            '?productId=' + productId +
            '&recordId=' + recordId;
        var title = i18n.getKey('测试信息');
        var tab = Ext.getCmp('testInfo');
        if (tab == null) {
            var tab = me.add({
                id: 'testInfo',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
        }
        me.setActiveTab(tab);
    }
    ,
    /**
     * 产品生成对应排版的配置
     */
    compositionConfig: function (impositionId, bomConfigId, productId, preview, rtTypeId) {
        var me = this;
        var url = path + "partials/product/productconfig/productimpositionconfig/composition/main.html?" +
            "impositionId=" + impositionId + '&bomConfigId=' + bomConfigId + '&productId=' + productId + '&rtTypeId=' + rtTypeId + '&preview=' + preview || false;
        var title = i18n.getKey('排版配置'), compId = 'compositionConfig';
        if (preview) {
            title = i18n.getKey('缩略图配置');
            compId = 'compositionPreviewConfig'
        }
        var tab = Ext.getCmp(compId);
        if (tab == null) {
            var tab = me.add({
                id: compId,
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
        }
        me.setActiveTab(tab);
    }
    ,
    /**
     * 管理builderView配置的界面，productConfig-productViewConfig-视图配置-界面化配置
     * @param id
     * @param productViewConfigId
     */
    managerBuilderViewConfig: function (navigationId, productViewConfigId) {
        var me = this;
        var url = path + 'partials/product/productconfig/productviewconfig/builderviewconfig/main.html?navigationId=' + navigationId + '&productViewConfigId=' + productViewConfigId;
        var title = i18n.getKey('builderViewConfig');
        var tab = Ext.getCmp('builderViewConfig');
        if (tab == null) {
            tab = me.add({
                id: 'builderViewConfig',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    }
    ,
    /**
     * 编辑简易类型预处理
     * @param designId
     * @param recordId
     * @param type
     */
    editSimplifyPreProcess: function (designId, recordId, type) {
        var me = this, createOrEdit = recordId ? 'edit' : 'add';
        var url = path + 'partials/product/productconfig/productdesignconfig/preprocessconfig/simplifytype/edit.html?' +
            'designId=' + designId +
            '&id=' + (recordId ? recordId : '') +
            '&type=' + type;
        var title = i18n.getKey(createOrEdit) + i18n.getKey('simplifytype') + (recordId ? '(' + recordId + ')' : '');
        var tab = Ext.getCmp('editPreProcessConfig');
        if (tab == null) {
            var tab = me.add({
                id: 'editPreProcessConfig',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');
        }
        me.setActiveTab(tab);
    }
    ,
    /**
     * 管理builderView配置的界面，productConfig-productViewConfig-视图配置-界面化配置
     * @param id
     * @param productViewConfigId
     */
    managerBuilderViewV3Config: function (navigationId, productViewConfigId) {
        var me = this;
        var url = path + 'partials/product/productconfig/productviewconfig/builderviewconfigv3/main.html?navigationId=' + navigationId + '&productViewConfigId=' + productViewConfigId;
        var title = i18n.getKey('builderViewConfig');
        var tab = Ext.getCmp('builderViewConfigV3');
        if (tab == null) {
            tab = me.add({
                id: 'builderViewConfigV3',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    }
    ,
    managerNavigationTreeV3: function (productViewConfigId, navigationId, haveRootNode) {
        var me = this;
        var url = path + 'partials/product/productconfig/productviewconfig/navigationtreev3/main.html?' +
            'navigationId=' + navigationId +
            '&productViewConfigId=' + productViewConfigId +
            '&haveRootNode=' + haveRootNode +
            '&productId=' + me.productId;

        var title = i18n.getKey('manager') + i18n.getKey('navigation') + i18n.getKey('config') + '(' + i18n.getKey('productViewCfg') + ':' + productViewConfigId + ')';
        var tab = Ext.getCmp('navigationTreeV3');
        if (tab == null) {
            var tab = me.add({
                id: 'navigationTreeV3',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    }
    ,
    /**
     * 管理design这一层级的PC资源
     */
    manageDesignPCResourceLibrary: function (designId) {
        var me = this;
        var url = path + 'partials/product/productconfig/productdesignconfig/pcresource/main.html?designId=' + designId;
        var title = i18n.getKey('pcResourceLibrary');
        var tab = Ext.getCmp('designPCResourceLibrary');
        if (tab == null) {
            var tab = me.add({
                id: 'designPCResourceLibrary',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    }
    ,
    /**
     * 管理MVT这一层级的PC资源
     */
    manageMVTPCResourceLibrary: function (MVTId, clazz) {
        var me = this;
        var url = path + 'partials/product/productconfig/productdesignconfig/productmaterialviewtype/pcresource/main.html?MVTId=' + MVTId + '&clazz=' + clazz;
        var title = i18n.getKey('pcResourceLibrary');
        var tab = Ext.getCmp('MVTPCResourceLibrary');
        if (tab == null) {
            var tab = me.add({
                id: 'MVTPCResourceLibrary',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    }
    ,
    /**
     *
     */
    addNewTab: function (cfg) {
        var me = this;
        var url = cfg.url
        var title = cfg.title;
        var tab = Ext.getCmp(cfg.id);
        if (tab == null) {
            var tab = me.add({
                id: cfg.id,
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true
            });
        } else {
            tab.setTitle(title);
            tab.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        me.setActiveTab(tab);
    }
    ,

    /**
     * 基本设置
     * @param impositionId
     */
    setBaseConifg: function (impositionId) {
        var me = this;
        var url = cgp2ComposingPath + 'api/smuContentGenerateConfigs?page=1&limit=10&filter=[{"name":"productConfigImpositionId","type":"number","value":' + impositionId + '}]',
            method = 'GET';
        var sucCallback = function (response) {
            var response = Ext.JSON.decode(response.responseText)
            if (response.success) {
                var respData = response.data?.content[0] || null;
                var wind = Ext.create('Ext.ux.window.SuperWindow', {
                    width: 400,
                    height: 200,
                    bodyPadding: 0,
                    title: i18n.getKey('base') + i18n.getKey('config'),
                    isView: true,
                    data: respData,
                    confirmHandler: function (btn) {
                        var method = 'POST';
                        var radioValue = wind.down('form').down('radiogroup').getValue();
                        method = radioValue.method;
                        var data = wind.data || {
                            "clazz": "com.qpp.cgp.composing.config.SmuContentGenerateConfig",
                            "productConfigImpositionId": impositionId,
                        };
                        me.submitContent(data, method, wind);
                    },
                    items: [
                        {
                            xtype: 'form',
                            itemId: 'wform',
                            border: 0,
                            padding: 10,
                            layout: 'column',
                            items: [
                                {
                                    xtype: 'displayfield',
                                    itemId: 'smuContent',
                                    fieldLabel: i18n.getKey('smuContent'),
                                    columnWidth: 0.7,
                                    value: '未生成' + i18n.getKey('smuContent')
                                },
                                {
                                    xtype: 'button',
                                    itemId: 'smuContentOperate',
                                    text: i18n.getKey('generate'),
                                    columnWidth: 0.3,
                                    handler: function (btn) {
                                        var method = wind.data ? 'DELETE' : 'POST';
                                        var data = wind.data || {
                                            "clazz": "com.qpp.cgp.composing.config.SmuContentGenerateConfig",
                                            "productConfigImpositionId": impositionId,
                                        };
                                        if (method == 'DELETE') {
                                            Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey('deleteConfirm'), function (opt) {
                                                if (opt == 'yes') {
                                                    me.submitContent(data, method, wind);
                                                }
                                            });
                                        } else {
                                            me.submitContent(data, method, wind);
                                        }
                                    }
                                }
                            ],
                            listeners: {
                                afterrender: function (comp) {
                                    me.setText(comp, wind.data);
                                }
                            }
                        }
                    ]
                });
                wind.show();
            } else {
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        };

        var optins = {
            url: encodeURI(url),
            method: method,
            async: true,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: sucCallback || function (response) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {

                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), resp.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            },
            callback: function (require, success, response) {

            }
        };
        Ext.Ajax.request(optins);
    }
    ,

    /**
     * Radio 赋值
     * @param comp
     * @param data
     */
    setValueRadio: function (comp, data) {
        var radios = comp.query('radio');
        radios.forEach(function (item) {
            if (item.inputValue == data.method) {
                item.enable();
            } else {
                item.disable();
            }
        });
        comp.setValue(data);
    }
    ,
    setText: function (form, respData) {
        if (respData) {
            form.down('displayfield').setValue('已生成' + i18n.getKey('smuContent'));
            form.down('button').setText(i18n.getKey('delete'));
        } else {
            form.down('displayfield').setValue('未生成' + i18n.getKey('smuContent'));
            form.down('button').setText(i18n.getKey('generate'));
        }
    }
    ,
    /**
     * 提交数据
     * @param data
     * @param method
     * @param wind
     */
    submitContent: function (data, method, wind) {
        var me = this;
        var url = cgp2ComposingPath + 'api/smuContentGenerateConfigs';
        var msg = i18n.getKey('generate') + i18n.getKey('success');
        if (method == 'DELETE') {
            msg = i18n.getKey('delete') + i18n.getKey('success');
            url = cgp2ComposingPath + 'api/smuContentGenerateConfigs/' + data._id;
        }
        var callback = function (require, success, response) {
            var response = Ext.JSON.decode(response.responseText)
            if (response.success) {
                wind.data = method == 'DELETE' ? null : response.data;
                me.setText(wind.down('form'), wind.data)
                // wind.close();
            } else {
                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
            }
        };
        JSAjaxRequest(url, method, true, data, msg, callback);
    }
})
