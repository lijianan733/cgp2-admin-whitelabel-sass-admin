/**
 * Created by nan on 2018/8/9.
 */
Ext.syncRequire([
    'CGP.resourcesmanage.store.ResourcesStore',
    'CGP.resourcesmanage.model.ResourcesModel'
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
    var controller = Ext.create('CGP.resourcesmanage.controller.Controller');
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
                        id: 'resourcesmanagepage',
                        url: path + 'partials/resourcesmanage/main.html',
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
                xtype: 'textfield',
                itemId: 'resourceClass',
                name: 'resourceClass',
                fieldLabel: i18n.getKey('entityClass'),
                allowBlank: false
            },
            {
                xtype: 'textfield',
                name: 'name',
                itemId: 'name',
                fieldLabel: i18n.getKey('name'),
                allowBlank: false

            },
            {
                xtype: 'textfield',
                itemId: 'code',
                name: 'code',
                fieldLabel: i18n.getKey('code'),
                allowBlank: false

            },
            {
                xtype: 'textfield',
                itemId: 'description',
                name: 'description',
                fieldLabel: i18n.getKey('description'),
                allowBlank: false

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