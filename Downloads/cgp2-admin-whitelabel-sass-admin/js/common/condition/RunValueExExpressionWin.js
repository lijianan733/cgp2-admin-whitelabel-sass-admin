/**
 * @Description:
 * 根据获取到的上下文，
 * 运行表达式的弹窗
 * @author nan
 * @date 2024/3/11
 */
Ext.Loader.syncRequire([
    'CGP.common.commoncomp.SBomMaterialSelectField',
    'CGP.common.field.ProductGridCombo',
    'CGP.common.condition.view.ExpressionTextarea'
])
Ext.define('CGP.common.condition.RunValueExExpressionWin', {
    extend: 'Ext.window.Window',
    id: 'runValueExpressionWin',
    title: i18n.getKey('测试表达式'),
    constrain: true,
    maximizable: true,
    layout: 'accordion',
    width: 700,
    height: 600,
    bodyStyle: {
        backgroundColor: '#ffffff'
    },
    valueEx: null,
    initContext: null,//初始化显示的上下文
    runValueExpression: function (valueEx, context) {
        var result = null;
        //var url = adminPath + 'api/test/expression';
        //不校验值类型
        var url = adminPath + 'api/attributeProperty/runExpression/v2';
        var jsonData = {
            expression: valueEx.expression,
            context: {
                context: context?.context,
            },
            params: context?.params,
            //需要套多一层
            attrs: {
                attrs: context?.context?.attrs,
                materialAttrs: context?.context?.materialAttrs
            }
        };
        JSAjaxRequest(url, 'POST', false, jsonData, false, function (require, success, response) {
            if (success) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                result = responseMessage
            }
        });
        return result;
    },
    initComponent: function () {
        var me = this;
        var valueEx = me.valueEx;
        var initContext = me.initContext;
        var runValueExpression = me.runValueExpression;
        var productBomStore = Ext.create('CGP.product.view.productconfig.productbomconfig.store.ProductBomConfigStore', {
            params: {},
            autoLoad: false,
        });
        me.items = [
            {
                xtype: 'panel',
                title: '<font style="color: green;font-weight: bold">上下文</font>',
                layout: {
                    type: 'fit'
                },
                items: [{
                    xtype: 'objectvaluefield',
                    labelAlign: 'top',
                    title: '上下文',
                    width: '100%',
                    flex: 1,
                    region: 'center',
                    collapsible: true,
                    itemId: 'objectvaluefield',
                    name: 'objectvaluefield',
                    infoTip: 'objectvaluefield',
                    jsonTreePanelConfig: {
                        extraBtn: [{
                            index: 2,
                            config: {
                                xtype: 'button',
                                text: '导入',
                                iconCls: 'icon_more',
                                menu: {
                                    defaults: {
                                        margin: '2 25 3 25'
                                    },
                                    isValid: function () {
                                        var menu = this;
                                        var isValid = true;
                                        menu.items.items.map(function (item) {
                                            if (item.isVisible() && item.disabled == false && item.isValid() == false) {
                                                isValid = false;
                                            }
                                        });
                                        return isValid;
                                    },
                                    getValue: function () {
                                        var menu = this;
                                        var data = {};
                                        menu.items.items.map(function (item) {
                                            if (item.isVisible() && item.disabled == false) {
                                                if (item.diyGetValue) {
                                                    data[item.getName()] = item.diyGetValue();
                                                } else if (item.getValue) {
                                                    data[item.getName()] = item.getValue();
                                                }
                                            }
                                        });
                                        return data;
                                    },
                                    items: [
                                        {
                                            xtype: 'combo',
                                            fieldLabel: '类型',
                                            valueField: 'value',
                                            displayField: 'display',
                                            editable: false,
                                            itemId: 'type',
                                            name: 'type',
                                            value: 'product',
                                            store: {
                                                xtype: 'store',
                                                fields: ['value', 'display'],
                                                data: [{
                                                    value: 'product',
                                                    display: '普通产品上下文'
                                                }, {
                                                    value: 'order',
                                                    display: '订单和产品上下文'
                                                }, {
                                                    value: 'productAndMaterial',
                                                    display: '物料上下文+产品上下文'
                                                }, {
                                                    value: 'MMVT',
                                                    display: 'MMVT上下文方式 1'
                                                }, {
                                                    value: 'MMVT2',
                                                    display: 'MMVT上下文方式 2'
                                                }]
                                            },
                                            listeners: {
                                                change: function (field, newValue, oldValue) {
                                                    var arr1 = ['type', 'propertyModelId', 'confirmBtn', 'menu'];
                                                    var arr2 = ['type', 'propertyModelId', 'product', 'menu', 'bomConfigId', 'mappingConfigId', 'designConfigId', 'materialPath', 'confirmBtn'];
                                                    var arr3 = ['type', 'propertyModelId', 'product', 'menu', 'bomConfigId', 'materialPath', 'smuId', 'confirmBtn'];
                                                    var arr4 = ['type', 'propertyModelId', 'confirmBtn', 'menu'];
                                                    var menu = field.ownerCt;
                                                    menu.items.items.map(function (item) {
                                                        item.setDisabled(!Ext.Array.contains(['type', 'propertyModelId', 'confirmBtn'], item.itemId));
                                                        var arr = [];
                                                        if (newValue == 'product') {
                                                            arr = arr1;
                                                        } else if (newValue == 'MMVT' || newValue == 'productAndMaterial') {
                                                            arr = arr2;
                                                        } else if (newValue == 'MMVT2') {
                                                            arr = arr3;
                                                        } else if (newValue == 'order') {
                                                            arr = arr4;
                                                        }
                                                        item.setVisible(Ext.Array.contains(arr, item.itemId));
                                                    });
                                                    var PropertyModelId = field.ownerCt.getComponent('propertyModelId');
                                                    PropertyModelId.setValue();
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'combo',
                                            emptyText: 'PropertyModelId',
                                            name: 'propertyModelId',
                                            itemId: 'propertyModelId',
                                            allowBlank: false,
                                            haveReset: true,
                                            autoSelect: false,
                                            forceSelection: false,
                                            growToLongestValue: false,
                                            queryCaching: false,
                                            queryMode: 'local',
                                            valueField: 'value',
                                            displayField: 'display',
                                            fieldLabel: 'propertyModelId',
                                            store: {
                                                xtype: 'store',
                                                data: [],
                                                fields: [
                                                    {
                                                        type: 'string', name: 'value'
                                                    }, 'display'
                                                ]
                                            },
                                            listeners: {
                                                afterrender: function () {
                                                    var arr = [];
                                                    var str = Ext.util.Cookies.get('propertyModelId');
                                                    if (str) {
                                                        arr = Ext.JSON.decode(str);
                                                        var newArr = arr.map(function (item) {
                                                            return {
                                                                value: item,
                                                                display: item
                                                            };
                                                        })
                                                        arr = newArr;
                                                    }
                                                    this.store.proxy.data = arr;
                                                    this.store.load();
                                                },
                                                change: function (field, newValue, oldValue) {
                                                    var product = field.ownerCt.getComponent('product');
                                                    if (newValue) {
                                                        var url = adminPath + 'api/attributeProperty/' + newValue;
                                                        field.ownerCt.mask();
                                                        JSAjaxRequest(url, 'GET', true, null, false, function (require, success, response) {
                                                            if (success) {
                                                                var responseText = Ext.JSON.decode(response.responseText);
                                                                if (responseText.success) {
                                                                    var result = responseText.data;
                                                                    console.log(result);
                                                                    product.setDisabled(false);
                                                                    product.setInitialValue([result.configurableProductId])
                                                                }
                                                            }
                                                            field.ownerCt.unmask();
                                                        })
                                                    } else {
                                                        product.setValue();
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'productgridcombo',
                                            itemId: 'product',
                                            name: 'product',
                                            hidden: true,
                                            disabled: true,
                                            fieldLabel: i18n.getKey('产品'),
                                            allowBlank: false,
                                            displayField: 'name',
                                            valueField: 'id',
                                            productType: 'Configurable',
                                            valueType: 'recordData',
                                            diySetValue: function (data) {
                                                var me = this;
                                                if (data) {
                                                    me.setValue(data);
                                                }
                                            },
                                            diyGetValue: function () {
                                                return this.getArrayValue()?.id;
                                            },
                                            listeners: {
                                                change: function (field, newValue, oldValue) {
                                                    var bomId = field.ownerCt.getComponent('bomConfigId');
                                                    var smuId = field.ownerCt.getComponent('smuId');
                                                    var value = field.getArrayValue();
                                                    if (value) {
                                                        bomId.setDisabled(false);
                                                        smuId.setDisabled(false);
                                                        bomId.store.proxy.url = adminPath + 'api/productConfigBoms/productId';
                                                        window.aimProudctId = value.id;
                                                        bomId.setValue();
                                                    } else {
                                                        bomId.setValue();
                                                        window.aimProudctId = '';
                                                    }
                                                }
                                            }
                                        },
                                        {
                                            xtype: 'gridcombo',
                                            itemId: 'bomConfigId',
                                            name: 'bomConfigId',
                                            allowBlank: false,
                                            fieldLabel: i18n.getKey('Bom配置'),
                                            displayField: 'id',
                                            valueField: 'id',
                                            store: productBomStore,
                                            editable: false,
                                            valueType: 'recordData',
                                            hidden: true,
                                            disabled: true,
                                            matchFieldWidth: false,
                                            filterCfg: {
                                                minHeight: 80,
                                                layout: {
                                                    type: 'column',
                                                    columns: 2
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
                                                        name: 'pageType',
                                                        xtype: 'textfield',
                                                        hideTrigger: true,
                                                        fieldLabel: i18n.getKey('pageType'),
                                                        itemId: 'pageType'
                                                    },
                                                    {
                                                        name: 'productId',
                                                        xtype: 'hiddenfield',
                                                        fieldLabel: i18n.getKey('productId'),
                                                        itemId: 'productId',
                                                        diyGetValue: function () {
                                                            return window.aimProudctId;
                                                        }
                                                    },
                                                    {
                                                        xtype: 'textfield',
                                                        name: 'versionedAttribute._id',
                                                        fieldLabel: i18n.getKey('属性版本编号'),
                                                        itemId: 'versionedAttribute._id',
                                                    }
                                                ]
                                            },
                                            gridCfg: {
                                                store: productBomStore,
                                                height: 350,
                                                width: 800,
                                                columns: [
                                                    {
                                                        text: i18n.getKey('id'),
                                                        dataIndex: 'id',
                                                        itemId: 'id',
                                                        sortable: true,
                                                        width: 100
                                                    },
                                                    {
                                                        text: i18n.getKey('status'),
                                                        dataIndex: 'status',
                                                        itemId: 'status',
                                                        renderer: function (value, metaData, record) {
                                                            var status = {'0': '删除', '1': '草稿', '2': '测试', '3': '上线'};
                                                            return status[value];
                                                        }
                                                    },
                                                    {
                                                        text: i18n.getKey('type'),
                                                        dataIndex: 'type',
                                                        itemId: 'type'
                                                    },
                                                    {
                                                        text: i18n.getKey('configVersion'),
                                                        dataIndex: 'configVersion',
                                                        itemId: 'configVersion',
                                                        renderer: function (value) {
                                                            return '<font color="green">' + value + '</font>'
                                                        }
                                                    },
                                                    {
                                                        text: i18n.getKey('configValue'),
                                                        dataIndex: 'configValue',
                                                        itemId: 'configValue'
                                                    }, {
                                                        text: i18n.getKey('属性版本Id'),
                                                        dataIndex: 'versionedProductAttributeId',
                                                        width: 110,
                                                        itemId: 'versionedProductAttributeId'
                                                    },
                                                ],
                                                bbar: {
                                                    xtype: 'pagingtoolbar',
                                                    store: productBomStore,
                                                }
                                            },
                                            diyGetValue: function () {
                                                return this.getArrayValue()?.id;
                                            },
                                            listeners: {
                                                expand: function () {
                                                    var me = this;
                                                    me.store.load();
                                                },
                                                change: function (field, newValue, oldValue) {
                                                    var value = field.getArrayValue();
                                                    var materialPath = field.ownerCt.getComponent('materialPath');
                                                    materialPath.setDisabled(!value);
                                                    var designConfigId = field.ownerCt.getComponent('designConfigId');
                                                    var mappingConfigId = field.ownerCt.getComponent('mappingConfigId');
                                                    if (value) {
                                                        materialPath.setRootMaterialInfo(value.material._id);
                                                        designConfigId.setDisabled(false);
                                                        mappingConfigId.setDisabled(false);
                                                        var designUrl = adminPath + 'api/productConfigDesigns/bomConfigIds' + `?bomConfigIds=${value.id}`;
                                                        JSAjaxRequest(designUrl, 'GET', true, false, false, function (require, success, response) {
                                                            if (success) {
                                                                var responseText = Ext.JSON.decode(response.responseText);
                                                                if (responseText) {
                                                                    designConfigId.store.proxy.data = responseText.data;
                                                                    designConfigId.store.load();
                                                                }
                                                            }
                                                        });
                                                        var mappingUrl = adminPath + 'api/productConfigMappings/bomConfigIds' + `?bomConfigIds=${value.id}`;
                                                        JSAjaxRequest(mappingUrl, 'GET', true, false, false, function (require, success, response) {
                                                            if (success) {
                                                                var responseText = Ext.JSON.decode(response.responseText);
                                                                if (responseText) {
                                                                    mappingConfigId.store.proxy.data = responseText.data;
                                                                    mappingConfigId.store.load();
                                                                }
                                                            }
                                                        });
                                                    } else {
                                                        designConfigId.setValue();
                                                        mappingConfigId.setValue();
                                                    }
                                                }
                                            },
                                        },
                                        {
                                            xtype: 'gridcombo',
                                            itemId: 'designConfigId',
                                            name: 'designConfigId',
                                            allowBlank: false,
                                            fieldLabel: i18n.getKey('designConfigId'),
                                            displayField: 'id',
                                            valueField: 'id',
                                            editable: false,
                                            hidden: true,
                                            disabled: true,
                                            store: {
                                                xtype: 'store',
                                                proxy: {
                                                    type: 'memory'
                                                },
                                                data: [],
                                                fields: [
                                                    'id', 'status', 'configVersion', 'mappingVersion', 'description', 'bomVersions'
                                                ]
                                            },
                                            matchFieldWidth: false,
                                            gridCfg: {
                                                height: 350,
                                                width: 800,
                                                columns: [
                                                    {
                                                        text: i18n.getKey('id'),
                                                        dataIndex: 'id',
                                                        width: 100
                                                    },
                                                    {
                                                        text: i18n.getKey('status'),
                                                        dataIndex: 'status',
                                                        renderer: function (value, metaData, record) {
                                                            var status = {'0': '删除', '1': '草稿', '2': '测试', '3': '上线'};
                                                            return status[value];
                                                        }
                                                    },
                                                    {
                                                        text: i18n.getKey('configVersion'),
                                                        dataIndex: 'configVersion',
                                                        renderer: function (value) {
                                                            return '<font color="green">' + value + '</font>'
                                                        }
                                                    },
                                                    {
                                                        text: i18n.getKey('material') + i18n.getKey('mappingVersion'),
                                                        dataIndex: 'mappingVersion',
                                                        width: 200,
                                                    },
                                                    {
                                                        text: i18n.getKey('description'),
                                                        width: 200,
                                                        dataIndex: 'description',
                                                    },
                                                    {
                                                        text: i18n.getKey('bomVersions'),
                                                        dataIndex: 'bomCompatibilities',
                                                        xtype: 'arraycolumn',
                                                        minWidth: 200,
                                                        flex: 1,
                                                        sortable: false,
                                                        lineNumber: 5,
                                                    },
                                                ],
                                            },
                                            diyGetValue: function () {
                                                return this.getArrayValue()?.id;
                                            },
                                        },
                                        {
                                            xtype: 'gridcombo',
                                            name: 'mappingConfigId',
                                            itemId: 'mappingConfigId',
                                            allowBlank: false,
                                            haveReset: true,
                                            hidden: true,
                                            disabled: true,
                                            fieldLabel: 'mappingConfigId',
                                            displayField: 'id',
                                            valueField: 'id',
                                            editable: false,
                                            store: {
                                                xtype: 'store',
                                                proxy: {
                                                    type: 'memory'
                                                },
                                                fields: [
                                                    'id', 'status', 'configVersion', 'mappingVersion', 'description', 'bomVersions'
                                                ],
                                                data: [],
                                            },
                                            matchFieldWidth: false,
                                            gridCfg: {
                                                height: 350,
                                                width: 800,
                                                columns: [
                                                    {
                                                        text: i18n.getKey('id'),
                                                        dataIndex: 'id',
                                                        width: 100
                                                    },
                                                    {
                                                        text: i18n.getKey('status'),
                                                        dataIndex: 'status',
                                                        renderer: function (value, metaData, record) {
                                                            var status = {'0': '删除', '1': '草稿', '2': '测试', '3': '上线'};
                                                            return status[value];
                                                        }
                                                    },
                                                    {
                                                        text: i18n.getKey('configVersion'),
                                                        dataIndex: 'configVersion',
                                                        renderer: function (value) {
                                                            return '<font color="green">' + value + '</font>'
                                                        }
                                                    },
                                                    {
                                                        text: i18n.getKey('material') + i18n.getKey('mappingVersion'),
                                                        dataIndex: 'mappingVersion',
                                                        width: 200,
                                                    },
                                                    {
                                                        text: i18n.getKey('description'),
                                                        width: 200,
                                                        dataIndex: 'description',
                                                    },
                                                    {
                                                        text: i18n.getKey('bomVersions'),
                                                        dataIndex: 'bomCompatibilities',
                                                        xtype: 'arraycolumn',
                                                        minWidth: 200,
                                                        flex: 1,
                                                        sortable: false,
                                                        lineNumber: 5,
                                                    },
                                                ],
                                            },
                                            diyGetValue: function () {
                                                return this.getArrayValue()?.id;
                                            },
                                        },
                                        {
                                            xtype: 'sbom_material_selectfield',
                                            name: 'materialPath',
                                            itemId: 'materialPath',
                                            allowBlank: false,
                                            hidden: true,
                                            disabled: true,
                                            width: 450,
                                            rootMaterialId: null,
                                            tipInfo: '物料路径,当前物料在该Bom结构中的位置',
                                            diyGetValue: function () {
                                                var str = this.getValue();
                                                return str.replaceAll('-', ',');
                                            }
                                        },
                                        {
                                            xtype: 'combo',
                                            name: 'smuId',
                                            itemId: 'smuId',
                                            allowBlank: false,
                                            haveReset: true,
                                            hidden: true,
                                            disabled: true,
                                            valueField: 'value',
                                            displayField: 'display',
                                            fieldLabel: 'smuId',
                                            store: {
                                                xtype: 'store',
                                                data: [],
                                                fields: [
                                                    {
                                                        type: 'string', name: 'value'
                                                    }, 'display'
                                                ]
                                            },
                                            tipInfo: 'MMVT所在物料的SMU,产品在跑完物料映射后可获知'
                                        },
                                        {
                                            xtype: 'fieldcontainer',
                                            itemId: 'confirmBtn',
                                            isValid: function () {
                                                return true;
                                            },
                                            importContext: function (data) {
                                                JSSetLoading(true);
                                                setTimeout(function () {
                                                    var win = Ext.getCmp('runValueExpressionWin');
                                                    var objectDataField = win.down('[itemId=objectvaluefield]');
                                                    var propertyModelId = data.propertyModelId;
                                                    var getContext = function (url) {
                                                        //产品上下文里面是属性id，不是sku属性id
                                                        var contextData = {};
                                                        JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
                                                            var str = Ext.util.Cookies.get('propertyModelId');
                                                            var arr = (str ? Ext.JSON.decode(str) : []);
                                                            arr.indexOf(propertyModelId) == -1 ? arr.push(propertyModelId + '') : null;
                                                            Ext.util.Cookies.set('lastUrl', url);
                                                            if (success) {
                                                                CGP.common.condition.RunValueExExpressionWin.lastUrl = url;
                                                                var responseText = Ext.JSON.decode(response.responseText);
                                                                contextData = responseText.data;
                                                            }
                                                        }, true);
                                                        return contextData;
                                                    };
                                                    var contextData = {};
                                                    var productAttributeValues = [];//订单上下文的特殊结构
                                                    if (data.type == 'product') {
                                                        var url = adminPath + 'api/pagecontentschemapreprocessconfig/preprocess/' + propertyModelId + '/context';
                                                        contextData = getContext(url);
                                                    } else if (data.type == 'productAndMaterial') {
                                                        var url = adminPath + 'api/pagecontentschemapreprocessconfig/preprocess/' + propertyModelId + '/context';
                                                        contextData = getContext(url);
                                                        var url2 = adminPath + 'api/materialMvts/calculateContext' +
                                                            '?smuId=' + (data['smuId'] || '') +
                                                            '&propertyModelId=' + (data['propertyModelId'] || '') +
                                                            '&mappingConfigId=' + (data['mappingConfigId'] || '') +
                                                            '&designConfigId=' + (data['designConfigId'] || '') +
                                                            '&materialPath=' + (data['materialPath'] || '') +
                                                            '&needProductInfo=true';
                                                        var contextData2 = getContext(url2);
                                                        contextData.materialAttrs = contextData2?.attrs;
                                                    } else if (data.type == 'order') {

                                                        //获取普通产品上下文，
                                                        var url = adminPath + 'api/pagecontentschemapreprocessconfig/preprocess/' + propertyModelId + '/context';
                                                        contextData = getContext(url);

                                                        //获取propertyModel实例数据
                                                        var propertyModelInfo = null;
                                                        var url = adminPath + 'api/attributeProperty/' + propertyModelId;
                                                        JSAjaxRequest(url, 'GET', false, null, false, function (require, success, response) {
                                                            if (success) {
                                                                var responseText = Ext.JSON.decode(response.responseText);
                                                                if (responseText.success) {
                                                                    propertyModelInfo = responseText.data;
                                                                }
                                                            }
                                                        });

                                                        //获取产品属性列表
                                                        var attributeVersionId = propertyModelInfo.versionedProductAttributeId;
                                                        var productId = propertyModelInfo.configurableProductId;
                                                        var attributeUrl = adminPath + 'api/products/configurable/' + productId + '/attributes' +
                                                            '?attributeVersionId=' + attributeVersionId +
                                                            '&filter=[{"value":' + attributeVersionId + ',"type":"number","name":"versionedAttribute._id"}]';
                                                        var skuAttrInfo = [];
                                                        JSAjaxRequest(attributeUrl, 'GET', false, null, false, function (require, success, response) {
                                                            if (success) {
                                                                var responseText = Ext.JSON.decode(response.responseText);
                                                                if (responseText.success) {
                                                                    skuAttrInfo = responseText.data;
                                                                }
                                                            }
                                                        });
                                                        //重新组产品上下文
                                                        skuAttrInfo.map(function (skuItem) {
                                                            var attributeItem = skuItem.attribute;
                                                            var value = contextData[attributeItem.id];
                                                            if (attributeItem.selectType == 'NON') {
                                                                //输入型
                                                                var attributeValue = value;
                                                                productAttributeValues.push({
                                                                    "clazz": "com.qpp.cgp.domain.dto.orderitem.ComposingOrderLineItemProductAttributeValueDTO",
                                                                    "attributeId": skuItem.attributeId,
                                                                    "attributeInputType": attributeItem.inputType,
                                                                    "attributeName": attributeItem.name,
                                                                    "attributeValue": attributeValue,
                                                                });
                                                            } else {
                                                                //选项型
                                                                var attributeOptionIds = value;
                                                                var options = skuItem.attributeOptions || attributeItem.options;
                                                                var attributeValue = '';
                                                                options.map(function (option) {
                                                                    if (option.id == attributeOptionIds) {
                                                                        attributeValue = option.value;
                                                                    }
                                                                });
                                                                productAttributeValues.push({
                                                                    "clazz": "com.qpp.cgp.domain.dto.orderitem.ComposingOrderLineItemProductAttributeValueDTO",
                                                                    "attributeId": skuItem.attributeId,
                                                                    "attributeInputType": attributeItem.inputType,
                                                                    "attributeName": attributeItem.name,
                                                                    "attributeValue": attributeValue,
                                                                    "attributeOptionIds": attributeOptionIds
                                                                });
                                                            }
                                                        });
                                                        productAttributeValues = productAttributeValues;
                                                    } else {
                                                        var url = adminPath + 'api/materialMvts/calculateContext' +
                                                            '?smuId=' + (data['smuId'] || '') +
                                                            '&propertyModelId=' + (data['propertyModelId'] || '') +
                                                            '&mappingConfigId=' + (data['mappingConfigId'] || '') +
                                                            '&designConfigId=' + (data['designConfigId'] || '') +
                                                            '&materialPath=' + (data['materialPath'] || '') +
                                                            '&needProductInfo=true';
                                                        contextData = getContext(url);
                                                    }
                                                    var displayData = Ext.Object.merge({
                                                        context: contextData,
                                                        params: {},
                                                        materialAttrs: contextData?.materialAttrs || {},
                                                        attrs: contextData?.attrs || {},
                                                    }, {
                                                        context: {
                                                            lineItems: [{
                                                                qty: 0,
                                                                productAttributeValues: productAttributeValues
                                                            }]
                                                        }
                                                    });
                                                    var context = displayData || {};
                                                    objectDataField.setValue(context);
                                                    JSSetLoading(false);
                                                    console.log(displayData);
                                                }, 500);
                                            },
                                            layout: 'hbox',
                                            items: [
                                                {
                                                    xtype: 'button',
                                                    text: '确定导入',
                                                    flex: 1,
                                                    margin: '0 5',
                                                    itemId: 'confirmBtn',
                                                    isValid: function () {
                                                        return true;
                                                    },
                                                    handler: function (btn) {
                                                        var menu = btn.up('[xtype=menu]');
                                                        var win = Ext.getCmp('runValueExpressionWin');
                                                        var lastBtn = btn.ownerCt.getComponent('lastBtn');
                                                        if (menu.isValid()) {
                                                            var data = menu.getValue();
                                                            var fieldContainer = btn.ownerCt;
                                                            fieldContainer.importContext(data);
                                                            Ext.util.Cookies.set("valueExTestData", JSON.stringify(data), null, location.hostname);
                                                            lastBtn.setDisabled(false);
                                                        }
                                                    },
                                                },
                                                {
                                                    xtype: 'tbseparator'
                                                },
                                                {
                                                    xtype: 'button',
                                                    text: '近一次记录',
                                                    flex: 1,
                                                    margin: '0 5',
                                                    itemId: 'lastBtn',
                                                    disabled: true,
                                                    isValid: function () {
                                                        return true;
                                                    },
                                                    handler: function (btn) {
                                                        var fieldContainer = btn.ownerCt;
                                                        var str = Ext.util.Cookies.get('valueExTestData');
                                                        var obj = (str ? Ext.JSON.decode(str) : null);
                                                        if (obj) {
                                                            fieldContainer.importContext(obj);
                                                        }
                                                    },
                                                    listeners: {
                                                        afterrender: function () {
                                                            var lastBtn = this;
                                                            var str = Ext.util.Cookies.get('valueExTestData');
                                                            var obj = (str ? Ext.JSON.decode(str) : null);
                                                            if (obj) {
                                                                lastBtn.setDisabled(false);
                                                            }
                                                        }
                                                    }
                                                },
                                            ]
                                        },
                                    ]
                                },
                                listeners: {
                                    menuhide: function () {
                                        console.log('xxxxxxxxxxxxxxxx');
                                    }
                                }
                            }
                        }]
                    },
                    listeners: {
                        afterrender: function () {
                            this.setValue(Ext.clone(initContext));
                        }
                    }
                }]
            },
            {
                xtype: 'panel',
                title: '<font style="color: green;font-weight: bold">表达式</font>',
                layout: {
                    type: 'fit'
                },
                items: [{
                    xtype: 'expression_textarea',
                    collapsible: true,
                    width: '100%',
                    height: 150,
                    itemId: 'expression_textarea',
                    header: false,
                    region: 'south',
                    split: true,
                    hideCollapseTool: false,
                    labelAlign: 'top',
                    value: valueEx.expression.expression,
                    hideToolbar: {
                        hideEdit: true,
                        hideConfig: false,
                        hideExpression: true,
                        hideTest: true,
                    },
                }]
            }
        ];
        me.bbar = [
            '->',
            {
                xtype: 'button',
                text: i18n.getKey('运行'),
                iconCls: 'icon_agree',
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    var extraContext = win.down('[itemId=objectvaluefield]').getValue();
                    var expression = win.down('[itemId=expression_textarea]').getValue();
                    valueEx.expression.expression = expression;
                    var result = runValueExpression(valueEx.expression, extraContext);
                    if (result.success) {
                        var resultWin = Ext.create('Ext.window.Window', {
                            modal: true,
                            constrain: true,
                            title: i18n.getKey('运行结果'),
                            layout: 'fit',
                            width: 400,
                            height: 400,
                            items: [
                                {
                                    xtype: 'textarea',
                                    value: Ext.isObject(result) ? Ext.JSON.encode(result.data) : result,
                                }
                            ]
                        });
                        resultWin.show();
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function (btn) {
                    var win = btn.ownerCt.ownerCt;
                    win.close();
                }
            }
        ];
        me.callParent(arguments);
    },
    refreshData: function (valueEx) {
        var win = this;
        win.show();
        win.down('[itemId=expression_textarea]').setValue(valueEx.expression.expression);
    }
})