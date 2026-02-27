/**
 * Created by nan on 2019/1/25.
 */
Ext.Loader.syncRequire([
    'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.ValueMapping',
    'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.CalculateValueMapping',
    'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.view.EnableOptionMappingPanel'
]);
Ext.onReady(function () {
    var productId = parseInt(JSGetQueryString('productId'));
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [
            {
                xtype: 'tabpanel',
                itemId: 'containerPanel',
                autoScroll: true,
                items: []
            }
        ]
    });
    var profileStore = Ext.create('CGP.product.view.productattributeprofile.store.ProfileStore', {
        storeId: 'profileStore',//创建一个profileStore用于其他位置引用
        params: {
            filter: Ext.JSON.encode([{
                name: 'productId',
                type: 'number',
                value: productId
            }])
        }
    });
    var ProductAttributeStore = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.store.ProductAttributeStore', {
        storeId: 'productAttributeStore',//创建一个productAttributeStore用于其他位置引用
        productId: productId
    });
    var skuAttributeStore = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.store.ProductAttributeStore', {
        productId: productId,
        listeners: {
            load: function () {
                var containerPanel = page.getComponent('containerPanel');
                var grid = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.SuperSingleMappingGrid', {
                    productId: productId,
                    skuAttributeStore: skuAttributeStore,
                    itemId: 'conditionOneWayValueMapping',
                    filterItem: [
                        {
                            xtype: 'textfield',
                            hidden: true,
                            isLike: false,
                            name: 'clazz',
                            itemId: 'clazz',
                            type: 'string',
                            value: 'com.qpp.cgp.domain.attributemapping.oneway.ConditionOneWayValueMapping'
                        }
                    ],
                    gridtbar: [{
                        xtype: 'button',
                        text: i18n.getKey('add'),
                        iconCls: 'icon_add',
                        handler: function (btn) {
                            var panel = btn.ownerCt.ownerCt;
                            var conditionOneWayValueMappingGrid = panel.items.items[0];
                            var win = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.AdvancedSingleMappingWindow', {
                                productId: productId,
                                createOrEdit: 'create',
                                record: null,
                                skuAttributeStore: skuAttributeStore,
                                grid: conditionOneWayValueMappingGrid
                            });
                            win.show();
                        }
                    }, {
                        xtype: 'button',
                        text: i18n.getKey('refresh'),
                        iconCls: 'icon_refresh',
                        handler: function (btn) {
                            var panel = btn.ownerCt.ownerCt;
                            var grid = panel.items.items[0];
                            grid.store.load();
                        }
                    }],
                    title: '<font>' + i18n.getKey('条件单向属性映射') + '</font>',
                    columns: [
                        {
                            dataIndex: 'executeCondition',
                            tdCls: 'vertical-middle',
                            sortable: false,
                            width: 300,
                            xtype: 'componentcolumn',
                            text: i18n.getKey('映射执行条件'),
                            renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                                var grid = gridView.ownerCt;
                                if ((value.executeAttributeInput && value.executeAttributeInput.operation.operations.length > 0) ||
                                    value.executeProfileItemIds.length > 0 ||
                                    value.executeAttributeInput.conditionType == 'custom') {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<a href="#")>查看执行条件</a>',
                                        listeners: {
                                            render: function (display) {
                                                var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                ela.on("click", function () {
                                                    var controller = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.controller.Controller');
                                                    //controller.checkCondition(value, grid.skuAttributeStore, grid.productId);
                                                    controller.checkConditionV2(value, grid.ownerCt.skuAttributeStore, grid.ownerCt.productId);
                                                });
                                            }
                                        }
                                    };

                                } else {
                                    return {
                                        xtype: 'displayfield',
                                        value: '<font color="green">无条件执行</font>'
                                    };
                                }
                            }
                        },
                        {
                            dataIndex: 'mappingRules',
                            tdCls: 'vertical-middle',
                            sortable: false,
                            minWidth: 200,
                            flex: 1,
                            xtype: 'componentcolumn',
                            text: i18n.getKey('映射规则'),
                            renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                                var grid = gridView.ownerCt;
                                return {
                                    xtype: 'displayfield',
                                    value: '<a href="#")>查看映射规则</a>',
                                    listeners: {
                                        render: function (display) {
                                            var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                            var ela = Ext.fly(a); //获取到a元素的element封装对象
                                            ela.on("click", function () {
                                                var data = value;
                                                var skuAttributeStore = grid.ownerCt.skuAttributeStore;
                                                var dataArr = [];
                                                var productId = grid.ownerCt.productId;
                                                for (var i = 0; i < data.length; i++) {
                                                    var item = data[i];
                                                    var outputs = item.outputs;
                                                    //把同一个属性的property合并成
                                                    var map = {};
                                                    for (var j = 0; j < outputs.length; j++) {
                                                        if (map[outputs[j].propertyPath.skuAttributeId]) {
                                                            map[outputs[j].propertyPath.skuAttributeId].push(outputs[j]);
                                                        } else {
                                                            map[outputs[j].propertyPath.skuAttributeId] = [];
                                                            map[outputs[j].propertyPath.skuAttributeId].push(outputs[j]);
                                                        }
                                                    }
                                                    var newOutPuts = [];
                                                    for (var j in map) {
                                                        var skuAttributeData = skuAttributeStore.findRecord('id', j).getData();
                                                        for (var k = 0; k < map[j].length; k++) {
                                                            map[j][k].skuAttribute = skuAttributeData;
                                                        }
                                                        newOutPuts.push({
                                                            data: map[j],
                                                            skuAttribute: skuAttributeData
                                                        });
                                                    }
                                                    dataArr.push({
                                                        input: data[i].input,
                                                        outputs: newOutPuts
                                                    })
                                                }
                                                console.log(dataArr);
                                                var win = Ext.create('Ext.window.Window', {
                                                    layout: 'fit',
                                                    modal: true,
                                                    constrain: true,
                                                    title: i18n.getKey('查看映射规则'),
                                                    width: 900,
                                                    height: 500,
                                                    items: [
                                                        {
                                                            xtype: 'grid',
                                                            viewConfig: {
                                                                enableTextSelection: true
                                                            },
                                                            store: Ext.create('Ext.data.Store', {
                                                                data: dataArr,
                                                                fields: [
                                                                    {
                                                                        name: 'input',
                                                                        type: 'object'
                                                                    }, {
                                                                        name: 'outputs',
                                                                        type: 'object'
                                                                    }
                                                                ],
                                                                proxy: {
                                                                    type: 'memory'
                                                                }
                                                            }),
                                                            columns: [
                                                                {
                                                                    xtype: 'rownumberer',
                                                                    tdCls: 'vertical-middle'
                                                                },
                                                                {
                                                                    dataIndex: 'input',
                                                                    width: 200,
                                                                    tdCls: 'vertical-middle',
                                                                    xtype: "componentcolumn",
                                                                    text: i18n.getKey('condition'),
                                                                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                                                                        var grid = gridView.ownerCt;
                                                                        console.log(value);
                                                                        if (value && value.conditionType == 'else') {
                                                                            return {
                                                                                xtype: 'displayfield',
                                                                                value: '<font color="red">其他条件都不成立时执行</font>'
                                                                            };

                                                                        } else if (value && (value.operation.operations.length > 0 || value.conditionType == 'custom')) {
                                                                            return {
                                                                                xtype: 'displayfield',
                                                                                value: '<a href="#")>查看执行条件</a>',
                                                                                listeners: {
                                                                                    render: function (display) {
                                                                                        var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                                                                        var ela = Ext.fly(a); //获取到a元素的element封装对象
                                                                                        ela.on("click", function () {
                                                                                            var controller = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.controller.Controller');
                                                                                            controller.checkCondition(value, skuAttributeStore, productId);
                                                                                        });
                                                                                    }
                                                                                }
                                                                            };
                                                                        } else {
                                                                            return {
                                                                                xtype: 'displayfield',
                                                                                value: '<font color="green">无条件执行</font>'
                                                                            };
                                                                        }
                                                                    }
                                                                },
                                                                {
                                                                    text: i18n.getKey('规则'),
                                                                    dataIndex: 'outputs',
                                                                    itemId: 'outputs',
                                                                    flex: 1,
                                                                    tdCls: 'vertical-middle',
                                                                    xtype: 'componentcolumn',
                                                                    renderer: function (value, metadata) {
                                                                        var resultArr = [];
                                                                        console.log(value)
                                                                        for (var i = 0; i < value.length; i++) {
                                                                            var attributeName = value[i].skuAttribute.displayName;
                                                                            var attributeId = value[i].skuAttribute.id;
                                                                            var attributeInputType = value[i].skuAttribute.attribute.selectType;
                                                                            for (var j = 0; j < value[i].data.length; j++) {
                                                                                var item = {
                                                                                    title: null,
                                                                                    value: null
                                                                                };
                                                                                var propertyName = value[i].data[j].propertyPath.propertyName;
                                                                                item.title = attributeName + '<' + attributeId + '>' + '.' + propertyName;
                                                                                if (attributeInputType == 'NON') {//输入
                                                                                    item.value = value[i].data[j].value.value || value[i].data[j].value.calculationExpression;
                                                                                } else {//选项型
                                                                                    var optionIds = value[i].data[j].value.value.split(',');
                                                                                    var options = value[i].skuAttribute.attribute.options;
                                                                                    var optionNameArr = [];
                                                                                    if (propertyName == 'Value') {
                                                                                        if (attributeInputType == 'SINGLE') {
                                                                                            for (var k = 0; k < options.length; k++) {
                                                                                                if (optionIds[0] == options[k].id) {
                                                                                                    item.value = options[k].name;
                                                                                                    break;
                                                                                                }
                                                                                            }
                                                                                        } else {
                                                                                            for (var k = 0; k < optionIds.length; k++) {
                                                                                                for (var o = 0; o < options.length; o++) {
                                                                                                    if (optionIds[k] == options[0].id) {
                                                                                                        optionNameArr.push(options[0].name);
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                            item.value = optionNameArr.toString();
                                                                                        }
                                                                                    } else if (propertyName == 'EnableOption' || propertyName == 'HiddenOption') {
                                                                                        for (var k = 0; k < optionIds.length; k++) {
                                                                                            for (var o = 0; o < options.length; o++) {
                                                                                                if (optionIds[k] == options[0].id) {
                                                                                                    optionNameArr.push(options[0].name);
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                        item.value = optionNameArr.toString();
                                                                                    } else {
                                                                                        item.value = value[i].data[j].value.value;
                                                                                    }
                                                                                }
                                                                                resultArr.push(item);
                                                                            }

                                                                        }
                                                                        console.log(JSCreateHTMLTable(resultArr))
                                                                        return '<div>' + JSCreateHTMLTable(resultArr) + '</div>';
                                                                    }
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                });
                                                win.show();
                                            });
                                        }
                                    }
                                };
                            }
                        }
                    ]
                });
                var grid2 = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.SuperSingleMappingGrid', {

                    productId: productId,
                    itemId: 'oneWaySimpleValueMaping',
                    skuAttributeStore: skuAttributeStore,
                    title: '<font>' + i18n.getKey('固定值单向属性映射') + '</font>',
                    filterItem: [
                        {
                            xtype: 'textfield',
                            hidden: true,
                            isLike: false,
                            name: 'clazz',
                            itemId: 'clazz',
                            type: 'string',
                            value: 'com.qpp.cgp.domain.attributemapping.oneway.OneWaySimpleValueMapping'
                        }
                    ],
                    gridtbar: [{
                        xtype: 'button',
                        text: i18n.getKey('add'),
                        iconCls: 'icon_add',
                        handler: function (btn) {
                            var panel = btn.ownerCt.ownerCt;
                            var oneWaySimpleValueMapingGrid = panel.items.items[0];
                            var controller = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.controller.Controller');
                            controller.addWindow(productId, 'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.ValueMapping', oneWaySimpleValueMapingGrid);
                        }
                    }, {
                        xtype: 'button',
                        text: i18n.getKey('refresh'),
                        iconCls: 'icon_refresh',
                        handler: function (btn) {
                            var panel = btn.ownerCt.ownerCt;
                            var grid = panel.items.items[0];
                            grid.store.load();
                        }
                    }],
                    columns: [
                        {
                            dataIndex: 'inputs',
                            sortable: false,
                            width: 300,
                            tdCls: 'vertical-middle',
                            text: i18n.getKey('input') + i18n.getKey('attribute'),
                            renderer: function (inputs, metadata, record) {
                                var resultStr = [];
                                for (var i = 0; i < inputs.length; i++) {
                                    var skuAttributeRecord = skuAttributeStore.findRecord('id', inputs[i].propertyPath.skuAttributeId);
                                    var skuAttributeData = skuAttributeRecord.getData();
                                    var valueData = null;
                                    if (skuAttributeData.attribute.selectType == 'NON') {//输入类型
                                        if (skuAttributeData.attribute.inputType == 'Date') {
                                            valueData = new Date(parseInt(inputs[i].value.value)).toLocaleString();
                                        } else {
                                            valueData = inputs[i].value.value;
                                        }
                                    } else {
                                        //选项类型
                                        var options = skuAttributeData.attribute.options;
                                        if (skuAttributeData.attribute.selectType == 'SINGLE') {//单选，
                                            valueData = '';
                                            var optionId = inputs[i].value.value;
                                            for (var k = 0; k < options.length; k++) {
                                                if (optionId == options[k].id) {
                                                    valueData = options[k].name;
                                                    break;
                                                }
                                            }
                                        } else {//多选
                                            valueData = [];
                                            var optionIds = inputs[i].value.value.split(',');
                                            for (var j = 0; j < optionIds.length; j++) {
                                                for (var k = 0; k < options.length; k++) {
                                                    if (optionIds[j] == options[k].id) {
                                                        valueData.push(options[k].name);
                                                    }
                                                }
                                            }
                                            valueData = '[' + valueData.toString() + ']';
                                        }
                                    }
                                    resultStr.push({
                                        title: skuAttributeRecord.get('displayName') + '(' + inputs[i].propertyPath.skuAttributeId + ')的属性值为',
                                        value: valueData
                                    })
                                }
                                return JSCreateHTMLTable(resultStr);
                            }
                        },
                        {
                            dataIndex: 'outputs',
                            sortable: false,
                            flex: 1,
                            tdCls: 'vertical-middle',
                            text: i18n.getKey('output') + i18n.getKey('attribute'),
                            renderer: function (outputs, me, record) {
                                var resultStr = [];
                                for (var i = 0; i < outputs.length; i++) {
                                    var skuAttributeRecord = skuAttributeStore.findRecord('id', outputs[i].propertyPath.skuAttributeId);
                                    var skuAttributeData = skuAttributeRecord.getData();
                                    var valueData = null;
                                    if (skuAttributeData.attribute.selectType == 'NON') {//输入类型
                                        valueData = outputs[i].value.value;
                                    } else {
                                        //选项类型
                                        var options = skuAttributeData.attribute.options;
                                        if (skuAttributeData.attribute.selectType == 'SINGLE') {//单选，
                                            valueData = '';
                                            var optionId = outputs[i].value.value;
                                            for (var k = 0; k < options.length; k++) {
                                                if (optionId == options[k].id) {
                                                    valueData = options[k].name;
                                                    break;
                                                }
                                            }
                                        } else {//多选
                                            valueData = [];
                                            var optionIds = outputs[i].value.value.split(',');
                                            for (var j = 0; j < optionIds.length; j++) {
                                                for (var k = 0; k < options.length; k++) {
                                                    if (optionIds[j] == options[k].id) {
                                                        valueData.push(options[k].name);
                                                    }
                                                }
                                            }
                                            valueData = '[' + valueData.toString() + ']';
                                        }
                                    }
                                    resultStr.push({
                                        title: skuAttributeRecord.get('displayName') + '(' + outputs[i].propertyPath.skuAttributeId + ')的属性值为',
                                        value: valueData
                                    })
                                }

                                return JSCreateHTMLTable(resultStr);
                            }
                        }
                    ]
                });
                var grid3 = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.SuperSingleMappingGrid', {
                    store: Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.store.SingleWayProductAttributeMappingStore', {}),
                    itemId: 'oneWaySimpleCalculateValueMaping',
                    productId: productId,
                    skuAttributeStore: skuAttributeStore,
                    title: '<font >' + i18n.getKey('计算值单向属性映射') + '</font>',
                    filterItem: [
                        {
                            xtype: 'textfield',
                            hidden: true,
                            isLike: false,
                            name: 'clazz',
                            itemId: 'clazz',
                            type: 'string',
                            value: 'com.qpp.cgp.domain.attributemapping.oneway.OneWaySimpleCalculateValueMapping'
                        }
                    ],
                    gridtbar: [{
                        xtype: 'button',
                        text: i18n.getKey('add'),
                        iconCls: 'icon_add',
                        handler: function (btn) {
                            var panel = btn.ownerCt.ownerCt;
                            var oneWaySimpleCalculateValueMapingGrid = panel.items.items[0];
                            var controller = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.controller.Controller');
                            controller.addWindow(productId, 'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.CalculateValueMapping', oneWaySimpleCalculateValueMapingGrid);
                        }
                    }, {
                        xtype: 'button',
                        text: i18n.getKey('refresh'),
                        iconCls: 'icon_refresh',
                        handler: function (btn) {
                            var panel = btn.ownerCt.ownerCt;
                            var grid = panel.items.items[0];
                            grid.store.load();
                        }
                    }],
                    columns: [
                        {
                            dataIndex: 'inSkuAttributeIds',
                            sortable: false,
                            tdCls: 'vertical-middle',
                            width: 300,
                            text: i18n.getKey('input') + i18n.getKey('attribute'),
                            renderer: function (value, me, record) {
                                var resultStr = '';
                                for (var i = 0; i < value.length; i++) {
                                    var skuAttributeRecord = skuAttributeStore.findRecord('id', value[i]);
                                    if (i % 2 != 0) {
                                        resultStr += skuAttributeRecord.get('displayName') + '(' + value[i] + ')<br>';
                                    } else {
                                        if (value.length == 1) {
                                            resultStr += skuAttributeRecord.get('displayName') + '(' + value[i] + ')';
                                        } else {
                                            resultStr += skuAttributeRecord.get('displayName') + '(' + value[i] + '),';
                                        }
                                    }
                                }
                                return resultStr;

                            }
                        },
                        {
                            dataIndex: 'outputs',
                            sortable: false,
                            flex: 1,
                            tdCls: 'vertical-middle',
                            text: i18n.getKey('output') + i18n.getKey('attribute'),
                            renderer: function (value, me, record) {
                                var resultStr = '';
                                for (var i = 0; i < value.length; i++) {
                                    var skuAttributeRecord = skuAttributeStore.findRecord('id', value[i].propertyPath.skuAttributeId);
                                    var skuAttributeData = skuAttributeRecord.getData();
                                    resultStr += skuAttributeRecord.get('displayName') + '(' + value[i].propertyPath.skuAttributeId + ')的属性值为： ';
                                    if (skuAttributeData.attribute.inputType == 'Date') {
                                        resultStr += new Date(parseInt(inputs[i].value.value)).toLocaleString() + '<br>';
                                    } else {
                                        resultStr += '<div style=" display:inline;white-space:normal;word-wrap:break-word; overflow:hidden;">' + value[i].value.calculationExpression + '</div><br>';
                                    }
                                }
                                return resultStr;
                            }
                        }
                    ]
                });
                var calculateConditionGrid = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.SuperSingleMappingGrid', {
                    store: Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.store.SingleWayProductAttributeMappingStore', {}),
                    itemId: 'calculateConditionGrid',
                    productId: productId,
                    skuAttributeStore: skuAttributeStore,
                    title: '<font >' + i18n.getKey('自定义属性计算值映射') + '</font>',
                    filterItem: [
                        {
                            xtype: 'textfield',
                            hidden: true,
                            isLike: false,
                            name: 'clazz',
                            itemId: 'clazz',
                            type: 'string',
                            value: 'com.qpp.cgp.domain.attributemapping.oneway.OneWaySimpleCalculateValueConditionMapping'
                        }
                    ],
                    gridtbar: [{
                        xtype: 'button',
                        text: i18n.getKey('add'),
                        iconCls: 'icon_add',
                        handler: function (btn) {
                            var panel = btn.ownerCt.ownerCt;
                            var oneWaySimpleCalculateValueMapingGrid = panel.items.items[0];
                            var controller = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.controller.Controller');
                            controller.addWindow(productId, 'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.calculatevaluecondition.Edit', oneWaySimpleCalculateValueMapingGrid);
                        }
                    }, {
                        xtype: 'button',
                        text: i18n.getKey('refresh'),
                        iconCls: 'icon_refresh',
                        handler: function (btn) {
                            var panel = btn.ownerCt.ownerCt;
                            var grid = panel.items.items[0];
                            grid.store.load();
                        }
                    }],
                    columns: [
//                        {
//                            dataIndex: 'inSkuAttributeIds',
//                            sortable: false,
//                            tdCls: 'vertical-middle',
//                            width: 300,
//                            text: i18n.getKey('input') + i18n.getKey('attribute'),
//                            renderer: function (value, me, record) {
//                                var resultStr = '';
//                                for (var i = 0; i < value.length; i++) {
//                                    var skuAttributeRecord = skuAttributeStore.findRecord('id', value[i]);
//                                    if (i % 2 != 0) {
//                                        resultStr += skuAttributeRecord.get('displayName') + '(' + value[i] + ')<br>';
//                                    } else {
//                                        if (value.length == 1) {
//                                            resultStr += skuAttributeRecord.get('displayName') + '(' + value[i] + ')';
//                                        } else {
//                                            resultStr += skuAttributeRecord.get('displayName') + '(' + value[i] + '),';
//                                        }
//                                    }
//                                }
//                                return resultStr;
//
//                            }
//                        },
                        {
                            text: i18n.getKey('inputKeys'),
                            dataIndex: 'inputGroups',
                            xtype: 'gridcolumn',
                            itemId: 'inputGroups',
                            width: 150,
                            renderer: function (value, metadata, record) {
                                var inputKeys=[];
                                Ext.Array.each(value,function(el){
                                    inputKeys=Ext.Array.merge(inputKeys,el["inputKeys"]);
                                });
                                var val=Ext.Array.map(inputKeys,function(el){
                                    return el.name;
                                });
                                metadata.tdAttr = 'data-qtip="' + val.join(',') + '"';
                                return val.join(',');
                            }
                        },
                        {
                            dataIndex: 'outputs',
                            sortable: false,
                            flex: 1,
                            tdCls: 'vertical-middle',
                            text: i18n.getKey('output') + i18n.getKey('attribute'),
                            renderer: function (value, me, record) {
                                var resultStr = '';
                                for (var i = 0; i < value.length; i++) {
                                    var skuAttributeRecord = skuAttributeStore.findRecord('id', value[i].propertyPath.skuAttributeId);
                                    var skuAttributeData = skuAttributeRecord.getData();
                                    resultStr += skuAttributeRecord.get('displayName') + '(' + value[i].propertyPath.skuAttributeId + ')的属性值为： ';
                                    if (skuAttributeData.attribute.inputType == 'Date') {
                                        resultStr += new Date(parseInt(inputs[i].value.value)).toLocaleString() + '<br>';
                                    } else {
                                        resultStr += '<div style=" display:inline;white-space:normal;word-wrap:break-word; overflow:hidden;">' + value[i].value.calculationExpression + '</div><br>';
                                    }
                                }
                                return resultStr;
                            }
                        }
                    ]
                });
                var enableOptionTab = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.multidiscreteattributeenableoptionmapping.view.EnableOptionMappingPanel', {
                    productId: productId,
                    skuAttributeStore: skuAttributeStore
                });
                containerPanel.add([grid, grid2, grid3,calculateConditionGrid, enableOptionTab]);
                /*
                                containerPanel.setActiveTab(grid2);
                */
            }
        }
    });
})
