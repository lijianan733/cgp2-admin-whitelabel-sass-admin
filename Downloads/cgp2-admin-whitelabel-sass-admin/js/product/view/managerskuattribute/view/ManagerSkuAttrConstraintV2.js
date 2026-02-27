/**
 * Created by nan on 2019/11/5.
 */
Ext.define('CGP.product.view.managerskuattribute.view.ManagerSkuAttrConstraintV2', {
    extend: 'Ext.grid.Panel',
    store: null,
    skuAttributeId: null,
    productId: null,
    viewConfig: {
        enableTextSelection: true,
        stripeRows: true
    },
    closable: true,
    inputTypeClazz: null,
    skuAttributeStore: null,
    skuAttribute: null,
    controller: Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.controller.Controller'),
    features: [
        {
            ftype: 'grouping',
            groupHeaderTpl: [
                ' {name:this.isSku}',
                {
                    isSku: function (name) {
                        console.log(name)
                        if (name == 'com.qpp.cgp.domain.attributeconstraint.single.CalculateContinuousFixValueConstraint') {
                            return '范围约束（固定值）'
                        } else if (name == 'com.qpp.cgp.domain.attributeconstraint.single.CalculateContinuousAttributeValueConstraint') {
                            return '范围约束(受其他属性影响)'
                        } else if (name == 'com.qpp.cgp.domain.attributeconstraint.single.CalculateExpressionValueConstraint') {
                            return '范围约束(计算公式)'
                        } else if (name == 'com.qpp.cgp.domain.attributeconstraint.single.SingleAttributeDiscreteValueConstraint') {
                            return '选项值约束'
                        }
                    }
                }
            ]
        }
    ],
    initComponent: function () {
        var me = this;
        var productId = me.productId;
        var isLock = JSCheckProductIsLock(productId);
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
        me.inputTypeClazz = (Ext.Array.contains(['DropList', 'CheckBox', 'RadioButtons', 'Color'], me.inputType)) ? 'DiscreteValueConstraint' : 'ContinuousValueConstraint';
        me.title = me.skuAttribute.displayName + '(' + me.skuAttributeId + ')' + 'SKU属性约束';
        var skuAttributeId = me.skuAttributeId;
        me.store = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.store.CalculateContinuousConstraintStore', {
            groupField: 'clazz',
            params: {
                filter: Ext.JSON.encode([{
                    name: 'skuAttributeId',
                    type: 'number',
                    value: me.skuAttributeId
                }])
            }
        });
        me.tbar = [
            {
                xtype: 'splitbutton',//连续值的添加约束按钮
                text: i18n.getKey('add'),
                iconCls: 'icon_add',
                hidden: me.inputTypeClazz != 'ContinuousValueConstraint',
                handler: function (btn) {
                    var grid = me;
                    var win = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.CalculateContinuousFixValueConstraintWindow', {
                        productId: productId,
                        createOrEdit: 'create',
                        record: null,
                        grid: grid,
                        skuAttributeId: skuAttributeId
                    });
                    win.show();
                },
                menu: new Ext.menu.Menu({
                    items: [
                        {
                            text: i18n.getKey('添加范围约束(固定值)'),
                            handler: function () {
                                var grid = me;
                                var win = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.CalculateContinuousFixValueConstraintWindow', {
                                    productId: productId,
                                    createOrEdit: 'create',
                                    record: null,
                                    grid: grid,
                                    skuAttribute: grid.skuAttribute,
                                    skuAttributeId: skuAttributeId
                                });
                                win.show();
                            }
                        },
                        {
                            text: i18n.getKey('添加范围约束(受其他属性影响)'),
                            handler: function () {
                                var grid = me;
                                var win = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.CalculateContinuousAttributeValueConstraintWindow', {
                                    productId: productId,
                                    createOrEdit: 'create',
                                    record: null,
                                    grid: grid,
                                    skuAttribute: grid.skuAttribute,
                                    skuAttributeId: skuAttributeId
                                });
                                win.show();
                            }
                        }, {
                            text: i18n.getKey('添加范围约束(计算公式)'),
                            handler: function () {
                                var grid = me;
                                var win = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.CalculateExpressionValueConstraintWindow', {
                                    productId: productId,
                                    createOrEdit: 'create',
                                    record: null,
                                    grid: grid,
                                    skuAttribute: grid.skuAttribute,
                                    skuAttributeId: skuAttributeId
                                });
                                win.show();
                            }
                        }
                    ]

                })
            },
            {
                //选项值的添加约束按钮
                xtype: 'button',
                text: '添加选项约束',
                hidden: me.inputTypeClazz != 'DiscreteValueConstraint',
                handler: function (btn) {
                    var grid = me;
                    var win = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.SingleAttributeDiscreteValueConstraintWindow', {
                        productId: productId,
                        createOrEdit: 'create',
                        record: null,
                        grid: grid,
                        skuAttribute: grid.skuAttribute,
                        skuAttributeId: skuAttributeId
                    });
                    win.show();
                }
            }
        ];
        me.columns = [
            {
                xtype: 'rownumberer',
                sortable: false,
                tdCls: 'vertical-middle'
            },
            {
                xtype: 'actioncolumn',
                width: 50,
                tdCls: 'vertical-middle',
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',  // Use a URL in the icon config
                        tooltip: 'Edit',
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var win = null;
                            var grid = view.ownerCt;
                            if (record.get('clazz') == 'com.qpp.cgp.domain.attributeconstraint.single.CalculateContinuousFixValueConstraint') {
                                win = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.CalculateContinuousFixValueConstraintWindow', {
                                    productId: productId,
                                    createOrEdit: 'edit',
                                    record: record,
                                    grid: grid,
                                    isLock:isLock,
                                    skuAttribute: grid.skuAttribute,
                                    skuAttributeId: skuAttributeId
                                });
                            } else if (record.get('clazz') == 'com.qpp.cgp.domain.attributeconstraint.single.CalculateContinuousAttributeValueConstraint') {
                                win = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.CalculateContinuousAttributeValueConstraintWindow', {
                                    productId: productId,
                                    createOrEdit: 'edit',
                                    record: record,
                                    grid: grid,
                                    isLock:isLock,
                                    skuAttribute: grid.skuAttribute,
                                    skuAttributeId: skuAttributeId
                                });
                            } else if (record.get('clazz') == 'com.qpp.cgp.domain.attributeconstraint.single.SingleAttributeDiscreteValueConstraint') {
                                win = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.SingleAttributeDiscreteValueConstraintWindow', {
                                    productId: productId,
                                    createOrEdit: 'edit',
                                    record: record,
                                    grid: grid,
                                    isLock:isLock,
                                    skuAttribute: grid.skuAttribute,
                                    skuAttributeId: skuAttributeId
                                });
                            } else if (record.get('clazz') == 'com.qpp.cgp.domain.attributeconstraint.single.CalculateExpressionValueConstraint') {
                                win = Ext.create('CGP.product.view.managerskuattribute.skuattributeconstrainterversion2.view.CalculateExpressionValueConstraintWindow', {
                                    productId: productId,
                                    createOrEdit: 'edit',
                                    record: record,
                                    grid: grid,
                                    isLock:isLock,
                                    skuAttribute: grid.skuAttribute,
                                    skuAttributeId: skuAttributeId
                                });
                            }
                            win.show();
                            win.refreshData(record.getData());
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        tooltip: 'Delete',
                        handler: function (view, rowIndex, colIndex, a, b, record) {
                            var grid = view.ownerCt;
                            Ext.Msg.confirm('提示', '确定删除？', callback);

                            function callback(id) {
                                if (id === 'yes') {
                                    grid.controller.deleteCalculateContinuousConstraint(record, grid);
                                }
                            }
                        }
                    }
                ]
            },
            {
                dataIndex: '_id',
                tdCls: 'vertical-middle',
                sortable: false,
                text: i18n.getKey('id')
            }, {
                dataIndex: 'attributeConstraintDomain',
                tdCls: 'vertical-middle',
                sortable: false,
                text: i18n.getKey('domain') + i18n.getKey('id'),
                renderer: function (value) {
                    return value._id
                }
            },
            {
                dataIndex: 'executeCondition',
                tdCls: 'vertical-middle',
                sortable: false,
                xtype: 'componentcolumn',
                text: i18n.getKey('executeCondition'),
                renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
                    console.log(value);
                    var grid = gridView.ownerCt;
                    if (value.executeAttributeInput && (value.executeAttributeInput.operation.operations.length > 0 || value.executeAttributeInput.conditionType == 'custom')) {
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>查看条件</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        var controller = Ext.create('CGP.product.view.singlewayattributepropertyrelevanceconfigversion2.controller.Controller');
                                        controller.checkConditionV2(value, grid.skuAttributeStore, grid.productId);
                                    });
                                }
                            }
                        };
                    } else {
                        return null
                    }
                }
            }, {
                dataIndex: 'description',
                tdCls: 'vertical-middle',
                width: 250,
                sortable: false,
                text: i18n.getKey('description')
            }, {
                dataIndex: 'promptTemplate',
                sortable: false,
                hidden: me.inputTypeClazz == 'DiscreteValueConstraint',//选项型没有提示模板
                width: 250,
                text: i18n.getKey('promptTemplate')
            }, {
                dataIndex: 'operator',
                tdCls: 'vertical-middle',
                sortable: false,
                flex: 1,
                xtype: 'componentcolumn',
                text: i18n.getKey('constraints'),
                renderer: function (value, metaData, record, rowIndex, colIndex, data, gridView) {
                    var result = null;
                    var grid = gridView.ownerCt;
                    var skuAttributeStore = grid.skuAttributeStore;
                    var data = record.getData();
                    var clazz = data.clazz;
                    var minValue = null;
                    var maxValue = null;
                    if (clazz == 'com.qpp.cgp.domain.attributeconstraint.single.SingleAttributeDiscreteValueConstraint') {
                        var isInclude = data.isInclude;
                        var optionNames = [];
                        var attributeOptions = grid.skuAttribute.attribute.options;
                        var optionIds = data.optionValues.split(',');
                        optionIds = optionIds.map(function (item) {
                            return parseInt(item);
                        });
                        for (var i = 0; i < optionIds.length; i++) {
                            for (var j = 0; j < attributeOptions.length; j++) {
                                if (optionIds[i] == attributeOptions[j].id) {
                                    optionNames.push(attributeOptions[j].name);
                                }
                            }
                        }
                        if (isInclude) {
                            return '该属性的值<font color="green">只能</font>选择如下选项：' + optionNames
                        } else {
                            return '该属性的值<font color="red">不能</font>选择如下选项：' + optionNames

                        }
                    } else {
                        if (clazz == 'com.qpp.cgp.domain.attributeconstraint.single.CalculateContinuousFixValueConstraint') {
                            minValue = data.minValue;
                            maxValue = data.maxValue;
                        } else if (clazz == 'com.qpp.cgp.domain.attributeconstraint.single.CalculateExpressionValueConstraint') {
                            minValue = data.minExpression;
                            maxValue = data.maxExpression;
                        } else if (clazz == 'com.qpp.cgp.domain.attributeconstraint.single.CalculateContinuousAttributeValueConstraint') {
                            var minSkuAttribute = skuAttributeStore.findRecord('id', data.minSkuAttributeId);
                            minValue = minSkuAttribute.getData().displayName + '的属性值';
                            if (data.maxSkuAttributeId) {
                                var maxSkuAttribute = skuAttributeStore.findRecord('id', data.maxSkuAttributeId);
                                maxValue = maxSkuAttribute.getData().displayName + '的属性值'
                            }
                        }
                        if (value == '[min,max]') {
                            result = minValue + ' <= ' + '该属性值' + ' <= ' + maxValue
                        } else if (value == '[min,max)') {
                            result = minValue + ' <= ' + '该属性值' + ' < ' + maxValue

                        } else if (value == '(min,max]') {
                            result = minValue + ' < ' + '该属性值' + ' <= ' + maxValue

                        } else if (value == '(min,max)') {
                            result = minValue + ' < ' + '该属性值' + ' < ' + maxValue

                        } else if (value == '==') {
                            result = '该属性值' + ' ' + '=' + ' ' + minValue
                        } else {
                            result = '该属性值' + ' ' + value + ' ' + minValue
                        }
                    }
                    return result;
                }
            }
        ];
        me.bbar = Ext.create('Ext.PagingToolbar', {//底端的分页栏
            store: me.store,
            displayInfo: true, // 是否 ? 示， 分 ? 信息
            displayMsg: 'Displaying {0} - {1} of {2}', //?示的分?信息
            emptyMsg: i18n.getKey('noData')
        });
        me.callParent();
        me.on('afterrender', function () {
            var page = this;
            var productId = page.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    }

})
