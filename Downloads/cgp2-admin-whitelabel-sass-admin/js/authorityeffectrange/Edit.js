/**
 * Created by nan on 2018/8/13.
 */

Ext.syncRequire([
    'CGP.authorityeffectrange.model.AuthorityEffectRangeModel',
    'CGP.useableauthoritymanage.store.UseableAuthorityManageStore',
    'CGP.authorityeffectrange.store.AuthorityEffectRangeStore',
    'CGP.authorityeffectrange.view.EffectRangeConfigPanel'
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
    var store = Ext.create('CGP.useableauthoritymanage.store.UseableAuthorityManageStore');
    var store2 = Ext.create('Ext.data.TreeStore', {
        autoLoad: true,
        fields: [
            'text', 'value'
        ],
        proxy: {
            type: 'memory'
        },
        root: {
            expanded: true,
            children: []
        }
    });
    var controller = Ext.create('CGP.authorityeffectrange.controller.Controller');
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
                        id: 'authorityeffectrangepage',
                        url: path + 'partials/authorityeffectrange/main.html',
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
            columns: 2
        },
        defaults: {
            width: 250,
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
                xtype: 'textfield',
                allowBlank: false,
                fieldLabel: i18n.getKey('code')
            },
            {
                itemId: 'permissionType',
                name: 'permissionType',
                xtype: 'combo',
                editable: false,
                displayField: 'type',
                allowBlank: false,
                valueField: 'value',
                fieldLabel:  i18n.getKey('type'),
                store: Ext.create('Ext.data.Store', {
                    fields: [
                        {
                            name: 'type', type: 'string'
                        },
                        {
                            name: 'value', type: 'string'
                        }
                    ],
                    data: [
                        {
                            type: 'PERMIT',
                            value: 'PERMIT'
                        },
                        {
                            type: 'FORBID',
                            value: 'FORBID'
                        }
                    ]
                })

            },
            {
                xtype: 'datefield',
                name: 'effectiveTime',
                editable: false,
                hidden: createOrEdit == 'create' ? false : true,
                disabled: createOrEdit == 'create' ? false : true,
                itemId: 'effectiveTime',
                allowBlank: false,
                fieldLabel: i18n.getKey('enabledDate')
            },
            {
                xtype: 'datefield',
                name: 'expireTime',
                editable: false,
                hidden: createOrEdit == 'create' ? false : true,
                disabled: createOrEdit == 'create' ? false : true,
                itemId: 'expireTime',
                allowBlank: false,
                fieldLabel: i18n.getKey('expireTime')
            },
            {
                xtype: 'gridcombo',
                colspan: 2,
                fieldLabel: i18n.getKey('permission'),
                allowBlank: false,
                valueField: '_id',
                displayField: 'name',
                itemId: 'privilegeId',
                width: 555,
                store: store,
                editable: false,
                name: 'privilegeId',
                pickerAlign: 'bl',
                gridCfg: {
                    store: store,
                    height: 200,
                    width: '100%',
                    columns: [
                        {
                            xtype: 'rownumberer',
                            width: 30
                        },
                        {
                            dataIndex: '_id',
                            text: i18n.getKey('id'),
                            flex: 1
                        },
                        {
                            dataIndex: 'name',
                            flex: 2,
                            text: i18n.getKey('name')
                        },
                        {
                            dataIndex: 'description',
                            text: i18n.getKey('description'),
                            flex: 2
                        }
                    ],
                    bbar: Ext.create('Ext.PagingToolbar', {
                        store: store,
                        displayInfo: true,
                        displayMsg: '',
                        emptyMsg: i18n.getKey('noData')
                    })
                }
            },
            {
                xtype: 'fieldset',
                colspan: 2,
                width: 600,
                name: 'scope',
                itemId: 'scope',
                getName: function () {
                    var me = this;
                    return me.name
                },
                setValue: function (value) {
                    var me = this;
                    var field = me.items.items[0];
                    field.store.getRootNode().removeAll();
                    field.store.getRootNode().appendChild(controller.diyJsonToTree(value.astNode, 'scope'));
                },
                title: "<font style= ' color:green;font-weight: bold'>" + i18n.getKey('effectRange') + i18n.getKey('config') + ':</font>',
                collapsible: false,
                border: '0 0 0 0 ',
                layout: 'fit',
                defaultType: 'displayfield',
                items: [
                    Ext.create('CGP.authorityeffectrange.view.EffectRangeConfigPanel', {
                        editable: true,
                        itemId: 'scope',
                        showValue: true
                    })
                ]
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