/**
 * @Description:
 * @author nan
 * @date 2023/4/25
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.view.ConditionFieldContainer',
    'CGP.common.condition.store.ContentAttributeStore',
    'CGP.common.condition.view.CustomConditionPanel',
    'Ext.ux.form.GridFieldWithCRUDV2'
])
Ext.define("CGP.common.condition.view.ConditionValueGridField", {
    extend: 'Ext.ux.form.GridFieldWithCRUDV2',
    alias: 'widget.conditionvaluegridfield',
    outputValueComponent: null,//output值获取组件,该组件获取的值为对象类型
    outputValueColumn: null,//自定义输出值列的配置
    rawData: null,//源数据
    outputValueType: 'String',//输出结果值类型
    contentData: null,
    contentTemplate: null,
    contentAttributeStore: null,
    controller: null,
    /**
     * winConfig:{
     *         winTitle: null,
     *         setValueHandler: null,//新建和修改的具体操作
     *         formConfig: {
     *             saveHandler: null,
     *             items: null
     *         }
     *     }
     */
    winConfig: null,//弹窗设置
    constructor: function (config) {
        var me = this;
        this.initConfig(config);
        me.callParent(arguments);
    },
    /**
     *  把DTO数据转换成domain
     * @param mappingRules
     */
    translateToDomain: function (mappingRulesDTO) {
        var form = this;
        var domain = null;
        var conditionController = Ext.create('CGP.common.condition.controller.Controller');
        conditionController.contentAttributeStore = Ext.StoreManager.get('contentAttributeStore');
        domain = conditionController.builderExpression(mappingRulesDTO);
        return domain;
    },
    initComponent: function () {
        var me = this;
        var store = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'memory'
            },
            fields: [
                {
                    name: 'condition',
                    type: 'object'
                },
                {
                    name: 'outputValue',
                    type: 'object'
                },
                {//标记返回结果的值类型
                    name: 'outputValueType',
                    type: 'string',
                    defaultValue: 'String'
                },
                {
                    name: 'description',
                    type: 'string'
                },
                {
                    name: 'clazz',
                    type: 'string',
                    defaultValue: 'com.qpp.cgp.domain.product.config.material.mapping2dto.MappingRule'
                }
            ],
            data: me.rawData
        });
        var contentAttributeStore = me.contentAttributeStore || Ext.data.StoreManager.get('contentAttributeStore') ||
            Ext.create('CGP.common.condition.store.ContentAttributeStore', {
                storeId: 'contentAttributeStore',
                data: me.contentData
            });
        me.gridConfig = Ext.Object.merge({
            store: store,
            tbar: {
                btnConfig: {
                    xtype: 'button',
                    hidden: false,
                    disabled: false,
                    text: '<font color="red">' + i18n.getKey('测试运行结果') + '</font>',
                    iconCls: 'icon_test',
                    width: 120,
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt;
                        var gridField = grid.ownerCt;
                        var data = gridField.diyGetValue();
                        if (data.length > 0) {
                            var valueEx = gridField.translateToDomain(data);
                            JSValidValueEx(valueEx.expression);
                        } else {
                            Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('请创建数据'))
                        }
                    }
                },
            },
            columns: [
                {
                    text: i18n.getKey('condition'),
                    dataIndex: 'condition',
                    tdCls: 'vertical-middle',
                    itemId: 'condition',
                    width: 150,
                    xtype: 'componentcolumn',
                    renderer: function (value, metadata, record, rowIndex, colIndex, store, gridView) {
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
                                            var win = Ext.create('Ext.window.Window', {
                                                layout: 'fit',
                                                modal: true,
                                                height: 350,
                                                title: i18n.getKey('check') + i18n.getKey('condition'),
                                                items: [{
                                                    xtype: 'conditionfieldcontainer',
                                                    readOnly: true,
                                                    width: 1000,
                                                    fieldLabel: null,
                                                    margin: '0 5 0 5',
                                                    contentData: me.contentData,
                                                    rawData: value,
                                                    contentTemplate: me.contentTemplate,
                                                }]
                                            })
                                            win.show();
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
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    tdCls: 'vertical-middle',
                    itemId: 'description',
                    width: 200,
                },
                me.outputValueColumn || {
                    text: i18n.getKey('outputValue'),
                    dataIndex: 'outputValue',
                    tdCls: 'vertical-middle',
                    itemId: 'outputValue',
                    flex: 1,
                    renderer: function (value, mateData, record) {
                        return value.value;
                    }
                }
            ]
        }, me.gridConfig);
        me.winConfig = Ext.Object.merge({
            width: 800,
            height: 500,
            maximizable: true,
            layout: 'fit',
            formConfig: {
                isValidForItems: true,
                maxHeight: '100%',
                layout: 'vbox',
                useForEach: true,
                defaults: {
                    margin: '5 25 5 25',
                    allowBlank: false,
                },
                items: [
                    {
                        name: 'description',
                        itemId: 'description',
                        xtype: 'textfield',
                        width: 350,
                        fieldLabel: i18n.getKey('description')
                    },
                    {
                        name: 'outputValueType',
                        itemId: 'outputValueType',
                        xtype: 'hiddenfield',
                        value: me.outputValueType,
                    },
                    {
                        name: 'clazz',
                        itemId: 'clazz',
                        xtype: 'hiddenfield',
                        value: 'com.qpp.cgp.domain.product.config.material.mapping2dto.MappingRule'
                    },
                    /**
                     * clazz : "com.qpp.cgp.domain.executecondition.operation.value.FixValue"
                     * value : "135016"
                     *
                     * clazz:"com.qpp.cgp.domain.executecondition.operation.value.CalculationTemplateValue"
                     * calculationExpression: : "123123123"
                     */
                    (me.outputValueComponent || {
                        xtype: 'textfield',
                        itemId: 'outputValue',
                        name: 'outputValue',
                        width: 350,
                        fieldLabel: i18n.getKey('outputValue'),
                        diyGetValue: function () {
                            var me = this;
                            return {
                                clazz: 'com.qpp.cgp.domain.executecondition.operation.value.FixValue',
                                value: me.getValue()
                            }
                        },
                        diySetValue: function (data) {
                            var me = this;
                            var value = data?.value;
                            me.setValue(value);
                        }
                    }),
                    {
                        xtype: 'conditionfieldcontainer',
                        name: 'condition',
                        itemId: 'condition',
                        labelAlign: 'top',
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        margin: '5 25 25 25',
                        allowBlank: true,
                        contentData: me.contentData,
                        contentTemplate: me.contentTemplate,
                        rawData: null,
                        allowElse: true,//默认不使用else选项
                        contentAttributeStore: contentAttributeStore,
                        functionTemplate: null,
                        fieldLabel: i18n.getKey('condition'),
                    }
                ]
            }
        });
        me.callParent();
        me.on('afterrender', function () {
            var me = this;
            if (me.rawData) {
                var store = me.gridFieldGrid.store;
                store.proxy.data = me.rawData;
                store.load();
            }
        });
    }
})