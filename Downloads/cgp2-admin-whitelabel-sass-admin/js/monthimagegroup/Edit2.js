/**
 * Created by nan on 2021/2/3
 */
Ext.Loader.syncRequire([
    'CGP.monthimagegroup.view.LeftTreePanel',
    'CGP.monthimagegroup.view.CenterGridPanel',
    'CGP.monthimagegroup.model.MonthImageGroupModel'
])
Ext.onReady(function () {
    var controller = Ext.create("CGP.monthimagegroup.controller.Controller");
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
    });
    var languageStore = Ext.create('CGP.common.store.Language', {
        listeners: {
            load: function (store, record) {
                var panel = Ext.create('Ext.panel.Panel', {
                    layout: {
                        type: 'border'
                    },
                    setValue: function (data) {
                        var me = this;
                        var leftTreePanel = me.getComponent('leftTreePanel');
                        leftTreePanel.setValue(data);
                    },
                    getValue: function () {
                        var me = this;
                        var leftTreePanel = me.getComponent('leftTreePanel');
                        return leftTreePanel.getValue();
                    },
                    tbar: [
                        {
                            xtype: 'button',
                            iconCls: 'icon_add',
                            text: i18n.getKey('save'),
                            handler: function (btn) {
                                var panel = btn.ownerCt.ownerCt;
                                var centerGridPanel = panel.getComponent('centerGridPanel');
                                var leftTreePanel = panel.getComponent('leftTreePanel');
                                var record = leftTreePanel.getSelectionModel().getSelection()[0];
                                if(record){
                                    if (centerGridPanel.isValid()) {
                                        record.raw.images = centerGridPanel.getValue();
                                        var data = panel.getValue();
                                        console.log(data);
                                        controller.saveConfig(data, panel);
                                    }
                                }else{
                                    var data = panel.getValue();
                                    controller.saveConfig(data, panel);
                                }
                            }
                        }
                    ],
                    items: [
                        {
                            xtype: 'lefttreepanel',
                            region: 'west',
                            itemId: 'leftTreePanel',
                            languageStore: store,
                            width: 450,
                        },
                        {
                            xtype: 'centergridpanel',
                            region: 'center',
                            itemId: 'centerGridPanel',
                            flex: 1
                        }
                    ],
                    listeners: {
                        afterrender: function () {
                            var panel = this;
                            var id = JSGetQueryString('id');
                            if (id) {
                                CGP.monthimagegroup.model.MonthImageGroupModel.load(id, {
                                    scope: this,
                                    failure: function (record, operation) {
                                    },
                                    success: function (record, operation) {
                                        panel.setValue(record.raw);
                                    },
                                    callback: function (record, operation) {
                                    }
                                })
                            }
                        }
                    }

                });
                page.add(panel);
            }
        }
    });
})