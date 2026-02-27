/**
 * Created by TM on 2021/05/28
 * 简易类型预处理
 */
Ext.Loader.syncRequire([
    "CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.SelectorMapping",
    "CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.SelectorMappingSet"
])
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.Main', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    designId: null,
    builderConfigTab: null,
    controller: null,
    alias: 'widget.simplifytype',
    // 查询输入框
    filterCfg: {
        hidden: true
    },
    initComponent: function () {
        var me = this;

        var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.store.SimplifyType', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'designId',
                    type: 'string',
                    value: me.designId
                }])
            }
        });
        var clazzMapp = {
            'CycleFillGridPreprocessConfig': 'CycleFillGrid',
            'OrdeFillSinglePCPreprocessConfig': 'OrdeFillSingle',
            'OrderFillMultiContainerPreprocessConfig': 'OrderFillMultiContainer',
            'OrderFillSingleStructPreprocessConfig': 'OrderFillSingleStruct',
            'OrderFillSingleStructGridSinglePCPreprocessConfig': 'OrderFillSingleStructGridSingle',
            'OrderSingleFillGridMultiplePCPreprocessConfig': 'OrderSingleFillGridMultiple'
        }
        me.gridCfg = {
            // store是指store.js
            store: store,
            border: false,
            frame: false,
            columnDefaults: {
                autoSizeColumn: true,
                tdCls: 'vertical-middle'
            },

            editActionHandler: function (gridview, rowIndex, colIndex, view, event, record, dom) {//编辑按钮的操作

                var type = clazzMapp[record.get('clazz').substr(record.get('clazz').lastIndexOf('.') + 1)];
                me.builderConfigTab.editSimplifyPreProcess(me.designId, record.get('_id'), type);
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: '_id'
                },
                {
                    text: i18n.getKey('type'),
                    dataIndex: 'clazz',
                    itemId: 'clazz',
                    width: 250,
                    renderer: function (value, metadata, record) {
                        var type = clazzMapp[value.substr(value.lastIndexOf('.') + 1)];
                        return i18n.getKey(type);
                    }
                },
                {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    itemId: 'description',
                    flex: 1
                },
                {
                    text: i18n.getKey('源MVT'),
                    dataIndex: 'left',
                    itemId: 'left',
                    width: 250,
                    renderer: function (value, metadata, record) {
                        return me.convertValue(value);
                    }
                },
                {
                    text: i18n.getKey('目标MVT'),
                    dataIndex: 'right',
                    itemId: 'right',
                    width: 250,
                    renderer: function (value, metadata, record) {
                        return me.convertValue(value);
                    }
                },
                {
                    text: i18n.getKey('isReversible'),
                    dataIndex: 'isReversible',
                    itemId: 'isReversible',
                    width: 80,
                    renderer: function (value, metadata, record) {
                        return i18n.getKey(value);
                    }
                },
                {
                    text: i18n.getKey('titleNumber'),
                    dataIndex: 'titleNumber',
                    itemId: 'titleNumber',
                    width: 80,
                    renderer: function (value, metadata, record) {
                        return value;
                    }
                },
                {
                    xtype: 'componentcolumn',
                    text: i18n.getKey('selectorMappingRelations'),
                    dataIndex: 'selectorMappingRelations',
                    itemId: 'selectorMappingRelations',
                    width: 250,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="查看pageContentTargetMappingConfigs"';
                        var showComp = null;
                        if (value && value.length > 1) {
                            showComp = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.simplifytype.SelectorMapping', {
                                name: 'selectorMappingRelations',
                                itemId: 'selectorMappingShow',
                                data: value
                            });
                        } else {
                            showComp = {
                                name: 'selectorMappingRelations',
                                xtype: 'selectormappingset',
                                itemId: 'selectorMappingShow',
                                listeners: {
                                    afterrender: function (comp) {
                                        comp?.setValue(value);
                                    }
                                }
                            }
                        }
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>查看pageContentTargetMappingConfigs</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        Ext.create('Ext.window.Window', {
                                            layout: 'fit',
                                            modal: true,
                                            constrain: true,
                                            width: 600,
                                            title: i18n.getKey('check'),
                                            items: [
                                                {
                                                    xtype: 'form',
                                                    itemId: 'mappingForm',
                                                    items: [
                                                        showComp
                                                    ]
                                                }
                                            ]
                                        }).show();
                                    });
                                }
                            }
                        };
                    }
                }
            ]
        };
        me.callParent();
        me.on('afterrender', function () {

        });
    },

    convertValue: function (value) {
        var strShow = [];
        if (value instanceof Array) {
            strShow = value.map(function (item) {
                return item._id;
            })
        } else {
            strShow.push(value._id);
        }
        return strShow.join(',');
    }


})