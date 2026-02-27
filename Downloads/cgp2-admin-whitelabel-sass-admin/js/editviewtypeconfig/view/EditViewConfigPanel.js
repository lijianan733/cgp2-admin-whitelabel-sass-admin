/**
 * Created by nan on 2020/7/29.
 */
Ext.Loader.syncRequire([
    'CGP.editviewtypeconfig.model.EditViewConfigModel'
])
Ext.define('CGP.editviewtypeconfig.view.EditViewConfigPanel', {
    extend: 'Ext.panel.Panel',
    layout: 'border',
    frame: false,
    border: false,
    createOrEdit: 'create',
    recordData: null,
    setValue: function (data) {
        var me = this;
        me.createOrEdit = 'edit';
        me.recordData = data;
        var centerFormPanel = me.getComponent('centerFormPanel');
        var leftGridPanel = me.getComponent('leftGridPanel');
        centerFormPanel.setValue(data);
        leftGridPanel.setValue(data);
    },
    isValid: function () {
        var me = this;
        var centerFormPane = me.getComponent('centerFormPanel');
        var leftGridPanel = me.getComponent('leftGridPanel');
        return centerFormPane.isValid() && leftGridPanel.isValid();
    },
    getValue: function () {
        var me = this;
        var centerFormPane = me.getComponent('centerFormPanel');
        var leftGridPanel = me.getComponent('leftGridPanel');
        var data = me.recordData || {
            areas: [],
            description: null,
            editViewTypeDomain: null,
            clazz: 'com.qpp.cgp.domain.product.config.view.builder.dto.EditViewTypeDto',

        };
        data.areas = centerFormPane.getValue();
        data = Ext.Object.merge(data, leftGridPanel.getValue());
        return data;
    },
    initComponent: function () {
        var me = this;
        var controller = Ext.create('CGP.editviewtypeconfig.controller.Controller');
        me.items = [
            Ext.create('CGP.editviewtypeconfig.view.LeftGridPanel', {
                region: 'west',
                itemId: 'leftGridPanel',
                width: 300
            }),
            Ext.create('CGP.editviewtypeconfig.view.CenterFormPanel', {
                region: 'center',
                itemId: 'centerFormPanel',
            }),
        ];
        me.tbar = [
            {
                xtype: 'button',
                iconCls: 'icon_save',
                text: i18n.getKey('save'),
                handler: function (btn) {
                    var panel = btn.ownerCt.ownerCt;
                    if (panel.isValid()) {
                        var data = panel.getValue();
                        controller.saveEditViewConfig(panel, data);
                    }
                }
            }, {
                xtype: 'button',
                iconCls: 'icon_edit',
                itemId: 'editJSON',
                text: i18n.getKey('edit') + i18n.getKey('JSON'),
                handler: function (btn) {
                    var panel = btn.ownerCt.ownerCt;
                    var data = panel.recordData.editViewTypeDomain;
                    JSShowJsonDataV2(data, '编辑JSON(请自行保障数据的正确性)', {}, {
                        width: 600,
                        height: 600,
                        editable: true,
                        showValue: true,
                        readOnly: false,
                        bbar: [
                            '->',
                            {
                                xtype: 'button',
                                text: i18n.getKey('confirm'),
                                iconCls: 'icon_agree',
                                handler: function (btn) {
                                    var win = btn.ownerCt.ownerCt;
                                    var data = win.getValue();
                                    try {
                                        var newDTO = controller.domainToDto(data, panel.recordData);

                                    } catch (e) {
                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('生成DTO数据失败'));
                                        return;
                                    }
                                    controller.saveEditViewConfig(panel, newDTO);
                                    win.close();
                                }
                            },
                            {
                                xtype: 'button',
                                text: i18n.getKey('cancel'),
                                iconCls: 'icon_cancel',
                                handler: function (btn) {
                                    var win = btn.ownerCt.ownerCt;
                                    win.close();
                                }
                            }
                        ]
                    })
                }
            }
        ];
        me.callParent();
    }
    ,
    listeners: {
        afterrender: function (panel) {
            var me = this;
            var recordId = JSGetQueryString('id');
            var editJSON = me.getDockedItems('toolbar[dock="top"]')[0].getComponent('editJSON');
            if (recordId) {
                editJSON.setDisabled(false);
                CGP.editviewtypeconfig.model.EditViewConfigModel.load(recordId, {
                    scope: this,
                    failure: function (record, operation) {
                        //do something if the load failed
                    },
                    success: function (record, operation) {
                        me.setValue(record.getData());
                    },
                    callback: function (record, operation) {
                        //do something whether the load succeeded or failed
                    }
                })
            } else {
                editJSON.setDisabled(true);
            }
        }
    }

})
