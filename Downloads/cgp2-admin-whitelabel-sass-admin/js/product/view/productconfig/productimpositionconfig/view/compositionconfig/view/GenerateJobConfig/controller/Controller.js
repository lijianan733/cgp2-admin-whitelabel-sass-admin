/**
 * Created by nan on 2020/7/1.
 */
Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.controller.Controller', {
    /**
     * 选择指定的job，以便于新建配置
     * @param tab
     * @param grid
     */
    selectGenerateJobConfigType: function (tab, grid, impositionId) {
        console.log(grid)
        var controller = this;
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        var productId = builderConfigTab.productId;
        var contentData = controller.buildContentData(productId);
        var contextTemplate = controller.buildContentTemplate(contentData);
        var functionTemplate = CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.config.Config.functionTemplate;
        functionTemplate = functionTemplate.toString();
        var excludeIds = [];
        for (var i = 0; i < grid.store.getCount(); i++) {
            var recordData = grid.store.getAt(i).raw;
            if (recordData.compositeJobConfigId) {
                excludeIds.push(recordData.compositeJobConfigId);
                for (var j = 0; j < recordData.singleJobConfigs.length; j++) {
                    var singleJobConfigs = recordData.singleJobConfigs[j];
                    excludeIds.push(singleJobConfigs.singleJobConfigId);
                }
            } else {
                excludeIds.push(recordData.singleJobConfigId);
            }
        }
        var jobConfigStore = Ext.create('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.store.JobConfigStore', {});
        var win = Ext.create('Ext.window.Window', {
            modal: true,
            constrain: true,
            title: i18n.getKey('select') + i18n.getKey('Job配置'),
            items: [
                {
                    xtype: 'gridcombo',
                    padding: 20,
                    width: 350,
                    fieldLabel: i18n.getKey('Job配置'),
                    name: 'jobConfig',
                    itemId: 'jobConfig',
                    multiSelect: false,
                    displayField: 'name',
                    store: jobConfigStore,
                    editable: false,
                    allowBlank: false,
                    matchFieldWidth: false,
                    gridCfg: {
                        store: jobConfigStore,
                        height: 280,
                        width: 650,
                        viewConfig: {
                            enableTextSelection: true
                        },
                        columns: [
                            {
                                text: i18n.getKey('id'),
                                width: 90,
                                dataIndex: '_id',
                                itemId: 'id'
                            },
                            {
                                text: i18n.getKey('name'),
                                dataIndex: 'name',
                                width: 100,
                                itemId: 'name'
                            },
                            {
                                text: i18n.getKey('description'),
                                dataIndex: 'description',
                                width: 165,
                                itemId: 'description'
                            },
                            {
                                text: i18n.getKey('jobType'),
                                dataIndex: 'jobType',
                                itemId: 'jobType',
                                renderer: function (value, mate, record) {
                                    return value;
                                }
                            },
                            {
                                text: i18n.getKey('type'),
                                dataIndex: 'clazz',
                                flex: 1,
                                itemId: 'clazz',
                                renderer: function (value, medate, record) {
                                    if (value == 'com.qpp.job.domain.config.SingleJobConfig') {
                                        return '普通job配置'
                                    } else {
                                        return '混合job配置'

                                    }
                                }
                            }
                        ],
                        bbar: Ext.create('Ext.PagingToolbar', {
                            store: jobConfigStore,
                            displayInfo: true, // 是否 ? 示， 分 ? 信息
                            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
                            emptyMsg: i18n.getKey('noData')
                        })
                    },
                    filterCfg: {
                        height: 80,
                        layout: {
                            type: 'column',
                            columns: 2
                        },
                        fieldDefaults: {
                            labelAlign: 'right',
                            layout: 'anchor',
                            width: 180,
                            style: 'margin-right:20px; margin-top : 5px;',
                            labelWidth: 50
                        },
                        items: [
                            {
                                name: '_id',
                                xtype: 'numberfield',
                                hideTrigger: true,
                                fieldLabel: i18n.getKey('id'),
                                itemId: 'id'
                            },
                            {
                                name: 'name',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('name'),
                                itemId: 'name'
                            },
                            {
                                name: 'description',
                                xtype: 'textfield',
                                fieldLabel: i18n.getKey('description'),
                                itemId: 'description'
                            },
                            {
                                name: 'clazz',
                                xtype: 'combo',
                                fieldLabel: i18n.getKey('type'),
                                itemId: 'clazz ',
                                editable: false,
                                valueField: 'value',
                                displayField: 'display',
                                isLike: false,
                                store: Ext.create('Ext.data.Store', {
                                    fields: [
                                        {
                                            name: 'value',
                                            type: 'string'
                                        },
                                        {
                                            name: 'display',
                                            type: 'string'
                                        }
                                    ],
                                    data: [
                                        {
                                            value: 'com.qpp.job.domain.config.SingleJobConfig',
                                            display: '普通job配置'
                                        },
                                        {
                                            value: 'com.qpp.job.domain.config.CompositeJobConfig',
                                            display: '混合job配置'
                                        }
                                    ]
                                })
                            }, {
                                name: 'excludeProductConfigImpositionId',
                                xtype: 'numberfield',
                                hideTrigger: true,
                                hidden: true,
                                fieldLabel: i18n.getKey('excludeProductConfigImpositionId'),
                                itemId: 'excludeProductConfigImpositionId',
                                value: impositionId

                            }
                        ]
                    },
                    listeners: {
                        change: function (gridcombo, newValue, oldValue) {
                            var jobConfig = gridcombo.getArrayValue();
                            var conditionDTO = gridcombo.ownerCt.getComponent('conditionDTO');
                            if (jobConfig && jobConfig.clazz == 'com.qpp.job.domain.config.CompositeJobConfig') {
                                conditionDTO.show();
                                conditionDTO.setDisabled(false);
                            } else {
                                conditionDTO.hide();
                                conditionDTO.setDisabled(true);
                            }
                        }
                    }
                },
                {
                    xtype: 'conditionfieldv3',
                    itemId: 'conditionDTO',
                    checkOnly: false,
                    padding: 20,
                    width: 350,
                    inputModel: 'MULTI',
                    name: 'conditionDTO',
                    hidden: true,
                    disabled: true,
                    fieldLabel: i18n.getKey('公有的执行条件'),
                    contextTemplate: contextTemplate,
                    contentData: contentData,
                    valueType: 'expression',
                    functionTemplate: functionTemplate,
                    tipInfo: '混合的Job生成配置共用同一个执行条件',
                    allowBlank: false,
                    conditionWindowConfig: {
                        conditionFieldContainerConfig: {
                            conditionPanelItems: {
                                qtyConditionGridPanel: {
                                    hidden: false,
                                }
                            }
                        }
                    }
                }
            ],
            bbar: [
                '->',
                {
                    xtype: 'button',
                    iconCls: 'icon_agree',
                    text: i18n.getKey('confirm'),
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        var jobGridCombo = win.getComponent('jobConfig');
                        var conditionDTOField = win.getComponent('conditionDTO');
                        if (jobGridCombo.isValid() && conditionDTOField.isValid()) {
                            var jobConfig = jobGridCombo.getArrayValue();
                            var conditionDTOValue = conditionDTOField.getValue();
                            var conditionValue = conditionDTOField.getExpression();
                            var manageJobConfigTab = tab.getComponent('manageJobConfigTab');
                            if (manageJobConfigTab) {
                                tab.remove(manageJobConfigTab);
                            }
                            var manageJobConfigTab = Ext.widget('managejobconfigtab', {
                                jobConfig: jobConfig,
                                conditionValue: conditionValue,
                                conditionDTOValue: conditionDTOValue,
                                productId: tab.productId,
                                bomConfigId: grid.bomConfigId
                            });
                            tab.add(manageJobConfigTab);
                            tab.setActiveTab(manageJobConfigTab);
                            win.close();
                        }
                    }
                },
                {
                    xtype: 'button',
                    iconCls: 'icon_cancel',
                    text: i18n.getKey('cancel'),
                    handler: function (btn) {
                        var win = btn.ownerCt.ownerCt;
                        win.close();
                    }
                }
            ]
        });
        win.show();
    },
    /**
     * 保存配置
     */
    saveGenerateJobConfig: function (tab, form) {
        var method = 'POST';
        var data = form.diyGetValue();
        data.preview = tab.preview;
        tab.el.mask();
        tab.updateLayout();
        var url = cgp2ComposingPath + 'api/jobGenerateConfigsV2';
        if (tab.createOrEdit == 'edit') {
            method = 'PUT';
            url = cgp2ComposingPath + 'api/jobGenerateConfigsV2/' + form.recordData._id;
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (response) {
                tab.el.unmask();
                var responseMessage = Ext.JSON.decode(response.responseText);
                form.recordData = responseMessage.data;
                form.createOrEdit = 'edit';
                tab.createOrEdit = 'edit';
                if (responseMessage.success) {
                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('saveSuccess'), function () {
                        if (tab.ownerCt && method == 'POST') {
                            tab.ownerCt.items.items[0].items.items[1].generateJobConfigStore.load();
                        }
                        tab.setTitle('修改Job生成配置');
                    });
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                tab.el.unmask();
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    },
    /**
     * 删除配置
     */
    deleteGenerateJobConfig: function (grid, ids) {
        grid.el.mask();
        grid.updateLayout();
        var count = 0;
        for (var i = 0; i < ids.length; i++) {
            Ext.Ajax.request({
                url: cgp2ComposingPath + 'api/jobGenerateConfigsV2/' + ids[i],
                method: 'DELETE',
                headers: {
                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                },
                success: function (response) {
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    if (responseMessage.success) {
                        count++;
                        if (count == ids.length) {
                            grid.el.unmask();
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('deleteSuccess'), function () {
                                grid.generateJobConfigStore.load();
                            });
                        }

                    } else {
                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                    }
                },
                failure: function (response) {
                    grid.el.unmask();
                    var responseMessage = Ext.JSON.decode(response.responseText);
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            })
        }
    },
    /**
     * 获取指定pageConfig的数据
     * @param data
     */
    getPageConfigs: function (data) {
        var result = null;
        var url = composingPath + 'api/pageConfigs?page=1&start=0&limit=25';
        url += '&filter=' + Ext.JSON.encode([{
            "name": "includeIds",
            "type": "number",
            "value": '[' + data.toString() + ']'
        }]);
        Ext.Ajax.request({
            url: encodeURI(url),
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    result = responseMessage.data.content;
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        })
        return result;
    },
    /**
     * 查看上下文
     * @param data
     */
    showContext: function (data) {
        var win = Ext.create('Ext.window.Window', {
            title: i18n.getKey('查看上下文'),
            modal: true,
            constrain: true,
            layout: 'fit',
            width: 700,
            maxHeight: 550,
            items: [{
                xtype: 'rttypeattributevalueexinputform',
                width: '100%',
                hideRtType: true,
                padding: 0,
                margin: 0,
                minHeight: 250,
                itemId: 'rtTypeAttributeInputForm',
                autoScroll: true,
                name: 'entrys',
                readOnly: true,
                fieldLabel: '上下文',
                rtTypeId: data.rtTypeId,
                viewConfig: {
                    stripeRows: true
                }
            }]
        });
        win.getComponent('rtTypeAttributeInputForm').setValue(data.rtType._id, data.entrys);
        win.show();
    },
    /**
     * 查看条件
     * @param data
     */
    checkExpression: function (data) {
        var expressionValueStore = Ext.create('Ext.data.Store', {
            autoSync: true,
            fields: [
                {name: 'clazz', type: 'string'},
                {name: 'expression', type: 'string'},
                {name: 'expressionEngine', type: 'string', defaultValue: 'JavaScript'},
                {name: 'inputs', type: 'object'},
                {name: 'resultType', type: 'string'},
                {name: 'promptTemplate', type: 'string'},
                {name: 'min', type: 'object', defaultValue: undefined},
                {name: 'max', type: 'object', defaultValue: undefined},
                {name: 'regexTemplate', type: 'string', defaultValue: undefined}
            ],
            data: []
        });
        if (data) {
            var expressionValueStoreRecord = new expressionValueStore.model(data);
            expressionValueStore.add(expressionValueStoreRecord);
        }
        var win = Ext.create('CGP.common.valueExV3.view.SetExpressionValueWindow', {
            expressionValueStore: expressionValueStore,
            readOnly: true,
            title: '查看条件'
        });
        win.show();
    },
    /**
     * 查看page生成配置
     */
    checkPageGenerateConfig: function (data) {
        var controller = this;
        var win = Ext.create('Ext.window.Window', {
            title: i18n.getKey('page生成配置'),
            modal: true,
            constrain: true,
            layout: 'fit',
            items: [
                {
                    xtype: 'grid',
                    width: 700,
                    height: 250,
                    store: Ext.create('Ext.data.Store', {
                        autoSync: true,
                        proxy: {
                            type: 'memory'
                        },
                        fields: [
                            {name: 'pageConfigId', type: 'string'},
                            {
                                name: 'designDataConfig', type: 'object'
                            },
                            {name: 'contextConfig', type: 'object'},
                            {
                                name: 'clazz',
                                type: 'string',
                                defaultValue: 'com.qpp.cgp.composing.config.PageGenerateConfig'
                            }
                        ],
                        data: data
                    }),
                    columns: [
                        {
                            text: i18n.getKey('pageConfig'),
                            dataIndex: 'pageConfigId',
                            width: 200,
                            xtype: 'componentcolumn',
                            renderer: function (value, metadata, record) {
                                var page = controller.getPageConfigs(value)[0];
                                return page.name + '(' + page._id + ')';
                                /*
                                                                console.log(value);
                                                                metadata.tdAttr = 'data-qtip="查看page配置"';
                                                                return {
                                                                    xtype: 'displayfield',
                                                                    value: '<a href="#")>' + value + '</a>',
                                                                    listeners: {
                                                                        render: function (display) {
                                                                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                                            ela.on("click", function () {
                                                                                JSOpen({
                                                                                    id: 'pageconfigpage',
                                                                                    url: path + 'partials/pageconfig/main.html?_id=' + value,
                                                                                    title: 'page配置',
                                                                                    refresh: true
                                                                                })
                                                                            });
                                                                        }
                                                                    }
                                                                };
                                */
                            }
                        },
                        {
                            text: i18n.getKey('productMaterialViewType'),
                            dataIndex: 'designDataConfig',
                            width: 180,
                            renderer: function (value, record) {
                                if (value) {
                                    return value.productMaterialViewTypeId
                                }
                            }
                        },
                        {
                            text: i18n.getKey('productMaterialViewType'),
                            dataIndex: 'designDataConfig',
                            width: 200,
                            renderer: function (value, record) {
                                if (value) {
                                    return '<div style="white-space:normal;word-wrap:break-word; overflow:hidden;">' + value.materialPath + '</div>';
                                }
                            }
                        },
                        {
                            text: i18n.getKey('上下文变量'),
                            dataIndex: 'contextConfig',
                            flex: 1,
                            xtype: 'componentcolumn',
                            renderer: function (value, record) {
                                if (value) {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#")>查看上下文变量</a>',
                                        listeners: {
                                            render: function (display) {
                                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                ela.on("click", function () {
                                                    controller.showContext(value);
                                                });
                                            }
                                        }
                                    };
                                }
                            }
                        }
                    ]
                }
            ]
        });
        win.show();
    },
    /**
     * 跳转查看productMaterialViewType
     */
    checkProductMaterialViewType: function (materialViewTypeId, productId, productBomConfigId, productConfigDesignId) {
        var tab = window.parent.Ext.getCmp('builderConfigTab');
        var url = path + "partials/product/productconfig/productdesignconfig/productmaterialviewtype/main.html" +
            "?productConfigDesignId=" + productConfigDesignId +
            '&productBomConfigId=' + productBomConfigId +
            '&productId=' + productId +
            '&productMaterialViewTypeId=' + materialViewTypeId;
        var title = i18n.getKey('manager') + i18n.getKey('product') + i18n.getKey('material') + i18n.getKey('view') + i18n.getKey('type');
        var managerProductMaterialViewType = Ext.getCmp('managerProductMaterialViewType,');
        tab.remove(managerProductMaterialViewType);
        if (managerProductMaterialViewType == null) {
            managerProductMaterialViewType = tab.add({
                id: 'managerProductMaterialViewType',
                title: title,
                html: '<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>',
                closable: true,
                refresh: true,
            });
        } else {
            managerProductMaterialViewType.setTitle(title);
            managerProductMaterialViewType.update('<iframe id="tabs_iframe_' + 'edit' + '" src="' + url + '" width="100%" height="100%" frameBorder="0" onactivate="Ext.menu.MenuMgr.hideAll();"></iframe>');

        }
        tab.setActiveTab(managerProductMaterialViewType);
    },
    /**
     * 根据impositionId查找出其对应最新的design配置
     */
    getLatestProductConfigDesign: function (impositionId) {
        var designConfig = null;
        Ext.Ajax.request({
            url: encodeURI(adminPath + 'api/productConfigImpositions/' + impositionId + '/latestProductConfigDesign'),
            method: 'GET',
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    designConfig = responseMessage.data;
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        })
        return designConfig;

    },
    /**
     * 构建执行上下文
     * @param productId
     * @returns {[]}
     */
    buildContentData: function (productId) {
        var contentData = [];
        var preView = JSGetQueryString('preView');
        preView = (preView == 'true' ? true : false);
        var url = adminPath + 'api/products/configurable/' + productId + '/skuAttributes';
        var path = 'args.context.lineItems[0].productAttributeValueMap';//该属性在上下文中的路径
        if (preView) {
            path = 'args.context.productAttributeValueMap';
        }
        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            var responseText = Ext.JSON.decode(response.responseText);
            var attributes = responseText.data;
            for (var i = 0; i < attributes.length; i++) {
                var item = attributes[i];
                var attribute = item.attribute;
                contentData.push({
                    key: attribute.id,
                    type: 'skuAttribute',
                    valueType: attribute.valueType,
                    selectType: attribute.selectType,
                    attrOptions: attribute.options,
                    required: item.required,
                    displayName: item.displayName + '(' + item.id + ')',//sku属性
                    path: path,//该属性在上下文中的路径
                    attributeInfo: item
                })
            }
        })
        contentData.push({
            key: 'qty',
            type: 'skuAttribute',
            valueType: 'Number',
            selectType: 'NON',
            attrOptions: [],
            required: true,
            displayName: 'Qty',
            path: 'args.context.lineItems[0]',//该属性在上下文中的路径
            attributeInfo: {}
        });
        return contentData;
    },
    /**
     * 构建上下文数据，排版使用
     * @param productId
     * @returns {[]}
     */
    buildContentTemplate: function (contentData) {
        var me = this;
        var preView = JSGetQueryString('preView');
        preView = (preView == 'true' ? true : false);
        if (preView == true) {
            var contextTemplate = {
                args: {
                    "context": {
                        "productInstance": {
                            "_id": "14960422",
                            "clazz": "com.qpp.cgp.domain.bom.runtime.ProductInstance",
                            "productId": 14804619,
                            "name": "instance-test",
                            "material": {
                                "_id": "9254301",
                                "clazz": "com.qpp.cgp.domain.bom.MaterialSpu",
                            },
                            "productMaterialViews": [
                                {
                                    "_id": "14960415",
                                    "idReference": "ProductMaterialView",
                                    "clazz": "com.qpp.cgp.domain.bom.runtime.ProductMaterialView",
                                },
                                {
                                    "_id": "14960417",
                                    "idReference": "ProductMaterialView",
                                    "clazz": "com.qpp.cgp.domain.bom.runtime.ProductMaterialView",
                                }
                            ],
                            "productConfigBomId": 14804628,
                            "productConfigViewId": 14804630,
                            "productConfigImpositionId": 14804629,
                            "productConfigDesignId": 14804641,
                            "thumbnail": "5f4e2365-a814-46c9-9d62-3bbe8eea4839-0.jpg",
                            "productConfigBom": {
                                "id": 14804628,
                                "clazz": "com.qpp.cgp.domain.product.config.ProductConfigBom",
                            },
                            "productConfigView": {
                                "id": 14804630,
                                "clazz": "com.qpp.cgp.domain.product.config.ProductConfigView",
                            },
                            "productConfigImposition": {
                                "id": 14804629,
                                "clazz": "com.qpp.cgp.domain.product.config.ProductConfigImposition",
                            },
                            "productConfigDesign": {
                                "id": 14804641,
                                "clazz": "com.qpp.cgp.domain.product.config.ProductConfigDesign",
                            },
                            "libraries": {},
                            "propertyModelId": "14959025",
                            "propertyModel": {
                                "_id": "14959025",
                                "clazz": "com.qpp.cgp.domain.attributecalculate.PropertyModel",
                            },
                            "product": {
                                "type": "sku",
                                "id": 14804619,
                                "createdDate": 1604917685000,
                                "createdBy": "9318118",
                                "modifiedDate": 1607938356227,
                                "modifiedBy": "495659",
                                "model": "BGM2x1.75Hex",
                                "name": "Hexagon Game Tiles1",
                                "salePrice": 10.0,
                                "weight": 10.0,
                                "compositeId": "",
                                "medias": [],
                                "template": {
                                    "id": 14804618,
                                    "clazz": "com.qpp.cgp.domain.product.ProductTemplate",
                                    "modifiedDate": 1604917684690,
                                    "modifiedBy": "9318118",
                                    "multilingualKey": "com.qpp.cgp.domain.product.ProductTemplate"
                                },
                                "templateId": 14804618,
                                "mainCategoryId": 8128431,
                                "subCategories": [
                                    {
                                        "id": 6062342,
                                        "clazz": "com.qpp.cgp.domain.product.category.SubProductCategory",
                                    }
                                ],
                                "subCategoryIds": [6062342],
                                "attributeValues": [],
                                "composingType": {
                                    "id": 3,
                                    "clazz": "com.qpp.cgp.domain.product.ComposingType",
                                },
                                "composingTypeId": 3,
                                "builderType": "",
                                "mustOrderQuantity": 0,
                                "quantityPrices": [],
                                "mode": "TEST",
                                "configurableProductId": 8774869,
                                "sku": "BGM2x1.75Hex-17",
                                "packages": [],
                                "multilingualKey": "com.qpp.cgp.domain.product.SkuProduct"
                            },
                            "productAttributeValueMap": {}
                        },
                        "productAttributeValues": [],
                        productAttributeValueMap: {}
                    }
                }
            };
            return contextTemplate;

        } else {
            var contextTemplate = {
                args: {
                    "context": {
                        id: null,
                        lineItems: [
                            {
                                id: null,
                                seqNo: null,
                                productInstanceId: null,
                                productModel: null,
                                productName: null,
                                productSku: null,
                                price: null,
                                amount: null,
                                qty: null,
                                product: null,
                                qtyRefunded: null,
                                amountRefunded: null,
                                productAttributeValues: null,
                                comment: null,
                                productInstance: null,
                                status: null,
                                materialId: null,
                                attributeValueMap: null,
                            }
                        ],
                        orderNumber: null,
                        datePurchased: null,
                        confirmedDate: null,
                        isTest: null,
                        customerId: null,
                        customerName: null,
                        customerEmail: null,
                        deliveryName: null,
                        deliveryCountry: null,
                        deliveryState: null,
                        deliveryCity: null,
                        deliverySuburb: null,
                        deliveryStreetAddress1: null,
                        deliveryPostcode: null,
                        deliveryTelephone: null,
                        deliveryMobile: null,
                        deliveryEmail: null,
                        shippingMethod: null,
                        status: null,
                        currencyCode: null,
                        currencyValue: null,
                        totalQty: null,
                        tax: null,
                        subtotalExTax: null,
                        subtotalIncTax: null,
                        totalExTax: null,
                        totalIncTax: null,
                        orderTotals: null,
                        shippingModuleCode: null,
                        shippingRefunded: null,
                        totalRefunded: null,
                        website: null,
                        partner: null
                    }
                }
            };
            return contextTemplate;
        }

    },
    /**
     * @param impositionId
     * @param data
     */
    saveUserParams: function (impositionId, data) {
        var method = 'PUT';
        var url = adminPath + 'api/productConfigImpositions/' + impositionId + '/userParams';
        JSAjaxRequest(url, method, true, data, null, function () {
        }, true);
    },

    validGenerateCondition: function (ids, context) {
        var jsonData = {
            jobGenerateIds: ids,
            context: context
        };
        var url = '', method = 'POST';
        var successCallBack = function (data) {
            Ext.Msg.alert('提示', '测试结果：' + JSON.stringify(data));
        };
        JSSendRequest(url, method, true, successCallBack, jsonData);
    },

    /**
     * 获取rtType下的rtAttribute
     * @param rtTypeId
     * @returns {rtAttributes}
     */
    getRtAttribute: function (rtTypeId) {
        var rtAttribute = [];
        if (rtTypeId) {
            var url = 'api/rtTypes/' + rtTypeId + '/rtAttributeDefs';
            var successCallBack = function (data) {
                for (var i = 0; i < data.length; i++) {
                    var attribute = data[i], options = [];
                    if (attribute.options) {
                        options = attribute.options.map(function (item) {
                            item.id = item.id || item.value;
                            return item;
                        })
                    }
                    rtAttribute.push({
                        key: attribute.name,
                        type: 'rtAttribute',
                        valueType: attribute.valueType,
                        selectType: attribute.selectType,
                        attrOptions: options,
                        required: false,
                        displayName: attribute.name + '(' + attribute._id + ')',
                        attributeInfo: attribute,
                        path: 'args.context.lineItems[0].userImpositionParams'//args.context后的路径
                    })
                }
            };
            JSSendRequest(url, "GET", false, successCallBack);
        }
        return rtAttribute;
    }
})
