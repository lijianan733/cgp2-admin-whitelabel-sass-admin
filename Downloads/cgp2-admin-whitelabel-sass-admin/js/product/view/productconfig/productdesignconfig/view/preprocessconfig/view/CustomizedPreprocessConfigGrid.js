/**
 * Created by nan on 2021/1/8
 * 自定义的预处理配置
 */
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.view.CustomizedPreprocessConfigGrid', {
    extend: 'CGP.common.commoncomp.QueryGrid',
    designId: null,
    builderConfigTab: null,
    controller: null,
    alias: 'widget.customizedpreprocessconfiggrid',
    // 查询输入框
    filterCfg: {
        hidden: true
    },
    initComponent: function () {
        var me = this;
        var store = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.preprocessconfig.store.PreProcessConfigStore', {
            params: {
                filter: Ext.JSON.encode([{
                    name: 'designId',
                    type: 'string',
                    value: me.designId
                }])
            }
        });
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
                var grid = gridview.ownerCt;
                var QueryGrid = grid.ownerCt;
                var builderConfigTab = QueryGrid.builderConfigTab;
                builderConfigTab.editMaterialViewTypePreProcessConfig(QueryGrid.designId, record.getId(), 'edit', 'MaterialViewTypePreprocessConfig');
            },
            columns: [
                {
                    text: i18n.getKey('id'),
                    dataIndex: '_id',
                    itemId: '_id'
                }, {
                    text: i18n.getKey('description'),
                    dataIndex: 'description',
                    itemId: 'description'
                },
                {
                    text: i18n.getKey('目标MVT'),
                    dataIndex: 'targetMaterialViewType',
                    itemId: 'targetMaterialViewType',
                    width: 250,
                    renderer: function (value, metadata, record) {
                        return value.description + '(' + value._id + ')';
                    }
                }, {
                    text: i18n.getKey('源MVT'),
                    dataIndex: 'sourceMaterialViewTypes',
                    itemId: 'sourceMaterialViewTypes',
                    width: 250,
                    renderer: function (value, metadata, record) {
                        var result = '';
                        if (value) {
                            for (var i = 0; i < value.length; i++) {
                                result += value[i].description + '(' + value[i]._id + '),';
                                if (i % 2 != 0) {
                                    result += '<br>'
                                }
                            }
                        }
                        return result;
                    }
                }, {
                    text: i18n.getKey('conditionMappingConfigs'),
                    dataIndex: 'conditionMappingConfigs',
                    itemId: 'conditionMappingConfigs',
                    xtype: 'componentcolumn',
                    flex: 1,
                    minWidth: 200,
                    renderer: function (value, metadata, record) {
                        metadata.tdAttr = 'data-qtip="查看pageContentTargetMappingConfigs"';
                        return {
                            xtype: 'displayfield',
                            value: '<a href="#")>查看pageContentTargetMappingConfigs</a>',
                            listeners: {
                                render: function (display) {
                                    var a = display.el.dom.getElementsByTagName('a')[0]; //获取到该html元素下的a元素
                                    var ela = Ext.fly(a); //获取到a元素的element封装对象
                                    ela.on("click", function () {
                                        console.log(record);
                                        Ext.create('Ext.window.Window', {
                                            layout: 'fit',
                                            modal: true,
                                            constrain: true,
                                            width: '70%',
                                            height: '45%',
                                            title: i18n.getKey('check'),
                                            items: [
                                                {
                                                    xtype: 'conditionmappingconfiggird',
                                                    itemId: 'checkconditionMappingConfigGird',
                                                    designId: me.designId,
                                                    checkOnly: true,
                                                    header: false,
                                                    listeners: {
                                                        afterrender: function (grid) {
                                                            grid.setValue(value);
                                                        }
                                                    }
                                                }
                                            ]
                                        }).show();
                                    });
                                }
                            }
                        };
                    }
                }]
        };
        me.callParent();
        me.on('afterrender', function () {
            var page = this;
            var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
            var productId = builderConfigTab.productId;
            var isLock = JSCheckProductIsLock(productId);
            if (isLock) {
                JSLockConfig(page);
            }
        });
    }


})
