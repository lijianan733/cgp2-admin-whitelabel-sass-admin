Ext.Loader.syncRequire(["CGP.materialviewtype.model.Model"]);
Ext.define("CGP.materialviewtype.EditTab", {
    extend: "Ext.tab.Panel",
    region: 'center',
    header: false,

    initComponent: function () {
        var me = this;
        me.data = {};
        var urlParams = Ext.Object.fromQueryString(location.search);
        var materialviewtypeModel = null;
        if (urlParams.id != null) {
            materialviewtypeModel = Ext.ModelManager.getModel("CGP.materialviewtype.model.Model");
        }
        var createOrEdit = urlParams.id ? 'edit' : 'create';
        //me.title = i18n.getKey("materialInfo");
        var controller = Ext.create('CGP.materialviewtype.controller.Controller');
        me.tbar = Ext.create('Ext.toolbar.Toolbar', {
            items: [
                {
                    itemId: 'btnSave',
                    text: i18n.getKey('save'),
                    iconCls: 'icon_save',
                    handler: function (comp) {
                        var items = me.items.items;
                        var isValid = true;
                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];
                            if (item.xtype == 'form') {
                                if (item.isValid() == false) {
                                    me.setActiveTab(item);
                                    isValid = false;
                                    break;
                                }
                            }
                        }
                        if (isValid == false) {
                            return;
                        }
                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];
                            if (item.itemId == 'pcsPlaceholders') {
                                me.data.pcsPlaceholders = item.getValue();
                            } else if (item.itemId == 'PlaceHolderVdCfg') {
                                me.data = Ext.Object.merge(me.data, item.getValue());
                            } else if (item.itemId == 'variableDataSourceQtyCfg') {
                                me.data = Ext.Object.merge(me.data, item.getValue());
                            } else {
                                Ext.Object.merge(me.data, item.getValue());
                            }
                        }
                        if (createOrEdit == 'create') {
                            delete me.data._id;
                        }
                        var mask = me.setLoading();
                        controller.saveMaterialViewType(me.data, materialviewtypeModel, mask, false);
                    }
                },
                {
                    xtype: 'button',
                    itemId: "copy",
                    text: i18n.getKey('copy'),
                    iconCls: 'icon_copy',
                    disabled: urlParams.id == null,
                    handler: function () {
                        materialviewtypeModel = null;
                        this.setDisabled(true);
                        window.parent.Ext.getCmp("materialviewtype_edit").setTitle(i18n.getKey('create') + "_" + i18n.getKey('materialViewType'));
                        var idComp = me.getComponent('information').getComponent('id');
                        idComp.setValue("");
                        idComp.setVisible(false);
                        createOrEdit = 'create';
                    }
                },
                {
                    xtype: 'button',
                    itemId: "checkJson",
                    //disabled: urlParams.id == null,
                    text: i18n.getKey('check') + i18n.getKey('JSON'),
                    iconCls: 'icon_check',
                    handler: function () {
                        var previewData = {};
                        if (Ext.isEmpty(materialviewtypeModel)) {
                            previewData = {};
                        } else {
                            previewData = materialviewtypeModel.data;
                        }
                        JSShowJsonDataV2(previewData, '编辑物料viewType', null, {
                            height: 620,
                            showValue: true,
                            editable: true,
                            readOnly: false,
                            bbar: ['->', {
                                itemId: 'btnSave',
                                text: i18n.getKey('save'),
                                iconCls: 'icon_save',
                                handler: function (btn) {
                                    var win = btn.ownerCt.ownerCt;
                                    var data = win.getValue();
                                    var mask = win.setLoading();
                                    var controller = Ext.create('CGP.materialviewtype.controller.Controller');
                                    controller.saveMaterialViewType(data, materialviewtypeModel, mask, true);

                                }
                            }, {
                                itemId: 'btnCancel',
                                text: i18n.getKey('cancel'),
                                iconCls: 'icon_cancel',
                                handler: function (comp) {
                                    me.close();
                                }
                            }]
                        });
                    }
                }
            ]
        });
        var information = Ext.create('CGP.materialviewtype.view.edit.Information');
        var pageContentCfg = Ext.create('CGP.materialviewtype.view.edit.PageContentConfig');
        var pageContentInstanceCfg = Ext.create("CGP.materialviewtype.view.edit.PageContentInstanceCfg");
        var pcsPlaceholders = Ext.create("CGP.materialviewtype.view.edit.PcsPlaceholder");

        me.items = [
            information, pageContentCfg, pageContentInstanceCfg, pcsPlaceholders
        ];
        me.callParent(arguments);
        if (!Ext.isEmpty(urlParams.id)) {
            materialviewtypeModel.load(Number(urlParams.id), {
                success: function (record, operation) {
                    materialviewtypeModel = record;
                    me.refreshData(record.data);
                }
            });
        } else {
            //me.refreshData(data);
        }
    },
    refreshData: function (data) {
        var me = this;
        var items = me.items.items;
        me.data = data;
        Ext.Array.each(items, function (item) {
            item.refreshData(data);
        })
    }
});
