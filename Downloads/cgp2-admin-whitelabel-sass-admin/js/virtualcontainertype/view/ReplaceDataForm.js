/**
 * Created by nan on 2021/10/8
 */

Ext.Loader.syncRequire([
    'CGP.virtualcontainertype.view.PCLayoutFieldSet',
    'CGP.virtualcontainertype.view.ScopeFunField',
    'CGP.common.field.RtTypeSelectField'
])
Ext.define('CGP.virtualcontainertype.view.ReplaceDataForm', {
    extend: "Ext.ux.form.ErrorStrickForm",
    alias: 'widget.replacedataform',
    border: false,
    autoScroll: true,
    record: null,
    isValidForItems: true,
    defaults: {
        margin: '5 25 10 50',
        width: 450
    },
    model: 'custom',//replace，custom两种模式
    initComponent: function () {
        var me = this;
        me.controller = Ext.create('CGP.virtualcontainertype.controller.Controller');
        me.items = [
            {
                xtype: 'toolbar',
                border: '0 0 1 0',
                margin: 0,
                width: '100%',
                items: [
                    {
                        xtype: 'displayfield',
                        value: '<font color="green" style="font-weight: bold" >' + i18n.getKey('baseInfo') + '</font>',
                    }
                ],
                isValid: function () {
                    return true;
                },
                getName: Ext.emptyFn,
                getValue: Ext.emptyFn,
                setValue: Ext.emptyFn,
            },
            {
                xtype: 'textfield',
                name: '_id',
                itemId: '_id',
                allowBlank: true,
                hidden: true,
                fieldLabel: i18n.getKey('_id')
            },
            {
                xtype: 'textfield',
                name: 'clazz',
                itemId: 'clazz',
                allowBlank: true,
                hidden: true,
                value: 'com.qpp.cgp.domain.pcresource.virtualcontainer.VirtualContainerType'
            },
            {
                xtype: 'textfield',
                name: 'description',
                allowBlank: false,
                itemId: 'description',
                fieldLabel: i18n.getKey('description')
            },
            {
                xtype: 'rttypeselectfield',
                name: 'argumentType',
                itemId: 'argumentType',
                fieldLabel: i18n.getKey('argumentType'),
                allowBlank: false,
                matchFieldWidth: false,
                diyGetValue: function () {
                    var me = this;
                    return {
                        clazz: "com.qpp.cgp.domain.bom.attribute.RtType",
                        _id: me.getValue()
                    }
                },
                diySetValue: function (data) {
                    var me = this;
                    me.setInitialValue(data._id);
                },
                listeners: {
                    change: function (field, newValue, oldValue) {
                        var form = field.ownerCt;
                        var controller = form.controller;
                        var contentData = controller.buildContentData(newValue);
                        var contentAttributeStore = Ext.data.StoreManager.get('contentAttributeStore');
                        contentAttributeStore.proxy.data = contentData;
                        contentAttributeStore.load();
                    }
                }
            },
            {
                xtype: 'textfield',
                name: 'compile',
                itemId: 'compile',
                hidden: true,
                fieldLabel: i18n.getKey('compile'),
                diyGetValue: function () {
                    return {
                        name: 'repeat',
                        clazz: 'com.qpp.cgp.domain.pcresource.virtualcontainer.BuildInCompile'
                    }
                },
                diySetValue: function (data) {
                }
            },
            {
                xtype: 'textfield',
                name: 'virtualContainerContents',
                itemId: 'virtualContainerContents',
                fieldLabel: i18n.getKey('repeatElement') + i18n.getKey('name'),
                allowBlank: false,
                autoScroll: true,
                editable: false,
                tipInfo: '通过该名称在数据库中查找对应的配置',
                diyGetValue: function () {
                    var me = this;
                    return [{
                        name: me.getValue(),
                        replace: false,
                        required: true
                    }]
                },
                diySetValue: function (data) {
                    var me = this;
                    if (data) {
                        me.setValue(data[0].name);
                    }
                }
            },
            {
                xtype: 'pclayoutfieldset',
                name: 'layout',
                minValue: 0,
                flex: 1,
                itemId: 'layout',
                title: i18n.getKey('layout'),
            },
            {
                xtype: 'scopefunfield',
                width: '100%',
                margin: '5 0 10 0',
                allowBlank: true,
                name: 'scopeFunc',
                itemId: 'scopeFunc',
            }
        ];
        me.callParent();
    },
    listeners: {
        afterrender: function () {
            var me = this;
            if (me.record) {
                me.setValue(me.record.getData());
            }
        }
    }
})