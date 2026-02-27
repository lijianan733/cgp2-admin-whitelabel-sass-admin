/**
 * Created by nan on 2018/8/13.
 */
Ext.syncRequire([
    'CGP.useableauthoritymanage.store.UseableAuthorityManageStore',
    'CGP.useableauthoritymanage.model.UseableAuthorityManageModel'
])
Ext.onReady(function () {
    var recordId = JSGetQueryString('id');
    var createOrEdit = Ext.isEmpty(recordId) ? 'create' : 'edit';
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var mask = new Ext.LoadMask(page, {
        msg: "加载中..."
    });
    var type = JSGetQueryString('type');
    if (!type) {
        type = 'atomPrivilege'//默认为原子权限
    }
    var findUnAbleRule = function (data, recordId) {
        for (var j = 0; j < data.length; j++) {
            var item = data[j];
            if (item.clazz != 'com.qpp.security.domain.privilege.CombinationPrivilege') {

            } else {
                if (item._id == recordId) {
                    return false;
                }
                findUnAbleRule(item['privileges'], recordId);
            }
        }
    };
    var authorityStore = Ext.create('CGP.useableauthoritymanage.store.UseableAuthorityManageStore', {
        listeners: {
            load: function (store, records) {
                var index = store.find('_id', recordId);
                if (index > 0) {
                    store.removeAt(index);
                }
                for (var i = 0; i < store.getCount(); i++) {
                    var record = store.data.items[i];
                    //跳过原子权限
                    if (record.get('clazz') != 'com.qpp.security.domain.privilege.CombinationPrivilege') {
                        continue;
                    } else {//递归遍历权限组
                        var data = record.get('privileges');
                        var reusult = findUnAbleRule(data, recordId);
                        if (reusult == false) {
                            store.removeAt(i);
                        }
                    }
                }
            }
        }
    });
    var operationStore = Ext.create('CGP.resourcesoperation.store.ResourcesOperationStore', {
        listeners: {
            load: function (store, records) {
                controller.storeLoadedCount++;
                controller.afterStoreLoad(recordId, form, createOrEdit, mask);
            }
        }
    });
    var resourcesStore = Ext.create('CGP.resourcesmanage.store.ResourcesStore', {
        listeners: {
            load: function (store, records) {
                controller.storeLoadedCount++;
                controller.afterStoreLoad(recordId, form, createOrEdit, mask);
            }
        }
    });
    var controller = Ext.create('CGP.useableauthoritymanage.controller.Controller');
    var form = Ext.create('Ext.form.Panel', {
        formCreateOrEdit: createOrEdit,//标记是否新建
        recordId: recordId,
        tbar: Ext.create('Ext.ux.toolbar.Edit', {
            btnCreate: {
                hidden: true,
                handler: function () {
                }
            },
            btnCopy: {
                hidden: true,
                handler: function () {
                }
            },
            btnReset: {
                disabled: createOrEdit == 'create' ? true : false,
                handler: function (view) {
                    var form = view.ownerCt.ownerCt;
                    controller.gridLoadRecord(recordId, form, createOrEdit, mask);
                }
            },
            btnSave: {
                handler: function (view) {
                    var form = view.ownerCt.ownerCt;
                    var resetBtn = view.ownerCt.getComponent('btnReset');
                    controller.gridSaveFormValue(form, resetBtn, mask, form.recordId);
                }
            },
            btnGrid: {
                handler: function () {
                    JSOpen({
                        id: 'useableauthoritymanagepage',
                        url: path + 'partials/useableauthoritymanage/main.html',
                        refresh: true
                    });
                }
            },
            btnConfig: {
                disabled: true,
                handler: function () {
                }
            },
            btnHelp: {
                handler: function () {
                }
            }
        }),
        layout: {
            type: 'table',
            columns: 1
        },
        defaults: {
            width: 400,
            margin: '5 5 5 5',
            labelWidth: 80,
            labelAlign: 'right',
            labelSeparator: ':<span style="color: rgb(255, 0, 0); padding-left: 2px;">*</span>'
        },
        items: [
            {
                name: 'name',
                xtype: 'textfield',
                allowBlank: false,
                itemId: 'name',
                fieldLabel: i18n.getKey('name')
            },
            {
                name: 'description',
                xtype: 'textfield',
                allowBlank: false,
                itemId: 'description',
                fieldLabel: i18n.getKey('description')
            },
            {
                name: 'code',
                xtype: 'textfield',
                allowBlank: false,
                itemId: 'code',
                fieldLabel: i18n.getKey('code')
            },
            {
                name: 'operation',
                xtype: 'combo',
                allowBlank: false,
                hidden: type == 'atomPrivilege' ? false : true,
                disabled: type == 'atomPrivilege' ? false : true,
                itemId: 'operation',
                fieldLabel: i18n.getKey('operation'),
                store: operationStore,
                displayField: 'description',
                valueField: '_id',
                queryMode: 'local',
                forceSelection: true
            },
            {
                xtype: 'gridcombo',
                fieldLabel: i18n.getKey('resources'),
                allowBlank: false,
                valueField: '_id',
                displayField: 'name',
                itemId: 'resource',
                hidden: type == 'atomPrivilege' ? false : true,
                disabled: type == 'atomPrivilege' ? false : true,
                msgTarget: 'side',
                width: 600,
                store: resourcesStore,
                editable: false,
                name: 'resource',
                pickerAlign: 'bl',
                gridCfg: {
                    store: resourcesStore,
                    height: 300,
                    width: '100%',
                    viewConfig: {
                        enableTextSelection: true,
                        stripeRows: true
                    },
                    columns: [
                        {
                            xtype: 'rownumberer'
                        },
                        {
                            dataIndex: '_id',
                            text: i18n.getKey('id'),
                            width: 80
                        },
                        {
                            dataIndex: 'name',
                            text: i18n.getKey('name'),
                            flex: 3
                        },
                        {
                            dataIndex: 'description',
                            text: i18n.getKey('description'),
                            flex: 3
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: resourcesStore,
                        displayInfo: true,
                        displayMsg: '',
                        emptyMsg: i18n.getKey('noData')
                    })
                }
            },
            {
                xtype: 'gridfieldv2',
                fieldLabel: i18n.getKey('permission'),
                itemId: 'privileges',
                width: 600,
                store: authorityStore,
                allowBlank: false,
                hidden: type != 'atomPrivilege' ? false : true,
                disabled: type != 'atomPrivilege' ? false : true,
                colspan: 2,
                editable: false,
                multiSelect: true,
                name: 'privileges',
                gridConfig: {
                    store: authorityStore,
                    height: 500,
                    width: '100%',
                    selType: 'checkboxmodel',
                    viewConfig: {
                        stripeRows: true,
                        enableTextSelection: true
                    },
                    multiSelect: true,
                    columns: [
                        {
                            xtype: 'rownumberer'
                        },
                        {
                            dataIndex: '_id',
                            text: i18n.getKey('id'),
                            flex: 1
                        },
                        {
                            dataIndex: 'name',
                            text: i18n.getKey('name'),
                            flex: 3
                        },
                        {
                            dataIndex: 'description',
                            text: i18n.getKey('description'),
                            flex: 3
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: resourcesStore,
                        displayInfo: true,
                        displayMsg: '',
                        emptyMsg: i18n.getKey('noData')
                    })
                }
            }
        ]
    });
    page.add(form);
})