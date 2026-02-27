/**
 * Created by nan on 2019/7/10.
 */
Ext.Loader.syncRequire([
    'CGP.material.store.BomTree',
    'CGP.common.field.RtTypeSelectField'
]);
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.view.InfoPanel", {
    extend: 'Ext.ux.form.ErrorStrickForm',
    alias: 'widget.infopanel',
    region: 'center',
    itemId: 'infoPanel',
    title: i18n.getKey('info'),
    record: null,
    defaults: {
        allowBlank: false,
        width: 500,
        hidden: true,
        padding: '3 0 3 10'
    },
    isReFresh: true,
    materialId: null,
    productBomConfigId: null,
    initComponent: function () {
        var me = this;
        var controller = me.controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.controller.Controller');
        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            items: [
                {
                    itemId: 'btnSave',
                    text: i18n.getKey('save'),
                    disabled: true,
                    iconCls: 'icon_save',
                    handler: function (comp) {
                        var form = comp.ownerCt.ownerCt;
                        if (form.isValid()) {
                            var materialPath = me.getMaterialPath();
                            //如果最新的materialpath 跟树节点上的materialPath不同就更新所有smvt 然后在保存sbomnode
                            if (me.record.get('materialPath') != materialPath) {
                                me.updateSmvtMaterialPath(me.record.getId(), materialPath, me.record.get('materialPath'));
                            }
                            form.controller.saveFormValue(form);
                        }
                    }
                },
                {
                    itemId: 'reset',
                    text: i18n.getKey('reset'),
                    disabled: true,
                    iconCls: 'icon_reset',
                    handler: function (comp) {
                        var form = comp.ownerCt.ownerCt;
                        form.refreshData(form.record);
                    }
                }
            ]
        });
        me.items = [
            {
                xtype: 'fieldcontainer',
                name: 'sbomPath',
                layout: 'hbox',
                fieldLabel: i18n.getKey('materialPath'),
                itemId: 'materialPathContainer',
                setValue: function (data) {
                    var me = this;
                    var form = me.ownerCt;
                    me.getComponent('sbomPath').setValue(data);
                },
                getName: function () {
                    var me = this;
                    return me.name;
                },
                items: [
                    {
                        xtype: 'textarea',
                        itemId: 'sbomPath',
                        id: 'sbomPath',
                        name: 'sbomPath',
                        readOnly: true,
                        flex: 1,
                        materialName: null,//记录选择的物料名称
                        allowBlank: false,
                        fieldStyle: 'background-color:silver',
                        fieldLabel: false,
                        listeners: {
                            /*change: function (comp,newValue,oldValue){
                                if(!Ext.isEmpty(oldValue)){
                                    me.controller.saveFormValue(me);
                                    me.updateSmvtMaterialPath(me.sbomNode.getId(),newValue)
                                }

                            }*/
                        }
                    },
                    {
                        xtype: 'button',
                        text: i18n.getKey('edit'),
                        width: 50,
                        handler: function (btn) {
                            var container = btn.ownerCt;
                            var materialPath = container.getComponent('sbomPath').getValue();
                            var component = container.getComponent('sbomPath');
                            me.controller.getMaterialPath(me.materialId, materialPath, component, 'edit', [], me.record);
                        }
                    }
                ]
            },
            {
                xtype: 'textfield',
                name: 'description',
                allowBlank: false,
                fieldLabel: i18n.getKey('description'),
            },
            {
                xtype: 'rttypeselectfield',
                fieldLabel: i18n.getKey('rtType'),
                itemId: 'rtType',
                name: 'rtType',
                allowBlank: true,
                listeners: {
                    change: function (field, newValue, oldValue) {
                       ;
                        if (field.ownerCt.isReFresh == false) {
                            if (!Ext.isEmpty(oldValue)) {
                                var rtObjectContainer = field.ownerCt.getComponent('rtObject');
                                var rtObjectField = rtObjectContainer.items.items[0];
                                rtObjectField.getStore().proxy.url = adminPath + 'api/rtTypes/' + newValue + '/rtAttributeDefs';
                                me.valueJsonObject = {};
                                me.objectJson = {};
                                rtObjectField.data.rtType['_id'] = newValue;
                                rtObjectField.getStore().load({
                                    callback: function (records) {
                                        rtObjectField.expandAll();
                                    }
                                })
                            }
                        }
                        field.ownerCt.isReFresh = false;
                    }
                }
            },
            {
                xtype: 'fieldcontainer',
                name: 'rtObject',
                itemId: 'rtObject',
                fieldLabel: i18n.getKey('rtObject'),
                items: [
                    Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.view.RtObjectTree', {
                        data: {
                            rtType: {}
                        }
                    })
                ],
                getName: function () {
                    var me = this;
                    return me.name;
                },
                getValue: function () {
                    var me = this;
                    console.log(me.items.items[0].getValue())
                    return me.items.items[0].getValue();
                },
                setValue: function (data) {
                    var me = this;
                    me.items.items[0].refreshData(data);
                },
            }
        ];
        me.callParent();
    },
    refreshData: function (record) {
        var me = this;
        me.el.mask();
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        var isLock = builderConfigTab.isLock;
        me.record = record;
        me.isReFresh = true;
        if (record.parentNode.isRoot()) {
            //me.materialId = me.materialId;
        } else {
            //me.materialId = record.parentNode.raw.sbomPath.split(',').pop();
        }
        var toolbar = me.getDockedItems('toolbar[dock="top"]')[0];
        for (var i = 0; i < toolbar.items.items.length; i++) {
            toolbar.items.items[i].setDisabled(false || isLock);
        }
        for (var i = 0; i < me.items.items.length; i++) {
            var item = me.items.items[i];
            if (item.name == 'rtType') {
                if (record.get(item.getName())) {
                    item.setInitialValue([record.get(item.getName())]);
                } else {
                    item.reset();
                }
            } else if (item.name == 'sbomPath') {
                if (record.parentNode.isRoot()) {
                    item.setValue(record.get(item.getName()));

                } else {
                    var parentMaterialPath = record.parentNode.get('materialPath');
                    item.setValue(parentMaterialPath + ',' + record.get(item.getName()));
                }
            } else if (item.name == 'rtObject') {
                if (Ext.isEmpty(record.get(item.getName()))) {
                    item.hide();
                    //item.setDisabled(true);
                    continue;//不需显示
                } else {
                    item.setValue(record.get(item.getName()));
                }
            } else {
                item.setValue(record.get(item.getName()));
            }
            item.show();
        }
        me.el.unmask();
    },
    updateSmvtMaterialPath: function (sbomNodeId, newMaterialPath, oldMaterialPath) {
        var me = this;
        Ext.Ajax.request({
            url: adminPath + 'api/simplifyMaterialViewTypePaths?simplifyBomNodeId=' + sbomNodeId + '&completePath=' + oldMaterialPath + '&path=' + newMaterialPath,
            method: 'PUT',
            headers: {
                Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
            },
            async: false,
            success: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                if (responseMessage.success) {
                    var smvt = me.ownerCt.getComponent('smvtGrid');
                    var smvtStore = smvt.grid.getStore();
                    smvtStore.load();
                } else {
                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                }
            },
            failure: function (response) {
                var responseMessage = Ext.JSON.decode(response.responseText);
                Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
            }
        });
    },
    getMaterialPath: function () {
        var me = this;
        var materialPathComp = me.getComponent('materialPathContainer').getComponent('sbomPath');
        var materialPath = '';
        materialPath = materialPathComp.getValue();
        return materialPath;

    }
});
