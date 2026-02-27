/**
 * Created by nan on 2019/10/25.
 * 单向属性映射中，规则列表的fieldSet
 * "规则列表"
 */
Ext.define('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.MappingRuleGridFieldSet', {
    extend: 'CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.DiyFieldSet',
    productId: null,
    layout: 'fit',
    checkOnly: false,//是否只能查看
    skuAttributeStore: null,
    isValid: function () {
        var me = this;
        var grid = me.items.items[0];
        if (grid.store.getCount() > 0) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 将数据组合成要求的格式
     * @returns {*}
     */
    getValue: function () {
        var me = this;
        var grid = me.items.items[0];
        for (var i = 0; i < grid.store.proxy.data.length; i++) {
            var attributeMappingRuleItem = grid.store.proxy.data[i];
            var outputs = [];
            for (var j = 0; j < attributeMappingRuleItem.outputs.length; j++) {
                outputs = outputs.concat(attributeMappingRuleItem.outputs[j].data);
            }
            attributeMappingRuleItem.outputs = outputs;
        }
        console.log(grid.store.proxy.data);
        return grid.store.proxy.data;
    },
    /**
     * 将数据组合成要求的格式
     * @param data
     */
    setValue: function (data) {
        var me = this;
        var skuAttributeStore = me.skuAttributeStore;
        var grid = me.items.items[0];
        var dataArr = [];
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
            var newOutPuts = [];//处理outputs
            for (var j in map) {
                var skuAttributeData = skuAttributeStore.findRecord('id', j).getData();
                for (var k = 0; k < map[j].length; k++) {
                    map[j][k].skuAttribute = skuAttributeData;
                    map[j][k].propertyPath.skuAttribute = skuAttributeData;
                }
                newOutPuts.push({
                    data: map[j],
                    skuAttribute: skuAttributeData
                });
            }
            //处理inputs
            if (data[i].input && data[i].input.conditionType != 'else') {
                var operations = data[i].input.operation.operations;
                for (var j = 0; j < operations.length; j++) {
                    var operator = operations[j].operator;
                    if (operations[j].operationType == 'simple') {
                        if (Ext.Array.contains(['[min,max]', '[min,max)', '(min,max)', '(min,max]'], operator)) {//区间类型
                            var skuAttributeData = skuAttributeStore.findRecord('id', operations[j].midValue.skuAttributeId).getData();
                            operations[j].midValue.skuAttribute = skuAttributeData;
                        } else {//普通比较类型
                            var skuAttributeData = skuAttributeStore.findRecord('id', operations[j].operations[0].skuAttributeId).getData();
                            operations[j].operations[0].skuAttribute = skuAttributeData;
                        }
                    }
                }
            }
            dataArr.push({
                input: data[i].input,
                outputs: newOutPuts,
                description: item.description
            })
        }
        console.log(dataArr);
        grid.store.proxy.data = dataArr;
        grid.store.load();
    },
    initComponent: function () {
        var me = this;
        var store = Ext.create('Ext.data.Store', {
            fields: [
                {
                    name: 'input',
                    type: 'object'
                }, {
                    name: 'outputs',
                    type: 'object'
                },
                {
                    name: 'description',
                    type: 'string'
                }
            ],
            proxy: {
                type: 'memory'
            },
            data: []
        });
        me.items = [
            {
                xtype: 'grid',
                store: store,
                width: 600,
                maxHeight: 350,
                margin: '20 20 20 20',
                viewConfig: {
                    enableTextSelection: true
                },
                elseConditionRuleRecord: null,//使用了else类型条件的规则
                tbar: {
                    hidden: me.checkOnly == true,
                    items: [
                        {
                            xtype: 'button',
                            text: i18n.getKey('add'),
                            iconCls: 'icon_add',
                            handler: function (btn) {
                                var grid = btn.ownerCt.ownerCt;
                                var fieldSet = grid.ownerCt;
                                var outSkuAttributes = fieldSet.ownerCt.items.items[1].getComponent('outSkuAttributeIds').getValue();//输出属性
                                var inSkuAttributeIds = fieldSet.ownerCt.items.items[1].getComponent('inSkuAttributeIds').getValue();//输入属性
                                if (Object.keys(outSkuAttributes).length > 0 && Object.keys(outSkuAttributes).length > 0) {//被影响属性有值
                                    var isCanAddOrDelete = true;
                                    if (grid.store.getCount() >= 1) {
                                        isCanAddOrDelete = false;
                                        outSkuAttributes = null;
                                    }
                                    var record = null;
                                    if (grid.store.getCount() >= 1) {//grid中对多于1条记录时，以第一条记录为模板，创建其他记录
                                        var templateData = Ext.JSON.decode(Ext.JSON.encode(grid.store.data.items[0].getData()));//序列化和反序列化使生成一个全新的对象
                                        var newRecord = new grid.store.model(templateData);
                                        newRecord.set('description', null);
                                        newRecord.set('input', null);
                                        if (templateData && templateData.outputs) {
                                            for (var i = 0; i < templateData.outputs.length; i++) {
                                                var item = templateData.outputs[i];
                                                for (var j = 0; j < item.data.length; j++) {
                                                    item.data[j].value = {
                                                        clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                                                        value: null
                                                    };
                                                }
                                            }
                                            newRecord.set('outputs', templateData.outputs);
                                        }
                                        record = newRecord;
                                    }
                                    var window = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.EditMappingRuleWindow', {
                                        grid: grid,
                                        createOrEdit: 'create',
                                        rightAttributes: outSkuAttributes,
                                        isCanAddOrDelete: isCanAddOrDelete,
                                        leftAttributes: inSkuAttributeIds,
                                        productId: fieldSet.productId,
                                        record: record
                                    }).show();

                                } else {
                                    Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('必须先确定被影响属性,再设置属性规则'));
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('clear'),
                            iconCls: 'icon_clear',
                            handler: function (btn) {
                                var grid = btn.ownerCt.ownerCt;
                                grid.store.proxy.data = [];
                                grid.store.removeAll();
                            }
                        }
                    ]
                },
                columns: [
                    {
                        xtype: 'actioncolumn',
                        width: 50,
                        hidden: me.checkOnly == true,
                        tdCls: 'vertical-middle',
                        items: [
                            {
                                iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                                tooltip: 'Edit',
                                handler: function (gridView, rowIndex, colIndex, a, b, record) {
                                    var grid = gridView.ownerCt;
                                    var fieldSet = grid.ownerCt;
                                    var inSkuAttributeIds = fieldSet.ownerCt.items.items[1].getComponent('inSkuAttributeIds').getValue();//输入属性
                                    //当grid中多于1条数据时，constarintOfAttributePropertyFieldSet不能新建和修改已有property
                                    var isCanAddOrDelete = grid.store.getCount() > 1 ? false : true;
                                    var window = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.view.EditMappingRuleWindow', {
                                        grid: grid,
                                        createOrEdit: 'edit',
                                        record: record,
                                        isCanAddOrDelete: isCanAddOrDelete,
                                        rightAttributes: null,
                                        leftAttributes: inSkuAttributeIds,
                                        productId: fieldSet.productId
                                    }).show();
                                }
                            },
                            {
                                iconCls: 'icon_remove icon_margin',
                                tooltip: 'Delete',
                                handler: function (view, rowIndex, colIndex, a, b, record) {
                                    var store = view.getStore();
                                    var constraintId = record.getId();
                                    Ext.Msg.confirm('提示', '确定删除？', callback);

                                    function callback(id) {
                                        if (id === 'yes') {
                                            store.proxy.data.splice(rowIndex, 1);
                                            store.load();
                                        }
                                    }
                                }
                            }
                        ]
                    },
                    {
                        xtype: 'rownumberer',
                        tdCls: 'vertical-middle'
                    },
                    {
                        dataIndex: 'description',
                        width: 200,
                        tdCls: 'vertical-middle',
                        text: i18n.getKey('description'),
                        renderer: function (value, metadata) {
                            metadata.tdAttr = 'data-qtip="' + value + '"';
                            return value;
                        }
                    },
                    {
                        dataIndex: 'input',
                        width: 200,
                        tdCls: 'vertical-middle',
                        xtype: "componentcolumn",
                        text: i18n.getKey('condition'),
                        renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                            var grid = gridView.ownerCt;
                            var fieldSet = grid.ownerCt;
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
                                                controller.checkCondition(value, fieldSet.skuAttributeStore, fieldSet.productId);

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
                        text: i18n.getKey('被影响属性property'),
                        dataIndex: 'outputs',
                        itemId: 'outputs',
                        flex: 1,
                        tdCls: 'vertical-middle',
                        xtype: 'componentcolumn',
                        renderer: function (value, metadata) {
                            var resultArr = [];
                            for (var i = 0; i < value.length; i++) {
                                var item = {
                                    title: null,
                                    value: null
                                };
                                var attributeName = value[i].skuAttribute.displayName;
                                var attributeId = value[i].skuAttribute.id;
                                item.title = attributeName + '<' + attributeId + '>';
                                var propertyArr = [];
                                for (var j = 0; j < value[i].data.length; j++) {
                                    propertyArr.push(value[i].data[j].propertyPath.propertyName);
                                }
                                item.value = '[' + propertyArr.toString() + ']';
                                resultArr.push(item);
                            }
                            console.log(JSCreateHTMLTable(resultArr))
                            return '<div>' + JSCreateHTMLTable(resultArr) + '</div>';
                        }
                    }
                ]
            }
        ];
        me.callParent();
    }
})
