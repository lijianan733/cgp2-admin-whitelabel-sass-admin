/**
 * Created by nan on 2021/10/25
 */
Ext.Loader.setPath({
    "CGP.virtualcotainerobject": path + 'partials/virtualcotainerobject/app'
});
Ext.Loader.syncRequire([
    'CGP.virtualcontainertype.view.condition.OutPanel',
    'CGP.common.field.RtTypeSelectField'

]);
Ext.define('CGP.virtualcontainertype.view.ScopeFunField', {
    extend: "Ext.ux.form.field.UxFieldSet",
    alias: 'widget.scopefunfield',
    rtTypeId: null,
    border: '1 1 0 1',
    title: "<font style= 'font-size:15px;color:green;font-weight: bold'>" + i18n.getKey('scopeFunc') + '</font>',
    legendItemConfig: {
        disabledBtn: {
            hidden: false,
            disabled: false,
            isUsable: false,//初始化时，是否是禁用

        },
        deleteBtn: {
            hidden: true,
            disabled: false
        },
        tipInfoBtn: {
            tooltip: '对' + i18n.getKey('argumentType') + '进一步处理<br>' +
                ' 如：程序需要一个新的属性面积,<br>' +
                '然而旧的' + i18n.getKey('argumentType') + '上只有宽和高属性,<br>' +
                '这时就可以通过该配置指定面积属性的值为宽*高',
            hidden: false,
        }
    },
    defaults: {
        margin: '5 0 5 40',
        width: 450,
    },
    diySetValue: function (data) {
        var me = this;
        if (Ext.isEmpty(data) && Ext.Object.isEmpty(data)) {
            data = {};
        } else {
            if (me.legend) {//对用该功能按钮的设置值控制
                if (me.legend.rendered) {
                    var disabledBtn = me.legend.getComponent('disabledBtn');
                    if (disabledBtn.hidden == false) {//有该功能
                        disabledBtn.count = 1;
                        disabledBtn.handler();
                    }
                } else {
                    me.legend.on('afterrender', function () {
                        var disabledBtn = me.legend.getComponent('disabledBtn');
                        if (disabledBtn.hidden == false) {//有该功能
                            disabledBtn.count = 1;
                            disabledBtn.handler();
                        }
                    })
                }
            }
            var keyValues = me.getComponent('keyValues');
            var valueEx = me.getComponent('valueEx');
            var scopeType = me.getComponent('scopeType');
            var clazz = me.getComponent('clazz');
            clazz.setValue(data['clazz']);
            scopeType.diySetValue(data['scopeType']);
            if (data.clazz == 'com.qpp.cgp.domain.pcresource.virtualcontainer.KeyValueScopeFunc') {
                keyValues.setValue(data.mappingRules);
                valueEx.hide();
                valueEx.setDisabled(true);
                keyValues.show();
                keyValues.setDisabled(false);
            } else if (data.clazz == 'com.qpp.cgp.domain.pcresource.virtualcontainer.ValueExScopeFunc') {
                valueEx.setValue(data.valueEx);
                keyValues.hide();
                keyValues.setDisabled(true);
                valueEx.show();
                valueEx.setDisabled(false);
            }
        }
    },
    diyGetValue: function () {
        var me = this;
        var data = me.getValue();
        if (me.getState() == true) {
            if (data.valueEx) {
                data.clazz = 'com.qpp.cgp.domain.pcresource.virtualcontainer.ValueExScopeFunc';
                return data;
            } else if (data.keyValues) {
                data.mappingRules = data.keyValues;
                data.keyValues = me.buildKeyValues(Ext.clone(data.mappingRules));
                data.clazz = 'com.qpp.cgp.domain.pcresource.virtualcontainer.KeyValueScopeFunc';
                return data;
            }
        }
    },
    /**
     * 根据mappingRules转换出keyValues
     * @param mappingRules
     */
    buildKeyValues: function (mappingRules) {
        var result = [];
        var conditionController = Ext.create('CGP.common.condition.controller.Controller');
        conditionController.contentAttributeStore = Ext.StoreManager.get('contentAttributeStore');
        for (var i = 0; i < mappingRules.length; i++) {
            var item = mappingRules[i];
            var domain = conditionController.builderExpression(item.mappingRules);
            result.push({
                key: item.key,
                value: {
                    clazz: 'com.qpp.cgp.domain.pcresource.virtualcontainer.ExpressionValue',
                    valueEx: domain
                }
            })
        }
        return result;
    },
    initComponent: function () {
        var me = this;
        me.contentAttributeStore = Ext.create('Ext.data.Store', {
            storeId: 'skuAttributeStore',
            fields: [
                {
                    name: 'key',
                    type: 'string'
                },
                {
                    name: 'type',
                    type: 'string'
                },
                {
                    name: 'valueType',
                    type: 'string'
                },
                {
                    name: 'selectType',
                    type: 'string'
                },
                {
                    name: 'attrOptions',
                    type: 'array'
                },
                {
                    name: 'required',
                    type: 'string'
                },
                {
                    name: 'attributeInfo',
                    type: 'string'
                },
                {
                    name: 'path',
                    type: 'string'
                },
                {
                    name: 'displayName',
                    type: 'string'
                }
            ],
            data: [],
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    idProperty: 'key'
                }
            }
        });
        me.items = [
            {
                xtype: 'combo',
                fieldLabel: i18n.getKey('配置方式'),
                name: 'clazz',
                itemId: 'clazz',
                editable: false,
                value: 'com.qpp.cgp.domain.pcresource.virtualcontainer.KeyValueScopeFunc',
                store: {
                    xtype: 'store',
                    fields: ['value', 'display'],
                    data: [
                        {display: '自定义配置', value: 'com.qpp.cgp.domain.pcresource.virtualcontainer.ValueExScopeFunc'},
                        {display: '界面配置', value: 'com.qpp.cgp.domain.pcresource.virtualcontainer.KeyValueScopeFunc'}
                    ]
                },
                displayField: 'display',
                valueField: 'value',
                listeners: {
                    change: function (button, newValue, oldValue) {
                        var fieldContainer = button.ownerCt;
                        fieldContainer.suspendLayouts();
                        var keyValues = fieldContainer.getComponent('keyValues');
                        var valueEx = fieldContainer.getComponent('valueEx');
                        var isValueEx = (newValue == 'com.qpp.cgp.domain.pcresource.virtualcontainer.ValueExScopeFunc');
                        keyValues.setVisible(!isValueEx);
                        keyValues.setDisabled(isValueEx);
                        valueEx.setVisible(isValueEx);
                        valueEx.setDisabled(!isValueEx);
                        fieldContainer.resumeLayouts();
                        fieldContainer.doLayout();
                    }
                }
            },
            {
                xtype: 'rttypeselectfield',
                name: 'scopeType',
                itemId: 'scopeType',
                fieldLabel: i18n.getKey('新的') + i18n.getKey('argumentType'),
                allowBlank: false,
                diyGetValue: function () {
                    var me = this;
                    return {
                        clazz: "com.qpp.cgp.domain.bom.attribute.RtType",
                        _id: me.getValue()
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    me.setInitialValue(data._id);
                },
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var treePanel = field.ownerCt.query("treepanel[@itemId='leftTree']")[0];
                        var centerGrid = field.ownerCt.query("centergrid[@itemId='centerGrid']")[0];
                        if (treePanel && newValue) {
                            centerGrid.refreshData();
                            treePanel.getStore().proxy.url = adminPath + 'api/rtTypes/' + newValue + '/rtAttributeDefs';
                            treePanel.getStore().load({
                                callback: function (records) {
                                    treePanel.expandAll();
                                }
                            })
                        } else if (treePanel && Ext.isEmpty(newValue)) {
                            centerGrid.refreshData();
                            treePanel.getStore().getRootNode().removeAll();

                        }
                    }
                }
            },
            {
                xtype: 'valueexfield',
                name: 'valueEx',
                itemId: 'valueEx',
                allowBlank: true,
                hidden: true,
                disabled: true,
                fieldLabel: i18n.getKey('自定义ValueEx'),
                commonPartFieldConfig: {
                    expressionConfig: {},
                    defaultValueConfig: {
                        type: 'Map',
                        clazz: 'com.qpp.cgp.value.ExpressionValueEx',
                        typeSetReadOnly: true,
                        clazzSetReadOnly: false
                    }
                },
            },
            {
                xtype: 'outpanel',
                itemId: 'keyValues',
                name: 'keyValues',
                height: 350,
                width: 1000,
            }
        ];
        me.callParent();
    }
})