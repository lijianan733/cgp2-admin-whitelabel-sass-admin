/**
 * Created by nan on 2020/7/1.
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.view.GenerateJobConfigGrid',
    'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.view.EditGenerateJobConfigForm',
    'Ext.ux.filter.Panel',
    'CGP.product.view.productconfig.productimpositionconfig.model.ProductImpositionCfgModel',
    'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.configgroup.component.ConfigGroupItem',
    'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.configgroup.ConfigGroup',
    'CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.store.GenerateJobConfigStore'
])
Ext.onReady(function () {
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var tab = Ext.create('Ext.tab.Panel', {
        activeTab: 0
    });
    var impositionId = JSGetQueryString('impositionId');
    var bomConfigId = JSGetQueryString('bomConfigId');
    var productId = JSGetQueryString('productId');
    var preview = JSGetQueryString('preview');
    page.add(tab);
    var generateJobConfigStore = Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.store.GenerateJobConfigStore', {});
    var jobTypeStore = Ext.create('Ext.data.Store', {
        fields: [
            'display', 'value'
        ],
        filters: [Ext.create('Ext.util.Filter', {
            filterFn: function (item) {
                return preview == 'true' ? item.get("value") == 'PREVIEW' : item.get("value") != 'PREVIEW';
            }, root: 'data'
        })],
        data: [
            {
                value: 'CMYK',
                display: 'CMYK'
            }, {
                value: 'DIECUT',
                display: 'DIECUT'
            }, {
                value: 'SCODIX',
                display: 'SCODIX'
            }, {
                value: 'FOIL',
                display: 'FOIL'
            }, {
                value: 'LASTER',
                display: 'LASTER'
            }, {
                value: 'LED',
                display: 'LED'
            }, {
                value: 'PREVIEW',
                display: 'PREVIEW'
            }, {
                value: 'VIEW',
                display: 'VIEW'
            }
        ]
    });
    var userParams = Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.view.UserParams', {
        title: i18n.getKey('userParams'),
        impositionId: impositionId
    });
    var filter = Ext.create('Ext.ux.filter.Panel', {
        minHeight: 80,
        searchActionHandler: function () {
            if (filter.isValid()) {
                generateJobGrid.generateJobConfigStore.loadPage(1);
            }
        },
        border: false,
        header: false,
        region: 'north',
        items: [
            {
                id: 'idSearchField',
                name: '_id',
                xtype: 'numberfield',
                hideTrigger: true,
                autoStripChars: true,
                allowExponential: false,
                allowDecimals: false,
                fieldLabel: i18n.getKey('id'),
                itemId: 'id'
            },
            {
                id: 'nameSearchField',
                name: 'name',
                xtype: 'textfield',
                fieldLabel: i18n.getKey('name'),
                itemId: 'name'
            },

            {
                name: 'jobType',
                xtype: 'combo',
                isLike: false,
                fieldLabel: i18n.getKey('job类型'),
                itemId: 'jobType',
                editable: false,
                displayField: 'display',
                valueField: 'value',
                store: jobTypeStore
            }, {
                name: 'productConfigImpositionId',
                xtype: 'numberfield',
                hidden: true,
                itemId: 'productConfigImpositionId',
                value: impositionId
            },
            {
                name: 'preview',
                xtype: 'combobox',
                editable: false,
                fieldLabel: i18n.getKey('preview'),
                hidden: true,
                itemId: 'preview',
                store: new Ext.data.Store({
                    fields: ['name', {
                        name: 'value',
                        type: 'boolean'
                    }],
                    data: [
                        {
                            value: true,
                            name: '是'
                        },
                        {
                            value: false,
                            name: '否'
                        }
                    ]
                }),
                displayField: 'name',
                value: JSON.parse(preview),
                valueField: 'value'
            }/*,
            {
                name: 'preview',
                xtype: 'textfield',
                hidden: true,
                itemId: 'preview',
                value: preview
            }*/
        ]
    });
    var generateJobGrid = Ext.widget('generatejobconfiggrid', {
        impositionId: impositionId,
        region: 'center',
        header: false,
        filter: filter,
        generateJobConfigStore: generateJobConfigStore,
        bomConfigId: bomConfigId,
        productId: productId,
        preview: preview
    });
    var panel = Ext.create('Ext.panel.Panel', {
        title: i18n.getKey('Job生成配置'),
        layout: 'border',
        items: [filter, generateJobGrid]
    });
    var productController = Ext.create('CGP.product.view.productconfig.controller.Controller');
    var contentData = productController.buildPMVTContentData(productId);
    var configGroup = Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.configgroup.ConfigGroup', {
        filter: filter,
        preview: preview,
        productId: productId,
        contentData: contentData,
        impositionId: impositionId,
        generateJobConfigStore: generateJobConfigStore,
        createConfigGroupTitle: i18n.getKey('create') + i18n.getKey('group'),
    });
    var textParameteUrl = path + 'partials/product/productconfig/productimpositionconfig/composition/textparameter.html?productId=' + productId + '&impositionId=' + impositionId;
    tab.add([
        panel,
        userParams,
        {
            id: 'textParameteList',
            title: i18n.getKey('排版文字参数'),
            origin: window.location.href,
            html: '<iframe id="tabs_iframe_textParamete" src="' + textParameteUrl + '" width="100%" height="100%" frameBorder="0" onload="showOpenNewIframeError()" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
            // closable: true
        },
        configGroup
    ]);
})
