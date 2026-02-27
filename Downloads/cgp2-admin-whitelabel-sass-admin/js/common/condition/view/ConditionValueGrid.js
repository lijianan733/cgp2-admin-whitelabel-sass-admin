/**
 * Created by nan on 2021/10/27
 * 条件->值 这种格式的数据列表，
 * 该组件还未完备，待完成
 * outputValueComponent 该组件得有diySetValue,diyGetValue，其返回值结构为{clazz，value}
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.view.ConditionFieldContainer',
    'CGP.common.condition.store.ContentAttributeStore',
    'CGP.common.condition.view.CustomConditionPanel'
])
Ext.define("CGP.common.condition.view.ConditionValueGrid", {
    extend: 'Ext.ux.grid.GridWithCRUD',
    alias: 'widget.conditionvaluegrid',
    outputValueComponent: null,//output值获取组件,该组件获取的值为对象类型
    outputValueColumn: null,//自定义输出值列的配置
    rawData: null,//源数据
    outputValueType: 'String',//输出结果值类型
    contentData: null,
    contentTemplate: null,
    contentAttributeStore: null,
    deleteSrc: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png',
    addImgUrl: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/add.png',
    switchUrl: path + 'ClientLibs/extjs/resources/themes/images/ux/switchType.png',
    controller: null,
    constructor: function (config) {
        var me = this;
        this.initConfig(config);
        var contentAttributeStore = me.contentAttributeStore ||
            Ext.data.StoreManager.get('contentAttributeStore') ||
            Ext.create('CGP.common.condition.store.ContentAttributeStore', {
                storeId: 'contentAttributeStore',
                data: me.contentData
            });
        me.contentAttributeStore = contentAttributeStore;
        //本地数据
        me.store = Ext.create('Ext.data.Store', {
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
        me.columns = [
            {
                xtype: 'rownumberer',
                tdCls: 'vertical-middle',
                width: 60
            },
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
                width: 250,
            },
            me.outputValueColumn || {
                text: i18n.getKey('outputValue'),
                dataIndex: 'outputValue',
                tdCls: 'vertical-middle',
                itemId: 'outputValue',
                flex: 1,
                renderer: function (value, mateData, record) {
                    return JSAutoWordWrapStr(value.value || value.calculationExpression)
                }
            }
        ];
        me.winConfig = {
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
                    (me.outputValueComponent || {
                        xtype: 'textfield',
                        itemId: 'outputValue',
                        name: 'outputValue',
                        width: 350,
                        fieldLabel: i18n.getKey('outputValue'),
                    }),
                    {
                        xtype: 'conditionfieldcontainer',
                        name: 'condition',
                        itemId: 'condition',
                        labelAlign: 'top',
                        flex: 1,
                        width: '100%',
                        height: '100%',
                        minHeight: 350,
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
        };
        me.callParent(arguments);
    },
    initComponent: function () {
        var me = this;
        me.callParent();
        //加载数据时进行排序处理
        me.store.on('beforeload', function (store, reader) {
            //调整顺序,无条件在第一条，else在最后
            var gridData = store.proxy.data;
            gridData.map(function (item, index, arr) {
                if (Ext.isEmpty(item.condition)) {
                    arr.splice(index, 1);
                    arr.unshift(item);
                } else if (item.condition.conditionType == 'else') {
                    arr.splice(index, 1);
                    arr.push(item);
                }
            });
        })
        me.on('afterrender', function () {
            var me = this;
            if (me.rawData) {
                me.store.proxy.data = me.rawData;
                me.store.load();
            }
        })
    }
})