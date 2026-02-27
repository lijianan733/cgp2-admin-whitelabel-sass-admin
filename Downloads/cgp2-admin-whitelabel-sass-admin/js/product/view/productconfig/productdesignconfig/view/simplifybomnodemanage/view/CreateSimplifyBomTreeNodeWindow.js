/**
 * Created by nan on 2019/7/11.
 */
Ext.Loader.syncRequire([
    'CGP.common.field.RtTypeSelectField'
])
Ext.define("CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.view.CreateSimplifyBomTreeNodeWindow", {
    extend: 'Ext.window.Window',
    modal: true,
    constrain: true,
    layout: 'fit',
    title: i18n.getKey('新建简易Bom节点'),
    materialId: null,
    record: null,
    productConfigDesignId: null,//该节点关联的配置id
    simplifyNodesMaterial: null,//已经添加的物料数组
    initComponent: function () {
        var me = this;
        var controller = me.controller = Ext.create('CGP.product.view.productconfig.productdesignconfig.view.simplifybomnodemanage.controller.Controller');
        me.items = {
            xtype: 'errorstrickform',
            record: me.record,
            defaults: {
                padding: '3 10 3 10'
            },
            items: [
                {
                    xtype: 'fieldcontainer',
                    name: 'fieldcontainer',
                    layout: 'hbox',
                    width: 500,
                    ItemId: 'fieldcontainer',
                    fieldLabel: i18n.getKey('materialPath'),
                    setValue: function (data) {
                        var me = this;
                        me.getComponent('materialPath').setValue(data);
                    },
                    getName: function () {
                        var me = this;
                        return me.name;
                    },
                    items: [
                        {
                            xtype: 'textarea',
                            itemId: 'sbomPath',
                            name: 'sbomPath',
                            flex: 1,
                            readOnly: true,
                            materialName: null,
                            allowBlank: false,
                            fieldLabel: false,
                            listeners: {
                                change: function (field, value, old) {
                                    var description = field.ownerCt.ownerCt.getComponent('description');
                                    description.setValue('简易-' + field.materialName);
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            text: i18n.getKey('choice'),
                            width: 50,
                            handler: function (btn) {
                                var container = btn.ownerCt;
                                var materialPath = container.getComponent('sbomPath').getValue();
                                var component = container.getComponent('sbomPath');
                                me.controller.getMaterialPath(me.materialId, materialPath, component, 'create', me.simplifyNodesMaterial);
                            }
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    name: 'description',
                    itemId: 'description',
                    allowBlank: false,
                    width: 500,
                    fieldLabel: i18n.getKey('description'),
                },
                {
                    name: 'rtType',
                    xtype: 'rttypeselectfield',
                    fieldLabel: i18n.getKey('rtType'),
                    itemId: 'rtType',
                    width: 500,
                    allowBlank: true,
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
                        if (form.isValid()) {
                            form.el.mask();
                            var jsonData = Ext.Object.merge({
                                "clazz": "com.qpp.cgp.domain.simplifyBom.SBNode",
                                "left": true,
                            }, form.getValues());
                            if (jsonData.rtType) {
                                jsonData.rtType = {
                                    _id: jsonData.rtType,
                                    clazz: 'com.qpp.cgp.domain.bom.attribute.RtType'
                                }
                            }
                            jsonData.parent = {
                                _id: form.record.getId(),
                                clazz: 'com.qpp.cgp.domain.simplifyBom.SBNode'
                            };
                            jsonData.productConfigDesignId = form.ownerCt.productConfigDesignId;
                            jsonData.sbomPath = jsonData.sbomPath.split(',').slice(1).toString();
                            console.log(jsonData.sbomPath);
                            Ext.Ajax.request({
                                url: adminPath + 'api/SBNodeController',
                                method: 'POST',
                                headers: {
                                    Authorization: 'Bearer ' + Ext.util.Cookies.get('token')
                                },
                                jsonData: jsonData,
                                success: function (response) {
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    if (responseMessage.success) {
                                        form.el.unmask();
                                        var treeStore = form.record.store;
                                        form.record.set('leaf', false);
                                        var treePanel = treeStore.ownerTree;
                                        Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('addsuccessful'), function () {
                                            treeStore.load({
                                                node: form.record,
                                                callback: function (records) {
                                                    form.record.expand();
                                                    var newNode = treeStore.getNodeById(responseMessage.data['_id']);
                                                    treePanel.getSelectionModel().select(newNode);
                                                }
                                            });
                                            form.ownerCt.close();
                                        });

                                    } else {
                                        Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                    }
                                },
                                failure: function (response) {
                                    form.el.unmask();
                                    var responseMessage = Ext.JSON.decode(response.responseText);
                                    Ext.Msg.alert(i18n.getKey('requestFailed'), responseMessage.data.message);
                                }
                            })
                        }
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
        }
        me.callParent();
    }
})

