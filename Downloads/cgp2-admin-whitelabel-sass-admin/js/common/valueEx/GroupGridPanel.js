/**
 * Created by nan on 2018/3/14.
 */
Ext.syncRequire([
    'Ext.ux.data.proxy.PagingMemoryProxy',
    'CGP.common.valueEx.model.SkuAttributeConstraint']);
Ext.define('CGP.common.valueEx.GroupGridPanel', {
    extend: "Ext.panel.Panel",
    layout: 'anchor',
    sourceData: [],
    //id: 'GroupGridPanel',
    skuAttributeId: null,//必须传入的
    parentTab:null,//必须传入的
    tbar: [
        {
            xtype: 'button',
            text: i18n.getKey('add')+i18n.getKey('constraint'),
            iconCls: 'icon_create',
            handler: function (view) {
                //console.log(view.ownerCt.ownerCt.tab)
                view.ownerCt.ownerCt.addRecord(this.ownerCt.ownerCt.ownerCt);
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
    ],
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
     * @param tab 外层的tab
     */
    setValue: function (sourceData, tab) {
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
        var discreteValueConstraintGrid = me.addGrid(discreteValueConstraintDataArray, tab, 'com.qpp.cgp.value.constraint.DiscreteValueConstraint')
        var continuousValueConstraintGrid = me.addGrid(continuousValueConstraintDataArray, tab, 'com.qpp.cgp.value.constraint.ContinuousValueConstraint')
    },
    /**
     *传入约束记录数据的数组
     * @param recordArray 数据
     * @param tab 外层的tab
     * @param inputTypeClazz 是离散约束还是连续约束
     * 返回添加的grid
     */
    addGrid: function (recordArray, tab, inputTypeClazz) {
        var me = this;
        var skuAttriId = me.skuAttributeId;
        var controller = Ext.create('CGP.common.valueEx.controller.Controller');
        var inputTypeClazz = inputTypeClazz;
        var store = Ext.create('Ext.data.Store',
            {
                id: JSGetUUID(),
                model: 'CGP.common.valueEx.model.SkuAttributeConstraint',
                data: recordArray,
                proxy: {
                    type: 'pagingmemory', // 指定使用PagingMemoryProxy控制读取内存数据，需要导入'Ext.ux.data.proxy.PagingMemoryProxy'
                    root: 'recordArray'
                },
                autoLoad: true,// 指定自动加载,
                autoSync: true,
                listeners: {
                    //当store有数据更改时触发,当store没有数据时grid隐藏
                    'datachanged': function (store) {
                        if (store.data.length == 0) {
                            grid.hide();
                        } else {
                            grid.show();
                        }
                    }
                }
            });
        var inputType = inputTypeClazz == 'com.qpp.cgp.value.constraint.DiscreteValueConstraint' ? 'DiscreteValueConstraint' : 'ContinuousValueConstraint';
        var grid = Ext.create('CGP.common.valueEx.view.ManagerSkuAttrConstraintGrid', {
            skuAttributeId: skuAttriId,
            controller: controller,
            id: JSGetUUID(),
            store: store,
            tabPanel: tab,
            inputTypeClazz: inputTypeClazz,
            configurableId: null,
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
        me.add(grid);
        return grid;
    },
    /**
     * 添加一条记录
     * @param tab 外层的tab
     */
    addRecord: function (tab) {
        var window = Ext.create('Ext.window.Window', {
            title: '选择添加的约束类型',
            height: 200,
            modal: true,
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
                                closable: true,//是否显示关闭按钮,
                                autoScroll: true
                            });
                            var type = view.ownerCt.ownerCt.getComponent('type').getValue();
                            if (type == 'com.qpp.cgp.value.constraint.ContinuousValueConstraint') {
                                var EditContinuousValueConstraintForm = Ext.create('CGP.common.valueEx.view.EditContinuousValueConstraintForm', {
                                    skuAttributeId: 123,//传入的参数
                                    id: 'editConstraint',
                                    createOrEdit: 'create',
                                    tab: tab,
                                    inputTypeClazz: 'com.qpp.cgp.value.constraint.ContinuousValueConstraint'
                                });
                                panel.add(EditContinuousValueConstraintForm);
                            } else {
                                var EditDiscreteValueConstraintForm = Ext.create('CGP.common.valueEx.view.EditDiscreteValueConstraintForm', {
                                    skuAttributeId: 123,//传入的参数
                                    id: 'editConstraint',
                                    createOrEdit: 'create',
                                    tab: tab,
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