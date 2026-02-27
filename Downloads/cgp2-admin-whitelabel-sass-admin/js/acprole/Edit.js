/**
 * Created by nan on 2018/8/16.
 */
Ext.syncRequire([
    'CGP.acprole.store.AcpRoleStore',
    'CGP.acprole.model.AcpRoleModel',
    'CGP.authorityeffectrange.store.AuthorityEffectRangeStore'
])
Ext.onReady(function () {
    var recordId = JSGetQueryString('id');
    var createOrEdit = Ext.isEmpty(recordId) ? 'create' : 'edit';
    var page = Ext.create('Ext.container.Viewport', {
        layout: 'fit'
    });
    var controller = Ext.create('CGP.acprole.controller.Controller');
    var mask = new Ext.LoadMask(page, {
        msg: "加载中..."
    });
    var findUnAbleRule = function (data, recordId) {
        for (var j = 0; j < data.length; j++) {
            var item = data[j];
            if (item.clazz == 'com.qpp.security.domain.acp.AccessControlPermission') {

            } else {
                if (item._id == recordId) {
                    return false;
                }
                findUnAbleRule(item['abstractACPDTOS'], recordId);
            }
        }
    };
    var store = Ext.create('CGP.authorityeffectrange.store.AuthorityEffectRangeStore', {
        //可选的规则不可包含它本身，规则的子规则中不能包含本身它，即不能包含上级权限
        listeners: {
            load: function (store, records) {
                var index = store.find('_id', recordId);
                if (index > 0) {
                    store.removeAt(index);
                }
                for (var i = 0; i < store.getCount(); i++) {
                    var record = store.data.items[i];
                    //跳过原子权限
                    if (record.get('clazz') == 'com.qpp.security.domain.acp.AccessControlPermission') {
                        continue;
                    } else {//递归遍历权限组
                        var data = record.get('abstractACPDTOS');
                        var reusult = findUnAbleRule(data, recordId);
                        if (reusult == false) {
                            store.removeAt(i);
                        }
                    }
                }
            }
        }
    });
    var form = Ext.create('Ext.form.Panel', {
        formCreateOrEdit: createOrEdit,
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
                    controller.loadRecord(recordId, form, createOrEdit, mask);
                }
            },
            btnSave: {
                handler: function (view) {
                    var form = view.ownerCt.ownerCt;
                    var resetBtn = view.ownerCt.getComponent('btnReset');
                    controller.saveFormValue(form, resetBtn, mask, form.recordId);
                }
            },
            btnGrid: {
                handler: function () {
                    JSOpen({
                        id: 'acprolepage',
                        url: path + 'partials/acprole/main.html',
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
                itemId: 'name',
                xtype: 'textfield',
                allowBlank: false,
                fieldLabel: i18n.getKey('name')
            },
            {
                name: 'description',
                itemId: 'description',
                xtype: 'textfield',
                allowBlank: false,
                fieldLabel: i18n.getKey('description')
            },
            {
                name: 'code',
                itemId: 'code',
                colspan: 2,
                xtype: 'textfield',
                allowBlank: false,
                fieldLabel: i18n.getKey('code')
            },
            {
                xtype: 'gridfieldv2',
                fieldLabel: i18n.getKey('authorityEffectRange'),
                itemId: 'privileges',
                width: 700,
                store: store,
                editable: false,
                multiSelect: true,
                name: 'acpIds',
                pickerAlign: 'bl',
                gridConfig: {
                    store: store,
                    height: 500,
                    width: '100%',
                    selType: 'checkboxmodel',
                    multiSelect: true,
                    viewConfig: {
                        stripeRows: true,
                        enableTextSelection: true
                    },
                    columns: [
                        {
                            dataIndex: '_id',
                            text: i18n.getKey('id'),
                            flex: 1
                        },
                        {
                            dataIndex: 'code',
                            text: i18n.getKey('name'),
                            flex: 3
                        },
                        {
                            dataIndex: 'description',
                            text: i18n.getKey('description'),
                            flex: 3
                        },
                        {
                            text: i18n.getKey('type'),
                            flex: 2,
                            renderer: function (value, metadata, record) {
                                var value = record.get('clazz') == 'com.qpp.security.domain.acp.AccessControlPermission' ? i18n.getKey('effectRange') : i18n.getKey('acpRole')
                                metadata.tdAttr = 'data-qtip=' + value;
                                return value;

                            }
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: store,
                        displayInfo: true,
                        displayMsg: '',
                        emptyMsg: i18n.getKey('noData')
                    })
                }
            }
        ],
        listeners: {
            'afterrender': function (view) {
                controller.loadRecord(recordId, view, createOrEdit, mask);
            }
        }
    });
    page.add(form);
})