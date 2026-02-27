Ext.Loader.syncRequire([
    'Ext.ux.form.GridField',
    'CGP.product.view.pricingStrategyv2.model.ProductPricingConfig',
    'CGP.product.view.pricingStrategyv2.config.Config'
]);
Ext.define("CGP.product.view.pricingStrategyv2.main", {
    extend: "Ext.tab.Panel",
    itemId: 'productPriceRule',
    region: 'center',
    header: false,
    productId: '',
    partnerId: '',
    configType: 'sellPrice',//
    url: '',
    clazz: '',
    productPricingConfig: null,//加载完后的数据

    /**
     * 保存数据后的操作
     *
     */
    afterSave: function (resp, tab, method) {
        var me = this;
        var controller = Ext.create('CGP.product.view.pricingStrategyv2.controller.PricingStrategy');
        var productPricingConfigStore = Ext.data.StoreManager.lookup('productPricingConfigStore');//grid中定义使用的store
        if (tab) {
            var strategiesViewGrid = tab.getComponent('productStrategyGrid');
            var addData = resp.data;
            addData['strategyType'] = addData.setting.clazz;
            var viewData = null;
            var store = strategiesViewGrid.gridConfig.store;
            if (method == 'POST') {//新建
                viewData = Ext.create("CGP.product.view.pricingStrategyv2.model.LocalPricingStrategy", addData);
                var maxIndex = store.max('index');
                viewData.set('index', maxIndex ? (maxIndex + 1) : 1);
                strategiesViewGrid.gridConfig.store.add(viewData);
            } else {
                viewData = store.findRecord('_id', addData["_id"]);
                if (viewData) {
                    viewData.set('currency', addData.currency);
                    viewData.set('description', addData.description);
                }
            }
            tab.productPricingConfig.data.strategies = strategiesViewGrid.getSubmitValue();
            //保存包装后的价格策略
            controller.saveConfig(tab.productPricingConfig.data, strategiesViewGrid, false, me.url);
            productPricingConfigStore.load();
        }
    },
    initComponent: function () {
        var me = this;
        var productId = parseInt(JSGetQueryString('productId'));
        me.configType = CGP.product.view.pricingStrategyv2.config.Config[me.clazz].configType;
        me.url = CGP.product.view.pricingStrategyv2.config.Config[me.clazz].url;
        var controller = Ext.create('CGP.product.view.pricingStrategyv2.controller.PricingStrategy');
        var contextData = controller.buildContextData(parseInt(JSGetQueryString('productId')));
        contextData.push({
            key: 'qty',
            type: 'skuAttribute',
            valueType: 'Number',
            selectType: 'NON',
            attrOptions: [],
            required: true,
            displayName: 'Qty',
            path: 'args',
            attributeInfo: {}
        });
        var contextAttributeStore = Ext.create('Ext.data.Store', {
            storeId: 'contextAttributeStore',
            fields: [
                {
                    name: 'key',
                    type: 'string'
                },
                {
                    name: 'type',
                    type: 'string'
                }, {
                    name: 'valueType',
                    type: 'string'
                }, {
                    name: 'selectType',
                    type: 'string'
                }, {
                    name: 'attrOptions',
                    type: 'array'
                }, {
                    name: 'required',
                    type: 'string'
                }, {
                    name: 'attributeInfo',
                    type: 'object'
                }, {
                    name: 'path',
                    type: 'string'
                },
                {
                    name: 'displayName',
                    type: 'string'
                },
                {
                    name: 'displayNameType',
                    type: 'string',
                    convert: function (value, record) {
                        var displayName = record.get('displayName');
                        var valueType = record.get('valueType');
                        return displayName + '<' + valueType + '>';
                    }
                }
            ],
            data: contextData
        });
        var filter = [];
        if (me.partnerId) {
            filter.push({
                name: 'productId',
                type: 'string',
                value: productId
            });
            filter.push({
                name: 'partnerId',
                type: 'string',
                value: me.partnerId
            })
        } else {
            filter.push({
                name: 'productId',
                type: me.configType == 'sellPrice' ? 'number' : 'string',
                value: productId
            });
        }
        var productPricingConfigStore = Ext.create('CGP.product.view.pricingStrategyv2.store.ProductPricingConfig', {
            storeId: 'productPricingConfigStore',
            autoLoad: false,
            url: me.url,
            params: {
                filter: Ext.JSON.encode(filter)
            }
        });

        me.productPricingConfig = Ext.create('CGP.product.view.pricingStrategyv2.model.ProductPricingConfig', {
            _id: 0,
            productId: productId,
            clazz: me.clazz
        });
        var isLock = JSCheckProductIsLock(productId);
        var strategyGrid = Ext.create('CGP.product.view.pricingStrategyv2.view.ProductPricingStrategy', {
            title: i18n.getKey('strategy') + i18n.getKey('manager'),
            header: false,
            tabPanel: me,
            pricingConfigUrl: me.url,
            isLock: isLock,
            productId: productId,
            listeners: {
                afterrender: function (strategyGrid) {
                    var outTab = strategyGrid.ownerCt;
                    var productPricingConfigStore = Ext.data.StoreManager.lookup('productPricingConfigStore');//grid中定义使用的store
                    productPricingConfigStore.on('load', function (store, records, success, eOpts) {
                        if (records.length > 0) {
                            outTab.productPricingConfig = records[0];
                            var strategies = outTab.productPricingConfig.data['strategies'];
                            if (strategies) {
                                strategyGrid.refreshData(strategies);
                            }
                        }
                    });
                    productPricingConfigStore.load();
                }
            }
        });
        me.items = [
            strategyGrid
        ];
        me.callParent(arguments);
    }
});
