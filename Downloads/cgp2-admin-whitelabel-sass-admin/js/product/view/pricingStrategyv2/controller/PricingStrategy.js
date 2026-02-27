Ext.Loader.syncRequire([
    'CGP.product.view.pricingStrategyv2.view.conditionV2.ConditionFieldSet'
])
Ext.define("CGP.product.view.pricingStrategyv2.controller.PricingStrategy", {
    url: '',
    constructor: function (config) {
        var me = this;
        me.transformController = Ext.create('CGP.product.controller.AttributePropertyDtoTransformController');
        //重写获取数据的方法，不影响产品那边的代码

        me.transformController.getBaseValueResult = function (baseValue) {
            var resultValue = '';
            if (baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.FixValue') {
                if (Array.isArray(baseValue.value)) {
                    resultValue = baseValue.value.join(',');
                } else {
                    resultValue = baseValue.value;
                }
                if (!Ext.isString(resultValue)) {
                    resultValue = '"' + resultValue + '"';
                }
            } else if (baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue') {
                resultValue = baseValue.calculationExpression;
            } else if (baseValue.attributeId && baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue') {
                //处理Qty这个属性的特殊情况，该属性不是正常的产品属性
                if (baseValue.attributeId == 'qty') {
                    resultValue = `p['${baseValue.attributeId}']`;
                    return resultValue;
                }
                if (baseValue.skuAttribute && baseValue.skuAttribute.attribute) {
                    resultValue = "attribute_" + baseValue.attributeId;
                    if (baseValue.skuAttribute.attribute.selectType == 'SINGLE' && (baseValue.propertyName == 'Value' || baseValue.propertyName == undefined)) {
                        resultValue += '[0]';
                    }
                }
            } else if (baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue') {
                resultValue = "skuAttribute_" + baseValue.skuAttributeId;
            } else if (baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.PropertyPathValue') {
                resultValue = this.getPropertyPathValue(baseValue);
            } else if (baseValue.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.VariableValue') {
                resultValue = `p['${baseValue.name}']`;
            }
            return resultValue;
        };
        me.callParent(arguments);
    },
    /**
     * 保存定价策略
     * @param data
     * @param tabPanel
     * @param configUrl
     * @returns {null}
     */
    save: function (data, tabPanel, configUrl) {
        var controller = this;
        var result = null;
        var method = 'POST', url = adminPath + 'api/pricingstrategies';
        if (!Ext.isEmpty(data._id) && data._id != 0) {
            method = 'PUT';
            url = url + "/" + data._id;
        } else {
            data._id = JSGetCommonKey();
        }
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            async: false,
            jsonData: data,
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    result = resp;
                    tabPanel.getComponent('pricingStrategy').getComponent('_id').setValue(resp.data?._id);
                    var title = tabPanel.getComponent('pricingStrategy').title.replace('新建', '修改');
                    title = title.split('(').shift();
                    tabPanel.getComponent('pricingStrategy').setTitle(title + '(' + resp.data?._id + ')');
                    tabPanel.afterSave(resp, tabPanel, method);
                } else {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            },
            callback: function () {

            }
        });
        return result;
    },
    delete: function (url, tabPanel) {
        JSAjaxRequest(url, 'DELETE', false, null, '', function (require, success, response) {
        })
    },
    isCosting: function () {
        var clazz = JSGetQueryString('clazz');
        return (CGP.product.view.pricingStrategyv2.config.Config[clazz].configType == 'costPrice');
    },
    /*
     * 定价编辑窗口
     * */
    PricingWind: function (gpanel, record) {
        var grid = gpanel.gridConfig, me = this;
        var title = i18n.getKey('edit') + i18n.getKey('pricing'), isEdit = true;
        if (Ext.isEmpty(record)) {
            title = i18n.getKey('create') + i18n.getKey('pricing');
            isEdit = false;
            var record = Ext.create('CGP.product.view.pricingStrategyv2.model.PricingTable');
            var maxTo = Ext.num(grid.store.max('to'), 0);
            if (maxTo >= 2147483647) {
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('当前列表中区间最大数量已是数值最大值，不能超出数值的最大值！'));
                return false;
            }
            // record.set('_id', JSGetCommonKey());
            record.set('from', maxTo + 1);
            record.set('to', record.get('from') + 1);
            //store.add(record);
        }
        var win = Ext.create("Ext.window.Window", {
            itemId: "addPricing",
            title: title,
            modal: true,
            bodyPadding: 10,
            width: 500,
            height: 300,
            layout: 'fit',
            items: [
                Ext.create('CGP.product.view.pricingStrategyv2.view.PricingForm', {
                    itemId: 'pricingForm',
                    isCosting: me.isCosting(),
                    gridContainer: gpanel.gridContainer,
                    pricingModel: record,
                })
            ],
            bbar: ['->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var wind = btn.ownerCt.ownerCt;
                        var formComp = wind.getComponent('pricingForm');
                        if (formComp.getForm().isValid()) {
                            var data = formComp.getValue();
                            if (isEdit) {
                                //var rc = grid.getSelectionModel().getSelected();
                                for (var key in data) {
                                    if (key != '_id') {
                                        record.set(key, data[key]);
                                    }
                                }
                            } else {
                                data['_id'] = Ext.Number.from(JSGetCommonKey(), 0);
                                data['index'] = grid.store.getCount();
                                grid.store.add(data)
                            }
                            wind.close();
                        }
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        btn.ownerCt.ownerCt.close();
                    }
                }]
        });
        win.show();
    },

    /*
     * 产品定价策略配置列表修改定价策略
     * */
    openStrategyWindow: function (tabPanel, id, productId) {
        var me = this;
        var method = 'get', url = adminPath + 'api/pricingstrategies/' + id;
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    var strategyModel = Ext.create('CGP.product.view.pricingStrategyv2.model.PricingStrategy', resp.data);
                    var strategyType = strategyModel.data['strategyType'];
                    var title = i18n.getKey('edit') + i18n.getKey('pricingStrategy') + '(' + id + ')';
                    me.createStrategy(tabPanel, id, strategyType, title, productId, strategyModel);

                } else {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            },
            callback: function () {

            }
        });
    },
    // costStrategyWindow: function (tabPanel, id, strategyType, title, productId, strategyModel, null, 'costingStrategy')
    costStrategyWindow: function (tabPanel, id, strategyType, title, productId, strategyModel, isProductRule, costingStrategy) {
        var me = this;
        var method = 'get', url = adminPath + 'api/products/configurable/' + productId + '/skuAttributes';
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    var contextAttributeStore = Ext.data.StoreManager.get('contextAttributeStore');
                    contextAttributeStore.loadData(resp.data);
                    me.createStrategy(tabPanel, id, strategyType, title, productId, strategyModel, isProductRule, costingStrategy);

                } else {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            },
            callback: function () {

            }
        });
    },
    /*
     * 选择策略类型窗口
     * */
    strategyTypeWindow: function (tabPanel, id) {
        var me = this;
        var type = 'pricingStrategy';
        if (tabPanel.itemId == 'productCostingStrategy' || tabPanel.itemId == 'partnerProductCostingStrategy') {//产品和partner中的计价都是这个itemId
            type = 'costingStrategy'
        }
        var strategyStore = Ext.create('Ext.data.Store', {
            fields: ['value', 'displayName'],
            data: [
                {
                    "value": "com.qpp.cgp.domain.pricing.configuration.SimpleQtyTablePricingSetting",
                    "displayName": i18n.getKey('simple') + i18n.getKey(type)
                },
                {
                    "value": "com.qpp.cgp.domain.pricing.configuration.AdditionQtyTablePricingSetting",
                    "displayName": i18n.getKey('addition') + i18n.getKey(type)
                },
                {
                    "value": "com.qpp.cgp.domain.pricing.configuration.MathExpressionPricingSetting",
                    "displayName": i18n.getKey('expression') + i18n.getKey(type)
                }
            ]
        });
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('strategy') + i18n.getKey('type'),
            itemId: 'strategyTypeWindow',
            bodyPadding: 10,
            width: 400,
            height: 160,
            modal: true,
            constrain: true,
            items: [
                {
                    xtype: 'combo',
                    itemId: 'strategyType',
                    name: 'strategyType',
                    editable: false,
                    fieldLabel: i18n.getKey('type'),
                    store: strategyStore,
                    queryMode: 'local',
                    displayField: 'displayName',
                    valueField: 'value',
                    allowBlank: false,
                    value: 'com.qpp.cgp.domain.pricing.configuration.SimpleQtyTablePricingSetting',
                    labelAlign: 'right',
                    width: 300
                }
            ],
            bbar: ['->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var wid = btn.ownerCt.ownerCt, strategyType = wid.getComponent('strategyType').getValue();
                        var title = i18n.getKey('create') + i18n.getKey('pricingStrategy');
                        me.createStrategy(tabPanel, id, strategyType, title, me.productId);
                        wid.close();

                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        btn.ownerCt.ownerCt.close();
                    }
                }]
        }).show();
    },
    /**
     *
     * @param tabPanel 最外面的tab
     * @param id 策略id
     * @param strategyType
     * @param title 指定title
     * @param productId
     * @param strategyModel
     * @param isProductRule 是否是产品上的价格规则，partner不能修改产品上的价格规则
     */
    createStrategy: function (tabPanel, id, strategyType, title, productId, strategyModel, isProductRule) {
        var clazzName = '';
        switch (strategyType) {
            case 'com.qpp.cgp.domain.pricing.configuration.AdditionQtyTablePricingSetting':
                clazzName = 'CGP.product.view.pricingStrategyv2.view.AdditionTableEdit';
                break;
            case 'com.qpp.cgp.domain.pricing.configuration.MathExpressionPricingSetting':
                clazzName = 'CGP.product.view.pricingStrategyv2.view.expressionPS.ExpressionPSEdit';
                break;
            default:
                clazzName = 'CGP.product.view.pricingStrategyv2.view.PricingStrategyEdit';
        }
        var title = null;
        var result = '';
        switch (strategyType) {
            case "com.qpp.cgp.domain.pricing.configuration.SimpleQtyTablePricingSetting":
                result = i18n.getKey('simple') + i18n.getKey('strategy');
                break;
            case "com.qpp.cgp.domain.pricing.configuration.AdditionQtyTablePricingSetting":
                result = i18n.getKey('addition') + i18n.getKey('strategy');
                break;
            case "com.qpp.cgp.domain.pricing.configuration.MathExpressionPricingSetting":
                result = i18n.getKey('expression') + i18n.getKey('strategy');
                break;
        }
        var tbarConfig = {};
        var type = 'pricingStrategy';
        if (tabPanel.itemId == 'productCostingStrategy' || tabPanel.itemId == 'partnerProductCostingStrategy') {
            type = 'costingStrategy'
        }
        title = Ext.isEmpty(id) ? (i18n.getKey('create') + result) : (i18n.getKey('edit') + result + '(' + id + ')');
        if (type != 'costingStrategy') {
        } else {
            tbarConfig = {
                btnReset: {
                    disabled: tabPanel.itemId == 'partnerProductCostingStrategy' ? true : false,//产品的成本规则,能修改,partner的成本规则不能修改
                    iconCls: 'icon_edit',
                    hidden: true,
                    text: i18n.getKey('重新配置策略'),
                    handler: function () {
                        var pricingController = Ext.create('CGP.product.view.pricingStrategyv2.controller.PricingStrategy');
                        pricingController.strategyTypeWindow(tabPanel, null);
                    }
                }
            };
        }
        var pricingStrategy = Ext.create(clazzName, {
            itemId: 'pricingStrategy',
            title: title,
            productId: productId,
            closable: true,
            readOnly: isProductRule,
            strategyId: id,
            tabPanel: tabPanel,
            strategyModel: strategyModel,
            tbarConfig: tbarConfig
        });
        tabPanel.remove('pricingStrategy');
        tabPanel.add(pricingStrategy);
        tabPanel.setActiveTab(pricingStrategy.itemId);
    },
    /**
     * 策略执行条件转换成产品计价配置筛选表达式
     * @param configStrategys
     * @returns {string}
     */
    translateConditions: function (configStrategys) {
        var transformController = this.transformController;
        Ext.create('CGP.product.controller.AttributePropertyDtoTransformController');
        var filterExp = 'function expression(p) { var result=0;', expBody = '';
        var defualtIndex = 0;
        //attributeId添加attribute
        var addAttribute = function (ops) {
            if (!Ext.isArray(ops))
                return false;
            var contextAttributeStore = Ext.data.StoreManager.get('contextAttributeStore');
            ops.forEach(function (item) {
                if (item.operations && item.operations[0] && item.operations[0].attributeId && Ext.isEmpty(item.operations[0].skuAttribute)) {
                    var attrRecord = contextAttributeStore.findRecord('attributeId', item.operations[0].attributeId);
                    if (attrRecord)
                        item.operations[0].skuAttribute = attrRecord.data;
                }
            })
        };
        for (var i = 0; i < configStrategys.length; i++) {
            if (configStrategys[i].filterSetting && configStrategys[i].filterSetting.operation) {
                var operation = configStrategys[i].filterSetting.operation;
                if (operation && operation.operations) {
                    addAttribute(operation.operations);
                }
                if (operation && operation.operations && operation.operations.operations && operation.operations.operations[0] && operation.operations.operations[0].attributeId && Ext.isEmpty(operation.operations.operations[0].skuAttribute)) {
                    var contextAttributeStore = Ext.data.StoreManager.get('contextAttributeStore');
                    var attrRecord = contextAttributeStore.findRecord('attributeId', operation.operations.operations[0].attributeId);
                    if (attrRecord)
                        operation.operations.operations[0].skuAttribute = attrRecord.data;
                }

                var currentCondition = "";

                var condition = transformController.inputCondition(configStrategys[i].filterSetting);
                //要对自定义的表达式进行特殊处理，变成立即执行表达式
                if (configStrategys[i].filterSetting.conditionType == 'custom') {
                    condition = `(${condition})(p)`
                }
                console.log(condition);
                if (condition) {
                    currentCondition = 'else if((' + condition + ')){ result=' + configStrategys[i].index + '; }';
                }
                var arrMatch = currentCondition.match(/attribute_[a-zA-Z0-9]+/g);
                if (arrMatch) {
                    Ext.Array.forEach(arrMatch, function (itemMatch) {
                        currentCondition = currentCondition.replace(itemMatch, "attrs['" + itemMatch.replace('attribute_', '') + "']");
                        currentCondition = currentCondition.replace('else if(', "else if(attrs['" + itemMatch.replace('attribute_', '') + "']&&");
                    })
                }
                expBody += currentCondition;
            }
            if (configStrategys[i].isDefault) {
                defualtIndex = configStrategys[i].index;

            }
        }
        var attrSetValue = 'function isContained(aa,bb){if(typeof(bb)=="string"){bb=bb.split(",")}if(aa==null||aa==undefined||aa==""){return false}if(bb==null||bb==undefined||bb==""){return false}for(var i=0;i<bb.length;i++){var flag=false;for(var j=0;j<aa.length;j++){if(aa[j]==bb[i]){flag=true;break}}if(flag==false){return flag}}return true};function equal(arr1,arr2){var flag=true;if(typeof(arr1)=="string"){arr1=arr1.split(",")}if(typeof(arr2)=="string"){arr2=arr2.split(",")}if(arr1==""||arr1==undefined||arr1==null){if(arr2.length==0){return true}else{return false}}if(arr2==""||arr2==undefined||arr2==null){if(arr1.length==0){return true}else{return false}}if(arr1.length!==arr2.length){flag=false}else{arr1.forEach(function(item,index,arr){if(!isContained(arr2,[item])){flag=false}})}return flag};' +
            "var attrs=p.productAtrributeValue; if (!attrs || JSON.stringify(attrs) === '{}') {result=" + defualtIndex + ";}";
        if (Ext.isEmpty(expBody)) {
            expBody += 'result=' + defualtIndex + '; ';
        } else {
            expBody += ' else{ result=' + defualtIndex + ';} ';
        }

        filterExp += attrSetValue + expBody;
        filterExp += ' return result;}';
        return filterExp.replace(/\"/g, "'");
    },
    /*
     * 条件转换成表达式并保存产品定价策略配置
     * */
    saveConfig: function (data, strategiesViewGrid, isDelete, pricingConfigUrl) {
        var me = this;
        var configStrategys = data.strategies;
        var haveDefault = false;
        for (var i = 0; i < configStrategys.length; i++) {
            configStrategys[i].index = i;
            if (configStrategys[i].isDefault) {
                haveDefault = configStrategys[i].isDefault;
            }
        }
        if (!haveDefault && configStrategys[0]) {//未设置默认策略将index为0的设置为默认策略
            configStrategys[0].isDefault = true;
        }
        data['strategies'] = configStrategys;
        me.saveProductPricing(data, strategiesViewGrid, isDelete, pricingConfigUrl);
    },
    /**
     * 保存产品定价策略配置
     * @param data
     * @param strategiesViewGrid
     * @param isDelete
     * @param pricingConfigUrl
     */
    saveProductPricing: function (data, strategiesViewGrid, isDelete, pricingConfigUrl) {
        var me = this;
        if (Ext.isEmpty(data['filter'])) {
            data['filter'] = {
                "type": "JavaScript",
                "expression": ""
            }
        }
        //条件转换成表达式
        data['filter'].expression = me.translateConditions(data['strategies']);
        console.log(data['filter'].expression)
        var method = 'POST';
        if (!Ext.isEmpty(data._id) && data._id != 0) {
            method = 'PUT';
            pricingConfigUrl += "/" + data._id;
        } else {
            data._id = JSGetCommonKey();
        }
        Ext.Ajax.request({
            url: pricingConfigUrl,
            method: method,
            async: false,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            jsonData: data,
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    var model = new CGP.product.view.pricingStrategyv2.model.ProductPricingConfig(resp.data);
                    strategiesViewGrid.refreshData(resp.data['strategies']);
                    if (!isDelete) {
                        Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveSuccess'));
                    }
                } else {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            },
            callback: function () {

            }
        });
    },
    /*
    * 设置默认策略
    * */
    setDefaultStrategy: function (strategyId, strategiesViewGrid, pricingConfigUrl) {
        var me = this, productPricing = strategiesViewGrid.ownerCt.productPricingConfig.data;
        Ext.Array.each(productPricing['strategies'], function (item) {
            item.isDefault = item._id == strategyId;
        });
        me.saveProductPricing(productPricing, strategiesViewGrid, false, pricingConfigUrl);
    },
    /**
     * 执行条件编辑窗口
     * @param productId
     * @param data
     * @param tabPanel
     * @param psId
     * @param pricingConfigUrl
     */
    conditionWind: function (productId, data, tabPanel, psId, pricingConfigUrl) {
        var me = this;
        var method = 'GET', url = adminPath + 'api/pricingstrategies/' + psId;
        var isLock = JSCheckProductIsLock(productId);
        Ext.Ajax.request({
            url: url,
            method: method,
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            //jsonData: null,
            success: function (response, options) {
                var resp = Ext.JSON.decode(response.responseText);
                if (resp.success) {
                    var pricingStrategyData = resp.data;
                    var win = Ext.create("Ext.window.Window", {
                        itemId: "conditionWind",
                        title: i18n.getKey('condition'),
                        modal: true,
                        bodyPadding: 10,
                        width: 800,
                        height: 600,
                        layout: 'fit',
                        items: [
                            {
                                xtype: 'form',
                                border: 0,
                                layout: 'fit',
                                items: [
                                    {
                                        xtype: 'pricing_condition_fieldset',
                                        // title: i18n.getKey('执行规则的前提条件'),
                                        title: '',
                                        itemId: 'conditioncomp',
                                        productId: me.productId,
                                        margin: '10 10 10 10',
                                        name: 'condition',
                                        leftAttributes: [],//输入的属性
                                        border: 0,
                                        width: '100%',
                                        checkOnly: false,
                                        listeners: {
                                            afterrender: function (comp) {
                                                if (data && data.filterSetting)
                                                    comp.setValue(data.filterSetting);
                                            }
                                        }
                                    }
                                ]
                            }

                        ],
                        bbar: ['->',
                            {
                                xtype: 'button',
                                text: i18n.getKey('confirm'),
                                iconCls: 'icon_agree',
                                disabled: isLock,
                                handler: function (btn) {
                                    var wind = btn.ownerCt.ownerCt;
                                    var conditionComp = wind.down('form').getComponent('conditioncomp');
                                    var strategiesViewGrid = tabPanel.getComponent('productStrategyGrid');
                                    if (conditionComp.isValid()) {
                                        data.filterSetting = conditionComp.getValue();
                                        var configModel = tabPanel.productPricingConfig;
                                        configModel.set('strategies', strategiesViewGrid.getSubmitValue());
                                        me.saveConfig(configModel.data, strategiesViewGrid, false, pricingConfigUrl);
                                        wind.close();
                                    }
                                }
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('cancel'),
                                iconCls: 'icon_cancel',
                                handler: function (btn) {
                                    btn.ownerCt.ownerCt.close();
                                }
                            }]
                    });
                    win.show();
                } else {
                    Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + resp.data.message)
                }
            },
            failure: function (response, options) {
                var object = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('info'), i18n.getKey('saveFailure') + object.data.message);
            },
            callback: function () {

            }
        });
    },

    /*
    * 表格转换成表达式
    * */
    translateTable: function (tableData) {
        var expression = ''
        if (tableData && tableData.length > 0) {
            Ext.Array.each(tableData, function (item) {
                expression += ' if( p.qty>=' + item.from + '&& p.qty<=' + item.to + '){ value+=' + item.price + ';} else';
            });
        }
        expression = expression.substring(0, expression.lastIndexOf('else'))
        expression = expression;
        return expression;
    },

    translateSimpleSetting: function (data) {
        var me = this, factorGenerators = [];
        var digits = me.isCosting() ? 4 : 2;
        var tableData = data.mainTable || data.table;
        var result = {
            group: '',
            filter: {
                "value": true
            },
            subFormula: null
        };
        var expressionGenerator = {
            id: JSGetCommonKey(),
            description: 'mainTable',
            clazz: 'com.qpp.cgp.domain.pricing.configuration.ExpressionPricingFormula',
            formula: {
                "expression": '',
                "type": "Javascript"
            },
            factorGenerators: []
        }
        var expression = 'function expression(p) { var value=0; ' + me.translateTable(tableData);

        expression = expression + ' return value==0?1000:value.toFixed(' + digits + ');}';
//        expressionGenerator.formula.expression=expression;
//        result.subFormula=expressionGenerator;
//        factorGenerators.push(result);
        return expression;
    },

    translateAdditionSetting: function (data) {
        var me = this, factorGenerators = [];
        var digits = me.isCosting() ? 4 : 2;
        //主表转换
        var tableData = data.mainTable || data.table;
        var result = {
            group: '',
            index: 0,
            filter: {
                "value": true
            },
            subFormula: null
        };
        var expressionGenerator = {
            _id: JSGetCommonKey(),
            index: 0,
            description: 'mainTable',
            clazz: 'com.qpp.cgp.domain.pricing.configuration.ExpressionPricingFormula',
            formula: {
                "expression": '',
                "type": "Javascript"
            },
            factorGenerators: []
        };
        var expression = 'function expression(p) { var value=0; ';
        expression += me.translateTable(tableData) + ' return value==0?1000:value.toFixed(' + digits + ');}';
        expressionGenerator.formula.expression = expression;
        result.subFormula = expressionGenerator;
        factorGenerators.push(result);
        //附加表转换
        var additionData = data.additionTable;
        if (additionData && additionData.length > 0) {
            for (var i = 0; i < additionData.length; i++) {
                var item = additionData[i];
                var additionExpression = 'function expression(p) { var value=0; ' + me.translateTable(item.table) + ' return value.toFixed(' + digits + ');}';
                var additionResult = {
                    group: '',
                    index: i + 1,
                    filter: {
                        "expression": '',
                        "type": "Javascript"
                    },
                    subFormula: null
                };
                //condition translate to expression
                if (item.condition && item.condition.operation) {
                    // additionResult.filter.expression = me.translateOperation(item.condition.operation);
                    additionResult.filter.expression = item.condition?.expression?.expression || 'function expression(args) {return true;}';

                } else {
                    additionResult.filter = {value: true};
                }
                //table translate to expression
                var additionGenerator = {
                    _id: JSGetCommonKey(),
                    index: 0,
                    description: 'additionTable',
                    clazz: 'com.qpp.cgp.domain.pricing.configuration.ExpressionPricingFormula',
                    formula: {
                        "expression": '',
                        "type": "Javascript"
                    },
                    factorGenerators: []
                };

                additionGenerator.formula.expression = additionExpression;
                additionResult.subFormula = additionGenerator;
                //expressionGenerator.factorGenerators.push(additionResult);
                factorGenerators.push(additionResult);
            }
        }
        return factorGenerators;
    },
    /**
     * 条件对象转换成表达式
     * @param operation
     * @returns {string}
     */
    translateOperation: function (operation) {
        var transformController = this.transformController;
        var parameters = '', attIds = [],
            attSetValue = "var productAtrributeValue=p.productAtrributeValue;" +
                'function isContained(aa,bb){if(typeof(bb)=="string"){bb=bb.split(",")}if(aa==null||aa==undefined||aa==""){return false}if(bb==null||bb==undefined||bb==""){return false}for(var i=0;i<bb.length;i++){var flag=false;for(var j=0;j<aa.length;j++){if(aa[j]==bb[i]){flag=true;break}}if(flag==false){return flag}}return true};function equal(arr1,arr2){var flag=true;if(typeof(arr1)=="string"){arr1=arr1.split(",")}if(typeof(arr2)=="string"){arr2=arr2.split(",")}if(arr1==""||arr1==undefined||arr1==null){if(arr2.length==0){return true}else{return false}}if(arr2==""||arr2==undefined||arr2==null){if(arr1.length==0){return true}else{return false}}if(arr1.length!==arr2.length){flag=false}else{arr1.forEach(function(item,index,arr){if(!isContained(arr2,[item])){flag=false}})}return flag};' +
                "if (!productAtrributeValue || JSON.stringify(productAtrributeValue) === '{}') {return false;} ";
        var variableName = '';
        Ext.Array.forEach(operation.operations, function (opItem) {
            Ext.Array.forEach(opItem.operations, function (item) {
                if (item.clazz == 'com.qpp.cgp.domain.executecondition.operation.value.ProductAttributeValue') {
                    parameters += 'var attribute_' + item.attributeId + '=0; ';
                    attIds.push(item.attributeId);
                }
            });

        });

        if (!Ext.isEmpty(attIds)) {
            for (var i = 0; i < attIds.length; i++) {
                attSetValue += "attribute_" + attIds[i] + " = productAtrributeValue['" + attIds[i] + "'];";
                variableName += "attribute_" + attIds[i] + "&&";
            }
        }
        if (variableName) {
            return 'function expression(p) {' + parameters + ' var attIds=' + JSON.stringify(attIds) + '; ' + attSetValue + ' return ' + variableName + '(' + transformController.operation(operation) + ')?true:false;}';
        } else {
            return 'function expression(p) {' + parameters + ' var attIds=' + JSON.stringify(attIds) + '; ' + attSetValue + ' return true;}';

        }
    },

    translateExpressionSetting: function (args) {
        var me = this, factorGenerators = [];

        Ext.each(args, function (item) {
            var itemResult = {
                index: item.index,
                group: '',
                filter: {
                    "expression": '',
                    "type": "Javascript"
                },
                subFormula: null
            };
            if (item.attributeId && item.attributeId != 0) {
                itemResult.filter.expression = 'function expression(p) { var value=0;var attrs=p.product.attributeValues;for(var i=0;i<attrs.length;i++){if(attrs[i].id==' + item.attributeId + '){value=attrs[i].value;}} return {' + item.key + ':value};}'
            } else {
                itemResult.filter.expression = 'function expression(p) { var value=0; ' + me.translateTable(item.table) + ' return {' + item.key + ':value};}'
            }

            factorGenerators.push(itemResult);
        });
        return factorGenerators;
    },

    /*编辑属性参数*/
    argumentWind: function (argGrid) {
        var me = this;
        var argumentStore = Ext.create('Ext.data.Store', {
            fields: ['value', 'displayName'],
            data: [
                {
                    "value": "CGP.product.view.pricingStrategyv2.view.expressionPS.AttributeArgument",
                    "displayName": i18n.getKey('attribute') + i18n.getKey('argument')
                },
                {
                    "value": "CGP.product.view.pricingStrategyv2.view.expressionPS.QtyArgument",
                    "displayName": i18n.getKey('qty') + i18n.getKey('argument')
                }
            ]
        });
        Ext.create('Ext.window.Window', {
            title: i18n.getKey('argument') + i18n.getKey('type'),
            itemId: 'argumentTypeWindow',
            bodyPadding: 10,
            width: 400,
            height: 160,
            items: [
                {
                    xtype: 'combo',
                    itemId: 'argumentType',
                    name: 'argumentType',
                    fieldLabel: i18n.getKey('type'),
                    store: argumentStore,
                    queryMode: 'local',
                    displayField: 'displayName',
                    valueField: 'value',
                    allowBlank: false,
                    value: 'CGP.product.view.pricingStrategyv2.view.expressionPS.AttributeArgument',
                    labelAlign: 'right',
                    width: 300
                }
            ],
            bbar: ['->',
                {
                    xtype: 'button',
                    text: i18n.getKey('confirm'),
                    iconCls: 'icon_agree',
                    handler: function (btn) {
                        var wid = btn.ownerCt.ownerCt, argumentType = wid.getComponent('argumentType').getValue();
                        var title = i18n.getKey('create') + i18n.getKey('argument');
                        wid.close();
                        me.createArgument(argGrid, argumentType, title);
                    }
                },
                {
                    xtype: 'button',
                    text: i18n.getKey('cancel'),
                    iconCls: 'icon_cancel',
                    handler: function (btn) {
                        btn.ownerCt.ownerCt.close();
                    }
                }]
        }).show();
    },

    createArgument: function (expressionTab, argumentType, title, argumentModel) {
        var tabPanel = expressionTab.ownerCt
        var argumentTab = Ext.create(argumentType, {
            itemId: 'argumentEdit',
            title: title,
            closable: true,
            argumentModel: argumentModel,
            argGrid: expressionTab.getComponent('argumentGrid')
        });
        tabPanel.remove('argumentEdit');
        tabPanel.add(argumentTab);
        tabPanel.setActiveTab(argumentTab.itemId);
    },
    /**
     * 非sku属性不能使用
     * @param productId
     * @returns {*[]}
     */
    buildContextData: function (productId) {
        var contextData = [];
        var preView = JSGetQueryString('preView');
        preView = (preView == 'true' ? true : false);

        var path = 'args.productAtrributeValue';
        if (preView) {
            path = 'productAttributeValueMap';
        }
        /*
                var url = adminPath + 'api/products/' + productId + '/attributeValues';
        */
        var url = adminPath + 'api/products/configurable/' + productId + '/skuAttributes';
        JSAjaxRequest(url, 'GET', false, null, null, function (require, success, response) {
            var responseText = Ext.JSON.decode(response.responseText);
            var attributes = responseText.data;
            for (var i = 0; i < attributes.length; i++) {
                var item = attributes[i];
                var attribute = item.attribute;
                if (item.isSku == true) {
                    contextData.push({
                        key: attribute.id,
                        type: 'skuAttribute',
                        valueType: attribute.valueType,
                        selectType: attribute.selectType,
                        attrOptions: attribute.options,
                        required: item.required,
                        displayName: attribute.name + '(' + item.id + ')',//sku属性
                        path: path,
                        attributeInfo: item
                    });
                } else {
                    console.log('非sku:' + attribute.id);
                }
            }
        });
        contextData.push({
            key: 'qty',
            type: 'skuAttribute',
            valueType: 'Number',
            selectType: 'NON',
            attrOptions: [],
            required: true,
            displayName: 'Qty',
            path: 'args',
        });
        return contextData;
    },
});
