/**
 * Created by nan on 2020/3/26.
 */
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.SpuAttributeMappingCenterGrid", {
    extend: 'Ext.grid.Panel',
    itemId: 'bomItemGrid',
    value: null,//初始的数据集
    skuAttribute: null,
    viewConfig: {
        markDirty: false//标识修改的字段
    },
    deleteSrc: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png',
    addImgUrl: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/add.png',
    switchUrl: path + 'ClientLibs/extjs/resources/themes/images/ux/switchType.png',
    materialAttName: null,
    setReadOnly: function (isReadOnly) {
        var me = this;
        me.isReadOnly = isReadOnly;
        var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
        var actionColumn = me.headerCt.getGridColumns()[0];
        if (me.rendered == true) {
            toolbar.items.items[0].setDisabled(isReadOnly);
            if (isReadOnly) {
                actionColumn.hide();
            } else {
                actionColumn.show();
            }
        } else {
            me.on('afterrender', function () {
               
                toolbar.items.items[0].setDisabled(isReadOnly);
            }, this, {
                single: true
            })
        }
    },
    refreshData: function (data) {
        var me = this;
        if (data) {
            me.skuAttribute = data;
            me.setReadOnly(false);
            me.materialAttName = data.name;
            var spuRtObjectMappingDTOConfig=[];
            if (data.spuRtObjectMappingDTOConfig && Ext.isArray(data.spuRtObjectMappingDTOConfig)) {
                data.spuRtObjectMappingDTOConfig.forEach(function (item){
                    item.materialAttName=data.name;
                })
            }
            me.store.proxy.data = data.spuRtObjectMappingDTOConfig;
            me.store.load();
        } else {
            me.setReadOnly(true);
            me.store.proxy.data = [];
            me.store.load();
        }

    },
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.controller.Controller');
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
                    convert: function () {
                        return 'com.qpp.cgp.domain.product.config.material.mapping2dto.MappingRule'
                    }
                },
                {
                    name: 'materialAttName',
                    type: 'string'
                }
            ],
            data: []
        });
        me.tbar = {
            hidden: me.isReadOnly,
            items: [
                {
                    text: i18n.getKey('add'),
                    iconCls: 'icon_create',
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
                        var win = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.EditSpuAttributeMappingWindow', {
                            createOrEdit: 'create',
                            outGrid: grid,
                            skuAttribute: grid.skuAttribute,
                        });
                        win.show();
                    }
                }
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
                            var win = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV3.view.EditSpuAttributeMappingWindow', {
                                createOrEdit: 'edit',
                                outGrid: grid,
                                skuAttribute: grid.skuAttribute,
                                record: record
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
                            //触发修改事件
                            var centerContainer = Ext.getCmp('productMaterialMappingV3_CenterContainer');
                            if (centerContainer) {
                                centerContainer.fireEvent('dirty');
                            }
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
                                        controller.checkCondition(value);
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
                width: 250
            },
            {
                text: i18n.getKey('material') + i18n.getKey('attribute'),
                dataIndex: 'materialAttName',
                tdCls: 'vertical-middle',
                itemId: 'materialAttName',
                width: 160,
                renderer: function (value, mateData, record) {
                    return value;
                }
            },
            {
                text: i18n.getKey('material') + i18n.getKey('attribute') + i18n.getKey('value'),
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
    }
})
