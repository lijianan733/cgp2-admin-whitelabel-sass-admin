/**
 * Created by nan on 2020/10/15
 */
Ext.Loader.syncRequire([
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.AttributeTreeCombo',
    'CGP.common.rttypetortobject.view.RtTypeToRtObjectFieldContainer',
    'CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.RelateComponent'
])
Ext.define('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.view.AssertantsGridField', {
    extend: 'Ext.ux.form.GridFieldWithCRUDV2',
    alias: 'widget.assertantsgridfield',
    profileStore: null,
    diyGetValue: function () {
        var me = this;
        var data = me.getSubmitValue();
        JSClearNullValue(data);
        return data;
    },
    diySetValue: function (data) {
        var me = this;
        me.setSubmitValue(data);
    },
    initComponent: function () {
        var me = this;
        me.gridConfig = {
            store: Ext.create('Ext.data.Store', {
                autoSync: true,
                fields: [
                    {name: 'nameKey', type: 'string'},
                    {name: 'headerKey', type: 'string'},
                    {name: 'noticeKey', type: 'string'},
                    {name: 'clazz', type: 'string'},
                    {
                        name: 'relateComponent', type: 'object'
                    },
                    {name: 'fitMode', type: 'string'},
                    {name: 'width', type: 'number'},
                    {name: 'height', type: 'number'},
                ],
                data: []
            }),
            columns: [
                {
                    text: i18n.getKey('component') + i18n.getKey('id'),
                    dataIndex: 'relateComponent',
                    tdCls: 'vertical-middle',
                    renderer: function (value, matedata, record) {
                        return value._id;
                    }
                },
                {
                    text: i18n.getKey('fitMode'),
                    dataIndex: 'fitMode',
                    tdCls: 'vertical-middle',
                    renderer: function (value, matedata, recrod) {
                        var data = {
                            'auto': i18n.getKey('autoSize'),
                            'stretch': i18n.getKey('stretchSize'),
                            'fix': i18n.getKey('fixSize')
                        };
                        return data[value];

                    }
                },
                {
                    text: i18n.getKey('title') + i18n.getKey('info'),
                    dataIndex: 'headerKey',
                    flex: 1,
                    tdCls: 'vertical-middle',
                },
            ]
        };
        me.winConfig = {
            formConfig: {
                width: '100%',
                maxHeight: 650,
                autoScroll: true,
                defaults: {
                    width: 450,
                    allowBlank: true,
                    margin: '5 25 5 25'
                },
                saveHandler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    var win = form.ownerCt;
                    if (form.isValid()) {
                        var data = {};
                        data = form.getValue();
                        console.log(data);
                        //修改配置时,判断是否修改了关联组件
                        var controller = Ext.create('CGP.product.view.productconfig.productviewconfig.view.viewconfigv3.controller.Controller');
                        var usingInfo = controller.getComponentUsingInfo(Ext.getCmp('navigationTree'));
                        console.log(usingInfo);

                        //找出相同id的配置，然后比较其配置是否相同
                        var isChanged = false;
                        var relateComponentData = data['relateComponent'];
                        for (var i = 0; i < window.componentArr.length; i++) {
                            var item = window.componentArr[i];
                            if (item._id == relateComponentData._id) {
                                if (JSObjectValueEqual(relateComponentData, item)) {
                                } else {
                                    isChanged = true;
                                }
                            }
                        }
                        //统计引用次数
                        var usingCount = 0;
                        var tipInfo = '';
                        if (isChanged == true) {
                            tipInfo = '该组件在如下导航项：<br>';
                            for (var i in usingInfo[relateComponentData._id]) {
                                usingCount += usingInfo[relateComponentData._id][i].count;
                                tipInfo += usingInfo[relateComponentData._id][i].description + '(' + i + ')<br>';
                            }
                            tipInfo += '共<font color="red">' + usingCount + '</font>处使用,是否确定修改?';
                        }


                        data.relateComponent = {
                            _id: relateComponentData._id,
                            clazz: relateComponentData.clazz
                        };
                        var currentData = Ext.getCmp('navigationTree').getValue();
                        var dirtyComponentArr = [relateComponentData._id];
                        if (isChanged == true && usingCount > 0) {
                            //如果引用次数超过1,提示关联组件信息
                            Ext.Msg.confirm(i18n.getKey('prompt'), i18n.getKey(tipInfo), function (selector) {
                                if (selector == 'yes') {
                                    //更新组件信息
                                    controller.updateComponentData(relateComponentData, currentData);
                                    if (win.createOrEdit == 'create') {
                                        win.outGrid.store.add(data);
                                    } else {
                                        for (var i in data) {
                                            win.record.set(i, data[i]);
                                        }
                                    }
                                    //更新DTO界面数据
                                    var centerBuilderViewConfigPanel = Ext.getCmp('centerBuilderViewConfigPanel');
                                    if (dirtyComponentArr.length > 0 && centerBuilderViewConfigPanel) {
                                        centerBuilderViewConfigPanel.refreshDataByArr(dirtyComponentArr);
                                    }
                                    win.close();
                                } else {
                                    return false;
                                }
                            })
                        } else {
                            controller.updateComponentData(relateComponentData, currentData);
                            if (win.createOrEdit == 'create') {
                                win.outGrid.store.add(data);
                            } else {
                                for (var i in data) {
                                    win.record.set(i, data[i]);
                                }
                            }
                            //更新DTO界面数据
                            var centerBuilderViewConfigPanel = Ext.getCmp('centerBuilderViewConfigPanel');
                            if (dirtyComponentArr.length > 0 && centerBuilderViewConfigPanel) {
                                centerBuilderViewConfigPanel.refreshDataByArr(dirtyComponentArr);
                            }
                            win.close();
                        }
                    }
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'clazz',
                        itemId: 'clazz',
                        hidden: true,
                        value: 'com.qpp.cgp.domain.product.config.view.builder.config.v3.AssistantConfig'
                    },
                    {
                        name: 'nameKey',
                        xtype: 'multilanguagefield',
                        fieldLabel: i18n.getKey('component') + i18n.getKey('displayName'),
                        itemId: 'nameKey',
                    },
                    {
                        name: 'headerKey',
                        xtype: 'multilanguagefield',
                        fieldLabel: i18n.getKey('title') + i18n.getKey('info'),
                        itemId: 'headerKey',
                    },
                    {
                        name: 'noticeKey',
                        xtype: 'multilanguagefield',
                        fieldLabel: i18n.getKey('prompt') + i18n.getKey('info'),
                        itemId: 'noticeKey',
                    },
                    {
                        xtype: 'combo',
                        name: 'fitMode',
                        itemId: 'fitMode',
                        allowBlank: false,
                        fieldLabel: i18n.getKey('fitMode'),
                        displayField: 'display',
                        valueField: 'value',
                        editable: false,
                        store: Ext.create('Ext.data.Store', {
                            fields: ['value', 'display'],
                            data: [
                                {
                                    value: 'auto',
                                    display: i18n.getKey('autoSize')
                                },
                                {
                                    value: 'stretch',
                                    display: i18n.getKey('stretchSize')
                                },
                                {
                                    value: 'fix',
                                    display: i18n.getKey('fixSize')
                                }
                            ]
                        }),
                        listeners: {
                            change: function (field, newValue, oldValue) {
                                var assert = (newValue == 'fix');
                                field.ownerCt.getComponent('width').setDisabled(!assert);
                                field.ownerCt.getComponent('height').setDisabled(!assert);
                                field.ownerCt.getComponent('width').setVisible(assert);
                                field.ownerCt.getComponent('height').setVisible(assert);
                            }
                        }
                    },
                    {
                        xtype: 'numberfield',
                        name: 'width',
                        itemId: 'width',
                        fieldLabel: i18n.getKey('width'),
                        allowBlank: false,
                        hidden: true,
                        disabled: true,
                        allowDecimals: true,
                        hideTrigger: true,
                        minValue: 0,
                    },
                    {
                        xtype: 'numberfield',
                        name: 'height',
                        itemId: 'height',
                        fieldLabel: i18n.getKey('height'),
                        allowBlank: false,
                        hidden: true,
                        disabled: true,
                        allowDecimals: true,
                        hideTrigger: true,
                        minValue: 0,
                    },
                    {
                        xtype: 'relatecomponent',
                        name: 'relateComponent',
                        itemId: 'relateComponent',
                        width: 600,
                    }
                ]
            },
        }
        me.callParent();
    },

})