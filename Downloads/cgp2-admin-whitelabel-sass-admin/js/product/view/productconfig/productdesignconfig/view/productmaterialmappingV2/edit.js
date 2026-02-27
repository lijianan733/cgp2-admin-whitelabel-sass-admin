Ext.Loader.syncRequire(['CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV2.model.MaterialMapping']);
Ext.define('CGP.product.view.productconfig.productdesignconfig.view.productmaterialmappingV2.edit', {
    extend: 'Ext.window.Window',
    modal: true,
    layout: 'fit',
    productConfigDesignId: null,
    initComponent: function () {
        var me = this;
        var builderConfigTab = window.parent.Ext.getCmp('builderConfigTab');
        var isLock = builderConfigTab.isLock;
        me.title = i18n.getKey(me.editOrNew) + i18n.getKey('materialMapping');
        var controller = Ext.create('CGP.product.view.productconfig.controller.Controller');
        var rawData = {
            "materialPath": "",
            "productConfigDesignId": me.productConfigDesignId,
            "bomItemMappingConfigs": [
                {}
            ],
            "materialAttrMappingConfigs": [
                {}
            ],
            "clazz": "com.qpp.cgp.domain.product.config.material.mapping2.MaterialMappingConfig"
        };
        var form = {
            xtype: 'form',
            border: false,
            padding: '10 10 0 10',
            header: false,
            items: [{
                xtype: 'textarea',
                itemId: 'data',
                width: 700,
                height: 600,
                fieldLabel: i18n.getKey('content'),
                name: 'data'
            }],
            listeners: {
                render: function (comp) {
                    if (me.editOrNew == 'modify') {
                        var result = JSON.stringify(me.data, null, "\t");
                        comp.getComponent('data').on('render', function () {
                            comp.getComponent('data').setValue(result)
                        });
                    } else {
                        var result = JSON.stringify(rawData, null, "\t");
                        comp.getComponent('data').on('render', function () {
                            comp.getComponent('data').setValue(result)
                        });
                    }
                }
            }
        };
        me.items = [form];
        me.bbar = {
            hidden: isLock,
            items: [{
                xtype: 'button',
                text: i18n.getKey('replace') + i18n.getKey('materialPath'),
                iconCls: 'icon_replace',
                handler: function () {
                    var form = this.ownerCt.ownerCt.down('form');
                    var jsonData = {};
                    var dataComp = form.getComponent('data');
                    var data = dataComp.getValue();
                    if (form.isValid()) {
                        if (!Ext.isEmpty(data)) {
                            try {
                                jsonData = JSON.parse(data);
                            } catch (e) {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('illlegal json'));
                                return;
                            }
                        } else {
                            Ext.Msg.alert(i18n.getKey('prompt'), '数据中无materialPath!');
                            return;
                        }
                        if (jsonData.materialPath) {
                            controller.selectMaterialPath(me.productBomConfigId, jsonData.materialPath, jsonData, dataComp);
                        } else {
                            Ext.Msg.alert(i18n.getKey('prompt'), '数据中无materialPath!');
                            return;
                        }
                    }

                }
            }, '->', {
                xtype: 'button',
                text: i18n.getKey('confirm'),
                iconCls: 'icon_agree',
                handler: function () {
                    var form = this.ownerCt.ownerCt.down('form');
                    var jsonData = {};
                    if (form.isValid()) {
                        var data = form.getComponent('data').getValue();
                        if (!Ext.isEmpty(data)) {
                            try {
                                jsonData = JSON.parse(data);
                            } catch (e) {
                                Ext.Msg.alert(i18n.getKey('prompt'), i18n.getKey('illlegal json'));
                                return;
                            }
                        }
                        jsonData.productConfigDesignId = me.productConfigDesignId;
                        if (jsonData._id) {
                            me.controller.updataMaterialMapping(jsonData, me.store, me)
                        } else {
                            me.controller.newMaterialMapping(jsonData, me.store, me)
                        }
                    }
                }
            }, {
                xtype: 'button',
                text: i18n.getKey('cancel'),
                iconCls: 'icon_cancel',
                handler: function () {
                    me.close();
                }
            }]
        };

        me.callParent(arguments);
    }
});
