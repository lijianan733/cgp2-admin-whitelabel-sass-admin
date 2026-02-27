/**
 * Created by nan on 2021/11/22
 */
Ext.Loader.syncRequire([
    'CGP.common.smtselector.SelectBomTreeNodeWindow'
])
Ext.define("CGP.common.smtselector.SMTPathSelector", {
    extend: 'Ext.ux.form.field.UxFieldContainer',
    alias: 'widget.smtpathselector',
    layout: 'hbox',
    labelAlign: 'left',
    defaults: {},
    smtId: null,
    allowBlank:false,
    setValue: function (data) {
        var me = this;
        var smtPath = me.getComponent('smtPath');
        if (smtPath.rendered) {
            smtPath.setValue(data);
        } else {
            smtPath.on('afterrender', function () {
                smtPath.setValue(data);
            }, this, {
                single: true,
            })
        }

    },
    getValue: function () {
        var me = this;
        return me.getComponent('smtPath').getValue();
    },
    isValid: function () {
        var me = this;
        if (me.disabled == true) {
            return true;
        } else if (me.allowBlank != true) {
            return me.getComponent('smtPath').isValid();
        } else {
            return true;
        }
    },
    getErrors: function () {
        return '不允许为空';
    },
    initComponent: function () {
        var me = this;
        me.items = [
            {
                xtype: 'textarea',
                itemId: 'smtPath',
                name: 'smtPath',
                readOnly: true,
                flex: 1,
                materialName: null,//记录选择的物料名称
                allowBlank: me.allowBlank,
                fieldLabel: false,
            },
            {
                xtype: 'button',
                text: i18n.getKey('edit'),
                width: 50,
                margin: '0 5 0 5',
                handler: function (btn) {
                    var container = btn.ownerCt;
                    var materialPath = container.getComponent('smtPath').getValue();
                    var component = container.getComponent('smtPath');
                    var materialId = container.smtId;
                    Ext.Ajax.request({
                        url: adminPath + 'api/materials/' + materialId,
                        method: 'GET',
                        headers: {Authorization: 'Bearer ' + Ext.util.Cookies.get('token')},
                        success: function (resp) {
                            var response = Ext.JSON.decode(resp.responseText);
                            var success = response.success;
                            if (success) {
                                var data = response.data;
                                var materialName = data.name;
                                var materialId = data._id;
                                var type;
                                if (data.clazz == 'com.qpp.cgp.domain.bom.MaterialType') {
                                    type = 'MaterialType'
                                } else if (data.clazz == 'com.qpp.cgp.domain.bom.MaterialSpu') {
                                    type = 'MaterialSpu'
                                }
                                Ext.create('CGP.common.smtselector.SelectBomTreeNodeWindow', {
                                    createOrEdit: 'edit',
                                    materialPath: materialPath,
                                    root: {
                                        _id: materialId,
                                        clazz: data.clazz,
                                        name: materialName,
                                        type: type,
                                        icon: type == 'MaterialSpu' ? path + 'ClientLibs/extjs/resources/themes/images/ux/S.png' : path + 'ClientLibs/extjs/resources/themes/images/ux/T.png'
                                    },
                                    saveHandle: function (btn) {
                                        var win = this.ownerCt.ownerCt;
                                        var selectNode = win.getComponent('bomTree').getSelectionModel().getSelection()[0];
                                        if (!Ext.isEmpty(selectNode)) {
                                            if (selectNode.get('type') == 'MaterialType' || selectNode.get('type') == 'MaterialSpu') {
                                                var pathStr = selectNode.get('_id').replace(/-/g, ',')
                                                component.setValue(pathStr);
                                                win.close();
                                            } else {
                                                Ext.Msg.alert('提示', '请选择一个物料');
                                            }
                                        } else {
                                            Ext.Msg.alert('提示', '请选择一个物料');
                                        }
                                    }
                                }).show();
                            } else {
                                Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                            }
                        },
                        failure: function (resp) {
                            var response = Ext.JSON.decode(resp.responseText);
                            Ext.Msg.alert(i18n.getKey('requestFailed'), response.data.message);
                        }
                    });

                }
            }
        ];
        me.callParent();
    }
})