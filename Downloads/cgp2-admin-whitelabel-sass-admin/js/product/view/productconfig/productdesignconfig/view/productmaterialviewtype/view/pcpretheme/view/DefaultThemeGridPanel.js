/**
 * Created by nan on 2021/10/16
 * 配置mvt如何使用预设主题
 * defaultTheme
 * defaultThemeExpression 优先级高
 */
Ext.Loader.syncRequire([
    'CGP.common.condition.ConditionFieldV3',
    'CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.ConditionWindow'
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.DefaultThemeGridPanel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.defaultthemegridpanel',
    itemId: 'bomItemGrid',
    value: null,//初始的数据集
    skuAttribute: null,
    viewConfig: {
        markDirty: false//标识修改的字段
    },
    mvtId: null,
    mvtType: null,
    mvtData: null,
    contentData: null,
    contentTemplate: null,
    deleteSrc: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png',
    addImgUrl: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/add.png',
    switchUrl: path + 'ClientLibs/extjs/resources/themes/images/ux/switchType.png',
    controller: null,
    listeners: {
        afterrender: function () {
            var me = this;
            me.mvtData = me.controller.getMVTData(me.mvtId, me.mvtType);
            console.log(me.mvtData);
            if (me.mvtData.defaultThemeExpression) {
                /*    me.store.proxy.data = me.mvtData.defaultThemeExpression;
                    me.store.load();*/
            }
        }
    },
    /**
     * 修改MVT中的defaultThemeExpression字段
     */
    saveMVT: function (msg) {
        var me = this;
        var result = [];
        var conditionController = Ext.create('CGP.common.condition.controller.Controller');
        conditionController.contentAttributeStore = Ext.StoreManager.get('contentAttributeStore');
        for (var i = 0; i < me.store.getCount(); i++) {
            result.push(me.store.getAt(i).getData());
        }
        var domain = conditionController.builderExpression(result);
        me.mvtData.defaultThemeExpression = domain.expression;
        me.mvtData.defaultThemeExpressionDTO = result;
        me.controller.saveDefaultThemeExpression(me.mvtData, me, msg);
        console.log(result);
    },
    initComponent: function () {
        var me = this;
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        var productId = builderConfigTab.productId;
        //和pmvt中的上下文一致
        var skuAttributesStore = Ext.create('CGP.product.view.managerskuattribute.store.SkuAttributeGridStore', {
            storeId: 'skuAttributeStore',
            autoLoad: true,
            aimUrlId: productId
        });
        var productController = Ext.create('CGP.product.view.productconfig.controller.Controller');
        me.controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.controller.Controller');
        me.contentData = productController.buildPMVTContentData(productId);
        me.contentTemplate = {
            args: {
                "context": {}
            }
        };
        //产品属性store
        Ext.create('Ext.data.Store', {
            storeId: 'contentAttributeStore',
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
            data: me.contentData
        });
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
                {
                    name: 'description',
                    type: 'string'
                },
                {
                    name: 'clazz',
                    type: 'string',
                    value: 'com.qpp.cgp.domain.product.config.material.mapping2dto.MappingRule'
                }
            ],
            data: []
        });
        me.tbar = {
            hidden: me.isReadOnly,
            items: [
                {
                    text: i18n.getKey('create'),
                    iconCls: 'icon_create',
                    width: 70,
                    height: 24,
                    handler: function (btn) {
                        var grid = btn.ownerCt.ownerCt;
                        for (var i = 0; i < grid.store.getCount(); i++) {
                            var record = grid.store.getAt(i);
                            var condition = record.get('condition');
                            if (Ext.isEmpty(condition)) {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('已有无条件执行的配置，无需添加其他配置'));
                                return;
                            }
                        }
                        var win = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.ConditionWindow', {
                            createOrEdit: 'create',
                            outGrid: grid,
                            contentData: me.contentData,
                            contentTemplate: me.contentTemplate,
                            mvtId: me.mvtId,
                        });
                        win.show();
                    }
                },
            ]
        };
        me.columns = [
            {
                xtype: 'rownumberer',
                tdCls: 'vertical-middle',
                width: 60
            },
            {
                xtype: 'actioncolumn',
                itemId: 'actioncolumn',
                width: 60,
                hidden: me.isReadOnly,
                sortable: false,
                tdCls: 'vertical-middle',
                resizable: false,
                menuDisabled: true,
                items: [
                    {
                        iconCls: 'icon_edit icon_margin',
                        itemId: 'actionedit',
                        tooltip: 'Edit',
                        isDisabled: function (view, rowIndex, colIndex, item, record) {
                            var grid = view.ownerCt;
                            return grid.isReadOnly;
                        },
                        handler: function (view, rowIndex, colIndex, icon, event, record) {
                            var grid = view.ownerCt;
                            var win = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialviewtype.view.pcpretheme.view.ConditionWindow', {
                                record: record,
                                createOrEdit: 'edit',
                                outGrid: grid,
                                mvtId: me.mvtId,
                                contentData: me.contentData,
                                contentTemplate: me.contentTemplate
                            });
                            win.show();
                        }
                    },
                    {
                        iconCls: 'icon_remove icon_margin',
                        itemId: 'actionremove',
                        tooltip: 'Remove',
                        isDisabled: function (view, rowIndex, colIndex, item, record) {
                            var grid = view.ownerCt;
                            return grid.isReadOnly;
                        },
                        handler: function (view, rowIndex, colIndex, icon, event, record) {
                            var grid = view.ownerCt;
                            grid.store.proxy.data.splice(record.index, 1);
                            grid.store.load();
                            grid.saveMVT(i18n.getKey('deleteSuccess'));
                        }
                    }
                ]
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
                                            height: 350,
                                            title: i18n.getKey('check') + i18n.getKey('condition'),
                                            items: [{
                                                xtype: 'conditionfieldcontainer',
                                                width: 1000,
                                                minHeight: 80,
                                                readOnly: true,
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
            {
                text: i18n.getKey('默认主题'),
                dataIndex: 'outputValue',
                tdCls: 'vertical-middle',
                itemId: 'outputValue',
                flex: 1,
                renderer: function (value, mateData, record) {
                    return value.value || value.calculationExpression;
                }
            }
        ];
        me.callParent();
        me.on('afterrender', function () {
            var page = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            me.productId = productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        })
    }
})