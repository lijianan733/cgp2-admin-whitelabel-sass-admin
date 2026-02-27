/**
 * Created by nan on 2018/3/14.
 */
Ext.syncRequire([
    'Ext.ux.data.proxy.PagingMemoryProxy',
    'CGP.common.valueExV3.model.SkuAttributeConstraint'
]);
Ext.define('CGP.common.valueExV3.GroupGridPanel', {
    extend: "Ext.panel.Panel",
    layout: 'anchor',
    id: JSGetUUID(),
    parentTab: null,//必须传入的
    autoScroll: true,//自动添加滚动
    readOnly: false,
    initComponent: function () {
        var me = this;
        me.tbar = [
            {
                xtype: 'button',
                text: i18n.getKey('add'),
                disabled: me.readOnly,
                iconCls: 'icon_create',
                handler: function (view) {
                    view.ownerCt.ownerCt.addRecord(view.ownerCt.ownerCt.parentTab);
                }
            }/*,
        {
            xtype: 'button',
            text: i18n.getKey('获取数据'),
            iconCls: 'icon_create',
            handler: function (view) {
                console.log(view.ownerCt.ownerCt.getValue())
            }
        }*/
        ];
        me.callParent();
    },

    /**
     * 获取该panel中所有grid的数据
     */
    getValue: function () {
        var me = this;
        var data = [];
        for (var i = 0; i < me.items.items.length; i++) {
            for (var j = 0; j < me.items.items[i].store.data.length; j++) {
                data.push(me.items.items[i].store.getAt(j).getData());
            }
        }
        return data;
    },
    /**
     *
     * @param sourceData 源数据
     */
    setValue: function (sourceData) {
        var me = this;
        var discreteValueConstraintDataArray = [];
        var continuousValueConstraintDataArray = [];
        for (var i = 0; i < sourceData.length; i++) {
            if (sourceData[i].clazz == 'com.qpp.cgp.value.constraint.DiscreteValueConstraint') {
                discreteValueConstraintDataArray.push(sourceData[i]);
            } else {
                continuousValueConstraintDataArray.push(sourceData[i]);
            }
        }
        var discreteValueConstraintGrid = me.addGrid(discreteValueConstraintDataArray, 'com.qpp.cgp.value.constraint.DiscreteValueConstraint');
        var continuousValueConstraintGrid = me.addGrid(continuousValueConstraintDataArray, 'com.qpp.cgp.value.constraint.ContinuousValueConstraint');
    },
    /**
     *传入约束记录数据的数组
     * @param recordArray 数据
     * @param inputTypeClazz 是离散约束还是连续约束
     * 返回添加的grid
     */
    addGrid: function (recordArray, inputTypeClazz) {
        var me = this;
        var tab = me.parentTab;
        var gridUUId = JSGetUUID();
        var controller = Ext.create('CGP.common.valueExV3.controller.Controller');
        var inputTypeClazz = inputTypeClazz;
        var store = Ext.create('Ext.data.Store', {
            id: JSGetUUID(),
            model: 'CGP.common.valueExV3.model.SkuAttributeConstraint',
            data: recordArray,
            proxy: {
                type: 'pagingmemory', // 指定使用PagingMemoryProxy控制读取内存数据，需要导入'Ext.ux.data.proxy.PagingMemoryProxy'
                root: 'recordArray'
            },
            autoLoad: true,// 指定自动加载,
            autoSync: true,
        });
        var inputType = inputTypeClazz == 'com.qpp.cgp.value.constraint.DiscreteValueConstraint' ? 'DiscreteValueConstraint' : 'ContinuousValueConstraint';
        var gridType = '';
        if (inputType == 'DiscreteValueConstraint') {
            gridType = 'CGP.common.valueExV3.view.ManagerDiscreteValueConstraintGrid'
        } else {
            gridType = 'CGP.common.valueExV3.view.ManagerContinuousValueConstraintGrid'
        }
        var grid = Ext.create(gridType, {
            controller: controller,
            id: gridUUId,
            store: store,
            tabPanel: tab,
            hidden: recordArray.length == 0,
            currentPanel: me,
            inputTypeClazz: inputTypeClazz,
            configurableId: null,
            autoScroll: false,
            bodyStyle: 'overflow-x:hidden;overflow-y:auto',
            title: '<font color=green>' + i18n.getKey(inputType) + '</font>',//根据条件判断是啥类型
            header: {//头部的样式
                style: 'background-color:white;',
                color: 'black',
                border: '0 0 0 0'
            },
            tbar: {
                hidden: true
            }
        });
        //当store有数据更改时触发,当store没有数据时grid隐藏
        store.on('datachanged', function (store) {
            var grid = Ext.getCmp(gridUUId);
            if (store.data.length == 0) {
                grid.hide();
            } else {
                grid.show();
            }
        });
        me.add(grid);
        return grid;
    },
    /**
     * 添加一条记录
     * @param tab 外层的tab
     */
    addRecord: function (tab) {
        var me = this;
        var window = Ext.create('Ext.window.Window', {
            title: i18n.getKey('selectConstraintType'),
            height: 200,
            modal: true,
            constrain: true,
            width: 400,
            layout: 'fit',
            items: {
                xtype: 'form',
                border: false,
                layout: {//居中
                    type: 'vbox',
                    align: 'center',
                    pack: 'center'
                },
                items: [
                    {
                        xtype: 'combo',
                        displayField: 'name',
                        valueField: 'value',
                        editable: false,
                        itemId: 'type',
                        value: 'com.qpp.cgp.value.constraint.ContinuousValueConstraint',
                        fieldLabel: i18n.getKey('constraints') + i18n.getKey('type'),
                        store: Ext.create('Ext.data.Store', {
                            fields: [
                                {
                                    name: 'name',
                                    type: 'string'
                                },
                                {
                                    name: 'value',
                                    type: 'string'
                                }
                            ],
                            data: [
                                {
                                    name: i18n.getKey('DiscreteValueConstraint'),
                                    value: 'com.qpp.cgp.value.constraint.DiscreteValueConstraint'
                                },
                                {
                                    name: i18n.getKey('ContinuousValueConstraint'),
                                    value: 'com.qpp.cgp.value.constraint.ContinuousValueConstraint'
                                }
                            ]
                        })
                    }
                ],
                bbar: [
                    '->',
                    {
                        xtype: 'button',
                        text: i18n.getKey('ok'),
                        iconCls: 'icon_agree',
                        handler: function (view) {
                            var panel = tab.getComponent('EditAtrributeConstraintPanel');
                            if (!Ext.isEmpty(panel)) {
                                tab.remove(panel);
                            }
                            panel = Ext.create('Ext.panel.Panel', {
                                layout: 'fit',
                                title: i18n.getKey('create') + i18n.getKey('constraint'),
                                id: 'EditAtrributeConstraintPanel',
                                itemId: 'EditAtrributeConstraintPanel',
                                closable: true,//是否显示关闭按钮,
                                autoScroll: true
                            });
                            var type = view.ownerCt.ownerCt.getComponent('type').getValue();
                            if (type == 'com.qpp.cgp.value.constraint.ContinuousValueConstraint') {
                                var EditContinuousValueConstraintForm = Ext.create('CGP.common.valueExV3.view.EditContinuousValueConstraintForm', {
                                    itemId: 'editConstraint',
                                    createOrEdit: 'create',
                                    tab: tab,//外围的tab
                                    currentPanel: me,//调转前的panel
                                    editPanel: panel,//跳转后的编辑panel
                                    inputTypeClazz: 'com.qpp.cgp.value.constraint.ContinuousValueConstraint'
                                });
                                panel.add(EditContinuousValueConstraintForm);
                            } else {
                                var EditDiscreteValueConstraintForm = Ext.create('CGP.common.valueExV3.view.EditDiscreteValueConstraintForm', {
                                    itemId: 'editConstraint',
                                    createOrEdit: 'create',
                                    tab: tab,
                                    currentPanel: me,
                                    editPanel: panel,
                                    inputTypeClazz: 'com.qpp.cgp.value.constraint.DiscreteValueConstraint'
                                });
                                panel.add(EditDiscreteValueConstraintForm);
                            }
                            tab.add(panel)
                            tab.setActiveTab(panel);
                            window.close();
                        }
                    },
                    {
                        xtype: 'button',
                        text: i18n.getKey('cancel'),
                        iconCls: 'icon_cancel',//取消
                        handler: function (view) {
                            window.close();
                        }
                    }
                ]
            }
        }).show();
    }
})
