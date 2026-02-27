/**
 * Created by nan on 2020/7/3.
 * 现在根据选择pageConfig中的pagePCGenerateConfig的配置完成情况
 * pagePCGenerateConfig是用于生成pc的
 * 进行区别处理没pc生成配置时，不用选择pmvt，且手动选择物料路径
 *
 */
Ext.define('CGP.product.view.productconfig.productimpositionconfig.view.compositionconfig.view.GenerateJobConfig.view.EditPageGenerateConfigWindow', {
    extend: 'Ext.window.Window',
    modal: true,
    constrain: true,
    title: i18n.getKey('编辑page生成配置'),
    productMaterialViewTypeStore: null,
    pageConfigId: null,
    record: null,
    pageConfig: null,
    rtTypeId: null,
    gridFieldGrid: null,
    bomConfigId: null,
    rowIndex: null,
    designId: null,
    isNeedPMVT: false,//是否需要pmvt数据，根据pageConfig中pc生成方式判断，数据绘制就是需要pmvt配置
    listeners: {
        afterrender: function (win) {
            if (win.record) {
                var from = win.items.items[0];
                from.setValue(win.record.getData());
            }
        }
    },
    isValid: function () {
        var isValid = true,
            errors = {};
        this.items.items.forEach(function (f) {
            if (!f.isValid()) {
                var errorInfo = f.getErrors();
                if (Ext.isObject(errorInfo) && !Ext.Object.isEmpty(errorInfo)) {//处理uxfieldContainer的错误信息
                    errors = Ext.Object.merge(errors, errorInfo);
                } else {
                    errors[f.getFieldLabel()] = errorInfo;
                }
                isValid = false;

            }
        });
        return isValid;
    },
    initComponent: function () {
        var me = this;
        var rtTypeId = me.rtTypeId = (me.pageConfig.context ? me.pageConfig.context._id : null);
        var designId = me.designId;
        if (me.pageConfig.pagePCGenerateConfig) {
            me.isNeedPMVT = true;
        }
        me.items = [
            {
                xtype: 'form',
                defaults: {
                    padding: '10 30 5 30',
                    allowBlank: false,
                    width: 400,
                },
                setValue: function (data) {
                    var me = this;
                    data.productMaterialViewType = data.designDataConfig ? data.designDataConfig.productMaterialViewTypeId : null;
                    data.materialPath = data.designDataConfig ? data.designDataConfig.materialPath : null;
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        if (data[item.getName()]) {
                            if (item.xtype == 'gridcombo') {
                                item.diySetValue([data[item.getName()]]);
                            } else {
                                item.setValue(data[item.getName()]);
                            }
                        }
                    }
                },
                isValid: function () {
                    var me = this;
                    var isValid = true;
                    for (var i = 0; i < me.items.items.length; i++) {
                        var item = me.items.items[i];
                        if (item.isValid() == false) {
                            isValid = false;
                        }
                    }
                    return isValid;
                },
                items: [
                    {
                        name: 'pageConfigId',
                        xtype: 'textfield',
                        itemId: 'pageConfigId',
                        fieldLabel: i18n.getKey('pageConfigId'),
                        readOnly: true,
                        value: me.pageConfigId,
                        fieldStyle: 'background-color: silver',//设置文本框的样式
                    },
                    {
                        name: 'productMaterialViewType',
                        xtype: 'gridcombo',
                        itemId: 'productMaterialViewType',
                        fieldLabel: i18n.getKey('productMaterialViewType'),
                        displayField: 'productMaterialViewTypeId',
                        valueField: 'productMaterialViewTypeId',
                        store: me.productMaterialViewTypeStore,
                        editable: false,
                        hidden: me.isNeedPMVT ? false : true,
                        disabled: me.isNeedPMVT ? false : true,
                        matchFieldWidth: false,
                        gridCfg: {
                            store: me.productMaterialViewTypeStore,
                            height: 280,
                            width: 700,
                            columns: [
                                /*   {
                                       dataIndex: '_id',
                                       text: i18n.getKey('id'),
                                       itemId: '_id',
                                       tdCls: 'vertical-middle'
                                   },*/
                                {
                                    dataIndex: 'productMaterialViewTypeId',
                                    text: i18n.getKey('productMaterialViewTypeId'),
                                    width: 200,
                                    tdCls: 'vertical-middle',
                                    itemId: 'productMaterialViewTypeId'
                                },
                                {
                                    dataIndex: 'name',
                                    text: i18n.getKey('name'),
                                    itemId: 'name',
                                    tdCls: 'vertical-middle'
                                },
                                {
                                    dataIndex: 'materialPath',
                                    text: i18n.getKey('materialPath'),
                                    itemId: 'materialPath',
                                    flex: 1,
                                    tdCls: 'vertical-middle'
                                }
                            ]
                        },
                        listeners: {
                            change: function (gridCombo, newValue, oldValue) {
                                var value = gridCombo.getArrayValue();
                                var materialPath = gridCombo.ownerCt.getComponent('materialPath');
                                var _id = gridCombo.ownerCt.getComponent('_id');
                                var pciQty = gridCombo.ownerCt.getComponent('pciQty');
                                //根据选择的pmvt是版本4还是版本5(根据有无materialPath进行判断)，
                                // 4的不允许自己输入，5的可以自己输入
                                if (value && value.materialPath) {
                                    materialPath.show();
                                    materialPath.setDisabled(false);
                                    materialPath.setValue(value.materialPath);
                                    materialPath.getComponent('button').hide();
                                } else {
                                    materialPath.show();
                                    if (!Ext.isEmpty(oldValue)) {
                                        materialPath.setValue(null);
                                    }
                                    materialPath.setDisabled(false);
                                    materialPath.getComponent('button').show();
                                }
                                _id.setValue(value.productConfigDesignId);
                                // if(value.pageContentQty.value)
                                // pciQty.setValue(value.pageContentQty.value);
                                // else
                                //     pciQty.setValue(null);
                            }
                        },
                        diySetValue: function (data) {
                            //天苗兄说，使用这个属性productMaterialViewTypeId来确定
                            var me = this;
                            Ext.Ajax.request({
                                url: encodeURI(adminPath + 'api/productMaterialViewTypes?page=1&start=0&limit=25&filter=' +
                                    Ext.JSON.encode(
                                        [{
                                            "name": "productMaterialViewTypeId",
                                            "value": '%' + data[0] + '%',
                                            "type": "string"
                                        }, {
                                            "name": "productConfigDesignId",
                                            "value": designId,
                                            "type": "number"
                                        }]
                                    )),
                                method: 'GET',
                                headers: {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                },
                                success: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    if (responseMessage.success) {
                                        me.setValue(responseMessage.data.content[0]);
                                    } else {
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    }
                                },
                                failure: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            });

                        }
                    },
                    {
                        xtype: 'fieldcontainer',
                        name: 'materialPath',
                        layout: 'hbox',
                        allowBlank: false,
                        hidden: me.isNeedPMVT ? true : false,
                        disabled: me.isNeedPMVT ? true : false,
                        itemId: 'materialPath',
                        fieldLabel: i18n.getKey('materialPath'),
                        items: [
                            {
                                xtype: 'textarea',
                                itemId: 'materialPath',
                                id: 'materialPath',
                                name: 'materialPath',
                                flex: 1,
                                margin: '0 5 0 0',
                                readOnly: true,
                                allowBlank: false,
                                fieldLabel: false
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('choice'),
                                width: 50,
                                itemId: 'button',
                                handler: function () {
                                    var materialPath = Ext.getCmp('materialPath').getValue();
                                    var component = Ext.getCmp('materialPath');
                                    var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
                                    controller.getMaterialPath(me.bomConfigId, materialPath, component);
                                }
                            }
                        ],
                        isValid: function () {
                            var me = this;
                            return me.getComponent('materialPath').isValid();
                        },
                        getName: function () {
                            return this.name;
                        },
                        setValue: function (data) {
                            var me = this;
                            me.getComponent('materialPath').setValue(data);
                        },
                        getValue: function () {
                            var me = this;
                            return me.getComponent('materialPath').getValue();
                        }
                    },
                    {
                        name: 'pciQty',
                        xtype: 'numberfield',
                        itemId: 'pciQty',
                        fieldLabel: i18n.getKey('pciQty'),
                        allowBlank: true,
                        hideTrigger: true
                    },
                    {//这个是记录design的id，现在已经没啥用了，但还是保留下来
                        name: '_id',
                        xtype: 'textfield',
                        itemId: '_id',
                        allowBlank: true,
                        hidden: true,
                        readOnly: true,
                    },
                    {
                        xtype: 'rttypeattributeinputfieldcontainer',
                        width: 600,
                        name: 'contextConfig',
                        itemId: 'contextConfig',
                        rtTypeId: rtTypeId,
                        allowBlank: false,
                        fieldLabel: i18n.getKey('上下文')
                    },
                    {
                        name: 'clazz',
                        hidden: true,
                        value: 'com.qpp.cgp.composing.config.PageGenerateConfig',
                        xtype: 'textfield'
                    }
                ],
                bbar: [
                    '->',
                    {
                        xtype: 'button',
                        text: i18n.getKey('confirm'),
                        iconCls: 'icon_agree',
                        handler: function (btn) {
                            var form = btn.ownerCt.ownerCt;
                            var win = form.ownerCt;
                            if (form.isValid()) {
                                var data = {};
                                form.items.items.forEach(function (item) {
                                    if (item.disabled == false) {
                                        //自定义获取值优先级高于普通getValue
                                        if (item.xtype == 'gridcombo') {
                                            data[item.getName()] = item.getSubmitValue()[0];
                                        } else {
                                            data[item.getName()] = item.getValue();
                                        }
                                    }
                                });
                                data.designDataConfig = {
                                    materialPath: data.materialPath,
                                    clazz: 'com.qpp.cgp.composing.config.PageDesignDataConfig',
                                    productMaterialViewTypeId: data.productMaterialViewType,
                                    pciQty: Ext.Number.from(data.pciQty, null)
                                };
                                win.gridFieldGrid.store.proxy.data[win.rowIndex] = data;
                                win.gridFieldGrid.store.load();
                                win.close();
                            }
                        }
                    }, {
                        xtype: 'button',
                        text: i18n.getKey('cancel'),
                        iconCls: 'icon_cancel',
                        handler: function (btn) {
                            var form = btn.ownerCt.ownerCt;
                            var win = form.ownerCt;
                            win.close();
                        }
                    }
                ]
            }
        ];
        me.callParent();
    },


})
