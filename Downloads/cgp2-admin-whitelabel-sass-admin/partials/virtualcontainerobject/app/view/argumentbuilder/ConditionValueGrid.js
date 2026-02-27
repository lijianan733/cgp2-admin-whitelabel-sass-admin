Ext.Loader.setPath('CGP.virtualcontainerobject', '../../app');
Ext.define("CGP.virtualcontainerobject.view.argumentbuilder.ConditionValueGrid", {
    extend: "Ext.grid.Panel",
    alias: 'widget.conditionvaluegrid',
    value: null,//初始的数据集
    rtAttribute: null,
    viewConfig: {
        markDirty: false//标识修改的字段
    },
    deleteSrc: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/remove.png',
    addImgUrl: path + 'ClientLibs/extjs/resources/themes/images/shared/fam/add.png',
    switchUrl: path + 'ClientLibs/extjs/resources/themes/images/ux/switchType.png',
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
            me.rtAttribute = data;
            me.setReadOnly(false);
            me.store.proxy.data = data.conditionValue?data.conditionValue:[];
            me.store.load();
        } else {
            me.setReadOnly(true);
            me.store.proxy.data = [];
            me.store.load();
        }

    },
    getValue:function (){
        var me=this,data=null;
        data=me.store.proxy.data;

        return data;
    },
    isValid: function () {
        var me = this;
        var isValid = true;
        if (me.rendered == true) {
            if (!me.allowBlank && me.store.count()<1) {
                isValid = false;
            }
        }
        return isValid;
    },
    initComponent: function () {
        var me = this;
        var controller=Ext.create('CGP.virtualcontainerobject.controller.VirtualContainerObject');
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
                }
            ],
            data: []
        });
        me.tbar = {
            // hidden: me.isReadOnly,
            items: [
                {
                    itemId: 'conditionValueAdd',
                    text: i18n.getKey('add'),
                    iconCls: 'icon_create',
                    handler:function(btn){
                        controller.addConditionValue(btn);
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
                            controller.editConditionValue( grid, record);
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
                flex: 1
            },
            {
                text: i18n.getKey('value'),
                dataIndex: 'outputValue',
                tdCls: 'vertical-middle',
                itemId: 'outputValue',
                width: 250,
                renderer: function (value, mateData, record) {
                    return value?.value || value?.calculationExpression;
                }
            }
        ];
        me.callParent();
    }
})
