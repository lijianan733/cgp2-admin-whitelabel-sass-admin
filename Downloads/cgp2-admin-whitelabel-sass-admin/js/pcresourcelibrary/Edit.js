/**
 * Created by nan on 2021/9/1
 */
Ext.Loader.syncRequire([
    'CGP.pcresourcelibrary.view.EditPCResourceItemWin',
    'CGP.pcresourcelibrary.config.Config',
    'CGP.pcresourcelibrary.view.CategoryGridCombo',
    'CGP.pcresourcelibrary.model.PCResourceLibraryModel',
    'CGP.pcresourcelibrary.view.PCResourceItemGridV2'
]);
Ext.onReady(function () {
    //页面的url参数。如果id不为null。说明是编辑。
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit',
    });
    var resourceStore = Ext.create('CGP.pcresourcelibrary.store.PCResourceItemStore', {
        autoLoad: false,
        listeners: {
            load: function (store, records) {
                var resourceType = Ext.getCmp('resourceType');
                if (resourceType) {
                    resourceType.setReadOnly(records.length > 0);
                    resourceType.setFieldStyle('background-color:' + (records.length > 0 ? 'silver' : 'white'));
                }
            },
            remove: function (store) {
                var resourceType = Ext.getCmp('resourceType');
                if (resourceType) {
                    var records = store.getCount();
                    resourceType.setReadOnly(records.length > 0);
                    resourceType.setFieldStyle('background-color:' + (records.length > 0 ? 'silver' : 'white'));
                }
            }
        }
    });
    var resourceLibraryId = JSGetQueryString('id');
    var resourceType = JSGetQueryString('type');
    var controller = Ext.create('CGP.pcresourcelibrary.controller.Controller');
    var form = Ext.create('Ext.ux.form.ErrorStrickForm', {
        isValid: function () {
            var me = this;
            this.msgPanel.hide();
            var isValid = true,
                errors = {};
            this.items.items.forEach(function (f) {
                if (f.isValid && !f.isValid()) {
                    var errorInfo = f.getErrors();
                    if (Ext.isObject(errorInfo) && !Ext.Object.isEmpty(errorInfo)) {//处理uxfieldContainer的错误信息
                        errors = Ext.Object.merge(errors, errorInfo);
                    } else {
                        errors[f.getFieldLabel()] = errorInfo;
                    }
                    isValid = false;

                }
            });
            isValid ? null : this.showErrors(errors);
            return isValid;
        },
        getValue: function () {
            var me = this;
            var data = {};
            this.items.items.forEach(function (f) {
                if (f.diyGetValue) {
                    data[f.getName()] = f.diyGetValue();
                } else if (f.getValue) {
                    data[f.getName()] = f.getValue();

                }
            });
            return data;
        },
        setValue: function (data) {
            var me = this;
            this.items.items.forEach(function (f) {
                if (f.diyGetValue) {
                    f.diySetValue(data[f.getName()]);
                } else if (f.getValue) {
                    f.setValue(data[f.getName()]);
                }
            });
            var grid = me.getComponent('resourceItemGrid');
            grid.store.load();
        },
        listeners: {
            afterrender: function () {
                var me = this;
                var resourceLibraryId = JSGetQueryString('id');
                if (resourceLibraryId) {
                    CGP.pcresourcelibrary.model.PCResourceLibraryModel.load(resourceLibraryId, {
                        scope: this,
                        failure: function (record, operation) {
                            //do something if the load failed
                        },
                        success: function (record, operation) {
                            me.setValue(record.getData())
                        },
                        callback: function (record, operation) {
                            //do something whether the load succeeded or failed
                        }
                    })
                }
            }
        },
        defaults: {
            margin: '10 25 5 25',
            allowBlank: false,
        },
        tbar: [
            {
                xtype: 'button',
                text: i18n.getKey('save'),
                iconCls: 'icon_save',
                handler: function (btn) {
                    var form = btn.ownerCt.ownerCt;
                    if (form.isValid()) {
                        var data = form.getValue();
                        controller.saveRecord(data);
                    }
                }
            },
            {
                xtype: 'button',
                text: i18n.getKey('switch') + i18n.getKey('view'),
                iconCls: 'icon_switch',
                itemId: 'switchBtn',
                handler: function (btn) {
                    JSOpen({
                        id: "pcresourcelibrary_edit",
                        url: path + 'partials/pcresourcelibrary/edit2.html?id=' + resourceLibraryId + '&type=' + resourceType,
                        title: i18n.getKey('edit') + "_" + i18n.getKey('pcResourceLibrary') + '(' + resourceLibraryId + ')',
                        refresh: true
                    });
                }
            }
        ],
        items: [
            {
                xtype: 'toolbar',
                border: '0 0 1 0',
                margin: 0,
                items: [
                    {
                        xtype: 'displayfield',
                        value: '<font color="green">' + i18n.getKey('baseInfo') + '</font>',
                    }
                ]
            },
            {
                xtype: 'textfield',
                name: 'name',
                width: 400,
                itemId: 'name',
                fieldLabel: i18n.getKey('name')
            },
            {
                xtype: 'textfield',
                name: '_id',
                width: 400,
                itemId: '_id',
                hidden: true,
                fieldLabel: i18n.getKey('_id')
            },
            {
                xtype: 'textfield',
                name: 'description',
                width: 400,
                itemId: 'description',
                fieldLabel: i18n.getKey('description')
            },
            {
                xtype: 'combo',
                name: 'type',
                itemId: 'type',
                fieldLabel: i18n.getKey('resources') + i18n.getKey('type'),
                width: 400,
                id: 'resourceType',
                valueField: 'value',
                displayField: 'display',
                editable: false,
                store: {
                    type: 'store',
                    fields: ['value', 'display'],
                    data: CGP.pcresourcelibrary.config.Config.IPCResourceType
                },
                listeners: {
                    change: function (combo, newValue, oldValue) {
                        var resourceItemGrid = combo.ownerCt.getComponent('resourceItemGrid');
                        resourceItemGrid.resourceType = newValue;
                    }
                }
            },
            {
                xtype: 'textfield',
                name: 'clazz',
                hidden: true,
                itemId: 'clazz',
                value: 'com.qpp.cgp.domain.pcresource.PCResourceLibrary',
            },
            {
                xtype: 'toolbar',
                border: '0 0 1 0',
                margin: 0,
                items: [
                    {
                        xtype: 'displayfield',
                        value: '<font color="green">' + i18n.getKey('资源管理') + '</font>',
                    }
                ]
            },
            {
                xtype: 'pcresourceitemgridv2',
                store: resourceStore,
                width: '100%',
                height: 550,
                itemId: 'resourceItemGrid',
                resourceType: resourceType,
                resourceLibraryId: resourceLibraryId
            }
        ]
    })
    page.add(form);
})
